"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Staff = require("../models/staff");
const staffController = require("../controllers/staff");

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

test("staff card returns a numeric zero when the tenant has no staff", async () => {
  const originalCountDocuments = Staff.countDocuments;
  Staff.countDocuments = async () => 0;

  try {
    const id = "689c04de8afc390549efd62d";
    const req = { params: { id }, user: { sub: id, role: "ADMIN" } };
    const res = createResponse();

    await staffController.getStaffCard(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { status: "success", message: 0 });
  } finally {
    Staff.countDocuments = originalCountDocuments;
  }
});

test("staff card rejects identifiers outside the authenticated tenant", async () => {
  const req = {
    params: { id: "689c04de8afc390549efd62d" },
    user: { sub: "689c04de8afc390549efd62e", role: "ADMIN" },
  };
  const res = createResponse();

  await staffController.getStaffCard(req, res);

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.status, "forbidden");
});
