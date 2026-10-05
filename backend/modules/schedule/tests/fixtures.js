"use strict";
const mongoose = require("mongoose"); const crypto = require("node:crypto");
const Organization = require("../../../models/organization"); const Admin = require("../../../models/admin"); const Owner = require("../../../models/owners"); const Condo = require("../../../models/condominio");
const { resolveAccessContext } = require("../../../service/authorization"); const { migrate } = require("../../../scripts/migrateSchedule");
async function fixture(uri) {
  if (!uri || !/^mongodb:\/\/127\.0\.0\.1:27028(?:\/|\?)/.test(uri)) throw new Error("Tests require dedicated localhost:27028 MongoDB");
  const dbName = `schedule_test_${crypto.randomBytes(6).toString("hex")}`;
  await mongoose.connect(uri, { dbName, autoIndex: false, autoCreate: false });
  await migrate({ apply: true });
  const id = () => new mongoose.Types.ObjectId();
  const orgId = id(), adminId = id(), foreignOrg = id(), foreignAdminId = id(), condoId = id(), foreignCondoId = id(), unitId = id(), ownerId = id(), personalOwnerId = id(), residenceId = id();
  await Organization.collection.insertMany([{ _id: orgId, name: "Schedule Test", slug: `test-${orgId}`, ownerAdminId: adminId, status: "active" }, { _id: foreignOrg, name: "Foreign", slug: `test-${foreignOrg}`, ownerAdminId: foreignAdminId, status: "active" }]);
  await Admin.collection.insertMany([{ _id: adminId, organizationId: orgId, role: "ADMIN", status: "active", email: "schedule-admin@example.test" }, { _id: foreignAdminId, organizationId: foreignOrg, role: "ADMIN", status: "active" }]);
  await Condo.collection.insertMany([{ _id: condoId, organizationId: orgId, alias: "Condominio de pruebas", status: "active", units: [{ _id: unitId, label: "101", normalizedLabel: "101", status: "active" }] }, { _id: foreignCondoId, organizationId: foreignOrg, alias: "Foreign", status: "active", units: [] }]);
  await Owner.collection.insertMany([{ _id: ownerId, name: "Ana", lastname: "Test", role: "OWNER", organizationId: orgId, status: "active", emailVerified: true, propertyDetails: [{ _id: id(), addressId: condoId, unitId, condominium_unit: "101", status_property: "active", contextType: "CONDOMINIUM_UNIT" }] }, { _id: personalOwnerId, name: "Luis", lastname: "Test", role: "OWNER", status: "active", emailVerified: true, propertyDetails: [{ _id: residenceId, contextType: "PERSONAL_RESIDENCE", residenceLabel: "Mi residencia", status_property: "active" }] }]);
  const auth = async (sub, role) => resolveAccessContext({ sub: String(sub), role });
  return { orgId, adminId, foreignOrg, foreignAdminId, condoId, foreignCondoId, unitId, ownerId, personalOwnerId, residenceId, auth, admin: await auth(adminId, "ADMIN"), foreignAdmin: await auth(foreignAdminId, "ADMIN"), owner: await auth(ownerId, "OWNER"), personal: await auth(personalOwnerId, "OWNER"),
    cleanup: async () => { if (mongoose.connection.name !== dbName || !/^schedule_test_[a-f0-9]+$/.test(dbName)) throw new Error("Unexpected test database"); await mongoose.connection.dropDatabase(); await mongoose.disconnect(); } };
}
function scheduleInput(location, now = new Date()) { return { ...location, name: "Limpieza de cisterna", frequencyType: "MONTH", frequencyValue: 4, timezone: "America/Santo_Domingo", startDate: now.toISOString(), remindBeforeDays: 7 }; }
module.exports = { fixture, scheduleInput };
