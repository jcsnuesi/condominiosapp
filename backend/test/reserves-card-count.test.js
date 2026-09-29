"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const Owner = require("../models/owners");
const Reserves = require("../models/reserves");
const reservesController = require("../controllers/reserves");

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

test("booking card counts non-Guest reservations expiring today", async () => {
  const originalOwnerFind = Owner.find;
  const originalCountDocuments = Reserves.countDocuments;
  const countQueries = [];

  Owner.find = () => ({
    select() {
      return this;
    },
    async lean() {
      return [];
    },
  });
  Reserves.countDocuments = async (query) => {
    countQueries.push(query);
    return countQueries.length === 1 ? 7 : 2;
  };

  try {
    const req = {
      params: { id: "689c04de8afc390549efd62d" },
      user: { sub: "689c04de8afc390549efd62d", role: "ADMIN" },
    };
    const res = createResponse();

    await reservesController.getBookingsCountByIdentifier(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      success: true,
      data: {
        total: 7,
        expiringToday: 2,
      },
      error: null,
      code: "BOOKING_COUNTS_FETCHED",
    });
    assert.equal(countQueries.length, 2);
    assert.deepEqual(countQueries[1].status, { $ne: "Guest" });
    assert.equal(countQueries[1].checkOut.$gte.getUTCHours(), 4);
    assert.equal(countQueries[1].checkOut.$gte.getUTCMinutes(), 0);
    assert.equal(
      countQueries[1].checkOut.$lt - countQueries[1].checkOut.$gte,
      24 * 60 * 60 * 1000
    );
    assert.equal(countQueries[1].checkOut.$lt > countQueries[1].checkOut.$gte, true);
  } finally {
    Owner.find = originalOwnerFind;
    Reserves.countDocuments = originalCountDocuments;
  }
});

test("booking card rejects identifiers outside the authenticated tenant", async () => {
  const req = {
    params: { id: "689c04de8afc390549efd62d" },
    user: { sub: "689c04de8afc390549efd62e", role: "ADMIN" },
  };
  const res = createResponse();

  await reservesController.getBookingsCountByIdentifier(req, res);

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.status, "forbidden");
});
