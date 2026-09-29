"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Reserves = require("../models/reserves");
const Condominium = require("../models/condominio");
const Staff = require("../models/staff");
const reservesController = require("../controllers/reserves");

const VALID_ID_1 = "689c04de8afc390549efd62d";
const VALID_ID_2 = "689c04de8afc390549efd62e";

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

test("eligibleReservationDeleteFilter restricts deletion to passed checkouts", () => {
  const now = new Date("2026-08-28T12:00:00.000Z");
  assert.deepEqual(
    reservesController.eligibleReservationDeleteFilter(VALID_ID_1, now),
    {
      _id: VALID_ID_1,
      status: "Reserved",
      checkOut: { $lt: now },
    }
  );
});

test("staff role is allowed to use its condominium-scoped deletion", () => {
  assert.equal(reservesController.canDeleteReservations({ role: "STAFF" }), true);
});

test("bulk deletion reports deleted and rejected reservation ids", async () => {
  const originalFindOneAndDelete = Reserves.findOneAndDelete;
  const originalDistinct = Condominium.distinct;
  const queries = [];
  Condominium.distinct = async () => ["condo-1"];
  Reserves.findOneAndDelete = async (query) => {
    queries.push(query);
    return query._id === VALID_ID_1 ? { _id: query._id } : null;
  };

  try {
    const req = {
      user: { role: "ADMIN" },
      body: { ids: [VALID_ID_1, VALID_ID_2] },
    };
    const res = createResponse();

    await reservesController.deleteReservations(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.deletedCount, 1);
    assert.deepEqual(res.body.data.deletedIds, [VALID_ID_1]);
    assert.deepEqual(res.body.data.rejectedIds, [VALID_ID_2]);
    assert.equal(queries.length, 2);
    assert.deepEqual(queries[0].condoId, { $in: ["condo-1"] });
    assert.equal(queries.every((query) => query.status === "Reserved"), true);
    assert.equal(queries.every((query) => query.checkOut.$lt instanceof Date), true);
  } finally {
    Reserves.findOneAndDelete = originalFindOneAndDelete;
    Condominium.distinct = originalDistinct;
  }
});

test("bulk deletion rejects unauthorized callers before database access", async () => {
  const originalFindOneAndDelete = Reserves.findOneAndDelete;
  let called = false;
  Reserves.findOneAndDelete = async () => {
    called = true;
  };

  try {
    const req = { user: { role: "OWNER" }, body: { ids: [VALID_ID_1] } };
    const res = createResponse();

    await reservesController.deleteReservations(req, res);

    assert.equal(res.statusCode, 403);
    assert.equal(called, false);
  } finally {
    Reserves.findOneAndDelete = originalFindOneAndDelete;
  }
});

test("single deletion returns conflict when reservation is not eligible", async () => {
  const originalFindOneAndDelete = Reserves.findOneAndDelete;
  const originalExists = Reserves.exists;
  const originalFindById = Staff.findById;
  Reserves.findOneAndDelete = async () => null;
  Reserves.exists = async () => ({ _id: VALID_ID_1 });
  Staff.findById = () => ({
    select() {
      return this;
    },
    async lean() {
      return { condo_id: "condo-1" };
    },
  });

  try {
    const req = { user: { role: "ROLE_STAFF" }, params: { id: VALID_ID_1 } };
    const res = createResponse();

    await reservesController.deleteReservation(req, res);

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.code, "RESERVATION_NOT_DELETABLE");
  } finally {
    Reserves.findOneAndDelete = originalFindOneAndDelete;
    Reserves.exists = originalExists;
    Staff.findById = originalFindById;
  }
});

test("staff deletion is restricted to the staff assigned condominium", async () => {
  const originalFindById = Staff.findById;
  Staff.findById = () => ({
    select() {
      return this;
    },
    async lean() {
      return { condo_id: "assigned-condo" };
    },
  });

  try {
    const scope = await reservesController.getReservationDeleteScope({
      sub: VALID_ID_1,
      role: "STAFF",
    });
    assert.deepEqual(scope, { condoId: "assigned-condo" });
  } finally {
    Staff.findById = originalFindById;
  }
});
