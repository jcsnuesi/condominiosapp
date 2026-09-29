"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const StaffAdmin = require("../models/staff_admin");
const Staff = require("../models/staff");
const StaffController = require("../controllers/staff");
const {
  dropLegacyStaffAdminGovernmentIdIndex,
} = require("../service/databaseMigrations");

test("staff model does not define or retain government ID", () => {
  assert.equal(Staff.schema.path("government_id"), undefined);

  const staff = new Staff({
    name: "Test",
    lastname: "Staff",
    gender: "n/a",
    government_id: "legacy-value",
    email: "test-staff@example.com",
    password: "hashed-password",
    phone: "8090000001",
    position: "manager",
    condo_id: "507f1f77bcf86cd799439011",
  });

  assert.equal(staff.toObject().government_id, undefined);
  assert.equal(staff.validateSync()?.errors.government_id, undefined);
});

test("staff admin model does not define or retain government ID", () => {
  assert.equal(StaffAdmin.schema.path("government_id"), undefined);

  const staffAdmin = new StaffAdmin({
    name: "Test",
    lastname: "Admin",
    gender: "n/a",
    government_id: "legacy-value",
    email: "test-admin@example.com",
    password: "hashed-password",
    phone: "8090000000",
    position: "manager",
  });

  assert.equal(staffAdmin.toObject().government_id, undefined);
});

test("staff admin duplicate validation only checks normalized email", async () => {
  const originalFindOne = StaffAdmin.findOne;
  let duplicateQuery;

  StaffAdmin.findOne = async (query) => {
    duplicateQuery = query;
    return { _id: "existing-staff-admin" };
  };

  const response = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(payload) {
      this.payload = payload;
      return this;
    },
  };

  try {
    await StaffController.createAdmin(
      {
        body: {
          name: "Test",
          lastname: "Admin",
          gender: "n/a",
          government_id: "ignored-legacy-value",
          email: " TEST-ADMIN@EXAMPLE.COM ",
          phone: "8090000000",
          position: "manager",
        },
        auth: { organizationId: "507f1f77bcf86cd799439011" },
        user: { sub: "507f1f77bcf86cd799439012" },
      },
      response
    );
  } finally {
    StaffAdmin.findOne = originalFindOne;
  }

  assert.deepEqual(duplicateQuery, { email: "test-admin@example.com" });
  assert.equal(response.statusCode, 409);
  assert.equal(
    response.payload.message,
    "A Staff Admin with this email already exists"
  );
});

test("legacy Staff Admin government ID index is removed when present", async () => {
  const droppedIndexes = [];
  const collection = {
    async indexes() {
      return [
        { name: "_id_", key: { _id: 1 } },
        { name: "government_id_1", key: { government_id: 1 } },
      ];
    },
    async dropIndex(name) {
      droppedIndexes.push(name);
    },
  };

  const removed = await dropLegacyStaffAdminGovernmentIdIndex(collection);

  assert.equal(removed, true);
  assert.deepEqual(droppedIndexes, ["government_id_1"]);
});
