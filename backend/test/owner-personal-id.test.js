"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const Owner = require("../models/owners");
const {
  ensureOwnerPersonalIdIndexAllowsMissing,
} = require("../service/databaseMigrations");

test("owner model allows Personal ID to be omitted", () => {
  const owner = new Owner({
    organizationId: "507f1f77bcf86cd799439011",
    name: "Test",
    lastname: "Owner",
    gender: "n/a",
    email: "test-owner@example.com",
    phone: "8090000002",
  });

  assert.equal(owner.validateSync()?.errors.id_number, undefined);
});

test("Owner Personal ID index is rebuilt as sparse when needed", async () => {
  const droppedIndexes = [];
  const createdIndexes = [];
  const collection = {
    async indexes() {
      return [
        { name: "_id_", key: { _id: 1 } },
        { name: "id_number_1", key: { id_number: 1 }, unique: true },
      ];
    },
    async dropIndex(name) {
      droppedIndexes.push(name);
    },
    async createIndex(keys, options) {
      createdIndexes.push({ keys, options });
    },
  };

  const updated = await ensureOwnerPersonalIdIndexAllowsMissing(collection);

  assert.equal(updated, true);
  assert.deepEqual(droppedIndexes, ["id_number_1"]);
  assert.deepEqual(createdIndexes, [
    {
      keys: { id_number: 1 },
      options: { name: "id_number_1", unique: true, sparse: true },
    },
  ]);
});
