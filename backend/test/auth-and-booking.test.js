"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";

const jwtService = require("../service/jwt");
const auth = require("../middleware/auth");
const Reserves = require("../models/reserves");
const bookingMiddleware = require("../middleware/validateBooking");
const userAuth = require("../middleware/userAuth");

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("createToken signs safe auth payload without password", () => {
  const token = jwtService.createToken({
    _id: "user-123",
    email: "owner@example.com",
    role: "Owner",
    password: "hashed-secret",
  });

  const decoded = jwt.decode(token, process.env.JWT_SECRET, {
    algorithms: [jwtService.algorithm],
  });

  assert.equal(decoded.sub, "user-123");
  assert.equal(decoded.email, "owner@example.com");
  assert.equal(decoded.role, "Owner");
  assert.equal(decoded.password, undefined);
  assert.equal(typeof decoded.iat, "number");
  assert.equal(typeof decoded.exp, "number");
});

test("createToken uses shorter expiration when rememberMe is disabled", () => {
  const token = jwtService.createToken(
    {
      _id: "user-123",
      email: "owner@example.com",
      role: "Owner",
    },
    { rememberMe: false }
  );

  const decoded = jwt.decode(token, process.env.JWT_SECRET, {
    algorithms: [jwtService.algorithm],
  });

  const ttlSeconds = decoded.exp - decoded.iat;
  assert.ok(ttlSeconds <= 12 * 60 * 60 + 5);
  assert.ok(ttlSeconds >= 11 * 60 * 60);
});

test("createToken uses long expiration when rememberMe is enabled", () => {
  const token = jwtService.createToken(
    {
      _id: "user-123",
      email: "owner@example.com",
      role: "Owner",
    },
    { rememberMe: true }
  );

  const decoded = jwt.decode(token, process.env.JWT_SECRET, {
    algorithms: [jwtService.algorithm],
  });

  const ttlSeconds = decoded.exp - decoded.iat;
  assert.ok(ttlSeconds <= 30 * 24 * 60 * 60 + 5);
  assert.ok(ttlSeconds >= 29 * 24 * 60 * 60);
});

test("resolveSessionExpiration exposes rememberMe metadata", () => {
  const shortSession = jwtService.resolveSessionExpiration({
    rememberMe: false,
  });
  const longSession = jwtService.resolveSessionExpiration({ rememberMe: true });

  assert.equal(shortSession.rememberMe, false);
  assert.equal(longSession.rememberMe, true);
  assert.ok(longSession.expiresInSeconds > shortSession.expiresInSeconds);
});

test("createToken requires JWT_SECRET in production", () => {
  const originalSecret = process.env.JWT_SECRET;
  const originalEnv = process.env.NODE_ENV;

  delete process.env.JWT_SECRET;
  process.env.NODE_ENV = "production";

  assert.throws(
    () =>
      jwtService.createToken({ _id: "user-123", email: "owner@example.com" }),
    /JWT_SECRET must be set in production/
  );

  process.env.JWT_SECRET = originalSecret;
  process.env.NODE_ENV = originalEnv;
});

test("authenticated middleware accepts Bearer token and assigns organization context", async () => {
  const Owner = require("../models/owners");
  const Organization = require("../models/organization");
  const originalOwnerFindById = Owner.findById;
  const originalOrganizationFindOne = Organization.findOne;
  const token = jwtService.createToken({
    _id: "user-123",
    email: "owner@example.com",
    role: "Owner",
    organizationId: "507f1f77bcf86cd799439011",
  });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = createResponse();
  let nextCalled = false;

  Owner.findById = () => ({ lean: async () => ({
    _id: "user-123", role: "OWNER", status: "active",
    organizationId: "507f1f77bcf86cd799439011", propertyDetails: [],
  }) });
  Organization.findOne = () => ({ lean: async () => ({
    _id: "507f1f77bcf86cd799439011", name: "Test", status: "active",
  }) });

  try {
    await auth.authenticated(req, res, () => {
      nextCalled = true;
    });
  } finally {
    Owner.findById = originalOwnerFindById;
    Organization.findOne = originalOrganizationFindOne;
  }

  assert.equal(nextCalled, true);
  assert.equal(req.user.sub, "user-123");
  assert.equal(req.user.email, "owner@example.com");
  assert.equal(String(req.auth.organizationId), "507f1f77bcf86cd799439011");
});

