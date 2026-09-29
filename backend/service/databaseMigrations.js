"use strict";

const StaffAdmin = require("../models/staff_admin");
const Owner = require("../models/owners");

async function dropLegacyStaffAdminGovernmentIdIndex(
  collection = StaffAdmin.collection
) {
  const indexes = await collection.indexes();
  const legacyIndex = indexes.find(
    (index) => index.key && index.key.government_id === 1
  );

  if (!legacyIndex) return false;

  await collection.dropIndex(legacyIndex.name);
  return true;
}

async function ensureOwnerPersonalIdIndexAllowsMissing(
  collection = Owner.collection
) {
  const indexes = await collection.indexes();
  const personalIdIndex = indexes.find(
    (index) => index.key && index.key.id_number === 1
  );

  if (personalIdIndex?.unique && personalIdIndex.sparse) return false;

  if (personalIdIndex) {
    await collection.dropIndex(personalIdIndex.name);
  }

  await collection.createIndex(
    { id_number: 1 },
    { name: "id_number_1", unique: true, sparse: true }
  );
  return true;
}

module.exports = {
  dropLegacyStaffAdminGovernmentIdIndex,
  ensureOwnerPersonalIdIndexAllowsMissing,
};
