"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  evaluatePermissions,
  hasPermission,
  canAccessCondominium,
  buildPersonalOwnerAccessContext,
} = require("../service/authorization");
const { requirePermission } = require("../middleware/organizationAuth");
const authMiddleware = require("../middleware/auth");

test("permission evaluation unions policies and allows while deny wins", () => {
  const result = evaluatePermissions(
    ["owners.read", "owners.update"],
    ["owners.create", "owners.read"],
    ["owners.update"]
  );
  assert.deepEqual(result.sort(), ["owners.create", "owners.read"]);
});

test("permission evaluation defaults to no access", () => {
  assert.deepEqual(evaluatePermissions([], [], []), []);
  assert.equal(hasPermission({ permissions: [] }, "owners.read"), false);
});

test("excluded modules override policy unions and explicit allows, including nested modules", () => {
  const permissions = evaluatePermissions(
    ["dashboard.read", "iot.read", "iot.control", "cameras.read", "cameras.recordings.read"],
    ["iot.create", "iot.history", "cameras.live"], [], ["iot", "cameras"]
  );
  assert.deepEqual(permissions, ["dashboard.read"]);
  assert.deepEqual(evaluatePermissions(["cameras.read", "cameras.recordings.read"], [], [], ["cameras.recordings"]), ["cameras.read"]);
});

test("personal owner context is isolated and only exists for verified owners with an active residence", () => {
  const context = buildPersonalOwnerAccessContext({
    _id: "owner-1",
    role: "OWNER",
    status: "active",
    emailVerified: true,
    propertyDetails: [
      {
        _id: "residence-1",
        contextType: "PERSONAL_RESIDENCE",
        status_property: "active",
      },
      {
        _id: "inactive-residence",
        contextType: "PERSONAL_RESIDENCE",
        status_property: "inactive",
      },
    ],
  });

  assert.equal(context.contextType, "PERSONAL_OWNER");
  assert.equal(context.organizationId, null);
  assert.deepEqual(context.scope.residenceIds, ["residence-1"]);
  assert.deepEqual(context.permissions, [
    "schedules.read", "schedules.create", "schedules.update",
    "maintenance.read", "maintenance.update",
    "vendors.read", "vendors.create", "vendors.update",
    "iot.read",
    "iot.create",
    "iot.update",
    "iot.delete",
    "iot.control",
    "iot.history",
  ]);
  assert.equal(
    buildPersonalOwnerAccessContext({
      role: "OWNER",
      emailVerified: false,
      propertyDetails: [
        { _id: "residence-1", contextType: "PERSONAL_RESIDENCE" },
      ],
    }),
    null
  );
  assert.equal(
    buildPersonalOwnerAccessContext({
      role: "OWNER",
      emailVerified: true,
      propertyDetails: [
        {
          _id: "condo-unit",
          contextType: "CONDOMINIUM_UNIT",
          addressId: "condo-1",
        },
      ],
    }),
    null
  );
});

test("ALL scope accepts every condominium", () => {
  assert.equal(
    canAccessCondominium(
      { scope: { mode: "ALL", condominiumIds: [] } },
      "condo-2"
    ),
    true
  );
});

test("personal owner route allowlist denies organization routes", () => {
  assert.equal(
    authMiddleware.isPersonalOwnerRouteAllowed({
      baseUrl: "/api",
      path: "/iot/my/contexts",
    }),
    true
  );
  assert.equal(
    authMiddleware.isPersonalOwnerRouteAllowed({
      baseUrl: "/api",
      path: "/auth/me",
    }),
    true
  );
  assert.equal(
    authMiddleware.isPersonalOwnerRouteAllowed({
      baseUrl: "/api",
      path: "/payments",
    }),
    false
  );
});

test("SELECTED scope only accepts explicitly assigned condominiums", () => {
  const context = { scope: { mode: "SELECTED", condominiumIds: ["condo-1"] } };
  assert.equal(canAccessCondominium(context, "condo-1"), true);
  assert.equal(canAccessCondominium(context, "condo-2"), false);
});

test("permission middleware rejects a forged condominium outside scope", () => {
  const middleware = requirePermission("owners.update", {
    getCondominiumId: (req) => req.params.condoId,
  });
  const req = {
    params: { condoId: "condo-2" },
    auth: {
      permissions: ["owners.update"],
      scope: { mode: "SELECTED", condominiumIds: ["condo-1"] },
    },
  };
  let responseStatus;
  const res = {
    status(status) {
      responseStatus = status;
      return this;
    },
    send(body) {
      return body;
    },
  };
  middleware(req, res, () => assert.fail("next should not be called"));
  assert.equal(responseStatus, 403);
});

test("organization-wide operations require ALL scope", () => {
  const middleware = requirePermission("condominiums.create", {
    organizationWide: true,
  });
  const req = {
    auth: {
      permissions: ["condominiums.create"],
      scope: { mode: "SELECTED", condominiumIds: ["condo-1"] },
    },
  };
  let responseStatus;
  const res = {
    status(status) {
      responseStatus = status;
      return this;
    },
    send(body) {
      return body;
    },
  };
  middleware(req, res, () => assert.fail("next should not be called"));
  assert.equal(responseStatus, 403);
});

test("organization-wide operations accept an ALL scope expressed with mode", () => {
  const middleware = requirePermission("condominiums.create", {
    organizationWide: true,
  });
  const req = {
    auth: {
      permissions: ["condominiums.create"],
      scope: { mode: "ALL", condominiumIds: [] },
    },
  };
  const res = {
    status() {
      return this;
    },
    send(body) {
      return body;
    },
  };
  let nextCalled = false;

  middleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});

test("staff IoT command routes map to iot.control instead of iot.create", () => {
  const {
    enforceAdministrativePermission,
  } = require("../middleware/organizationAuth");
  const req = {
    auth: {
      role: "STAFF",
      permissions: ["iot.control"],
      scope: { mode: "SELECTED", condominiumIds: [] },
    },
    path: "/iot/devices/device-1/commands",
    method: "POST",
  };
  let nextCalled = false;
  const res = {
    status(status) {
      this.statusCode = status;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };

  enforceAdministrativePermission(req, res, () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);
});