test("authenticated middleware rejects expired tokens", () => {
  const expiredToken = jwt.sign(
    { sub: "user-123", exp: Math.floor(Date.now() / 1000) - 60 },
    process.env.JWT_SECRET,
    {
      algorithm: jwtService.algorithm,
      noTimestamp: true,
    }
  );
  const req = { headers: { authorization: `Bearer ${expiredToken}` } };
  const res = createResponse();
  let nextCalled = false;

  auth.authenticated(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { message: "El token ha expirado." });
});

test("validateBookingData requires checkOut and an area value", () => {
  const req = {
    body: {
      condoId: "condo-1",
      areaToReserve: "pool",
      checkIn: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  };
  const res = createResponse();
  let nextCalled = false;

  bookingMiddleware.validateBookingData(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.status, "error");
  assert.equal(res.body.message, "Datos de reserva incompletos");
});

test("validateBookingData accepts areaId fallback when areaToReserve is absent", () => {
  const req = {
    body: {
      condoId: "condo-1",
      areaId: "pool",
      checkIn: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    },
  };
  const res = createResponse();
  let nextCalled = false;

  bookingMiddleware.validateBookingData(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
});

test("checkAvailability queries conflicts with areaToReserve fallback", async () => {
  const originalFindOne = Reserves.findOne;
  const calls = [];

  Reserves.findOne = async (query) => {
    calls.push(query);
    return null;
  };

  try {
    const req = {
      body: {
        condoId: "condo-1",
        areaId: "pool",
        checkIn: "2030-01-01T10:00:00.000Z",
        checkOut: "2030-01-01T11:00:00.000Z",
      },
    };
    const res = createResponse();
    let nextCalled = false;

    await bookingMiddleware.checkAvailability(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].condoId, "condo-1");
    assert.equal(calls[0].areaToReserve, "pool");
    assert.deepEqual(calls[0].$or, [
      {
        checkIn: { $lt: "2030-01-01T11:00:00.000Z" },
        checkOut: { $gt: "2030-01-01T10:00:00.000Z" },
      },
    ]);
  } finally {
    Reserves.findOne = originalFindOne;
  }
});

test("checkAvailability rejects overlapping bookings", async () => {
  const originalFindOne = Reserves.findOne;

  Reserves.findOne = async () => ({ _id: "existing-booking" });

  try {
    const req = {
      body: {
        condoId: "condo-1",
        areaToReserve: "pool",
        checkIn: "2030-01-01T10:00:00.000Z",
        checkOut: "2030-01-01T11:00:00.000Z",
      },
    };
    const res = createResponse();
    let nextCalled = false;

    await bookingMiddleware.checkAvailability(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      status: "error",
      message: "The selected time slot is not available",
    });
  } finally {
    Reserves.findOne = originalFindOne;
  }
});

test("inactive resident condominium scope blocks booking and family mutations", () => {
  const req = {
    user: { role: "OWNER" },
    auth: {
      scope: { mode: "SELECTED", condominiumIds: ["condo-active"] },
    },
    body: { condoId: "condo-inactive" },
    params: {},
  };
  const res = createResponse();
  let nextCalled = false;

  userAuth.requireActiveResidentCondominium(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.code, "RESIDENT_CONDOMINIUM_INACTIVE");
});

test("active resident condominium scope permits scoped mutations", () => {
  const req = {
    user: { role: "OWNER" },
    auth: {
      scope: { mode: "SELECTED", condominiumIds: ["condo-active"] },
    },
    body: { propertyId: "condo-active" },
    params: {},
  };
  const res = createResponse();
  let nextCalled = false;

  userAuth.requireActiveResidentCondominium(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
});
