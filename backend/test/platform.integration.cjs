"use strict";
// Starts its own disposable, loopback-only replica set. Never reads MONGODB_URI.
const { before, after, test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const mongoose = require("mongoose");
const express = require("express");
const { once } = require("node:events");
const Organization = require("../models/organization");
const Condominium = require("../models/condominio");
const Owner = require("../models/owners");
const Membership = require("../models/saasMembership");
const PlatformUser = require("../models/platformUser");
const Policy = require("../models/platformPolicy");
const Plan = require("../models/saasPlan");
const { withMembershipWrite, usageFor } = require("../service/saasMembershipService");
const { createToken } = require("../service/jwt");
const { PLATFORM_PERMISSIONS } = require("../service/platformPermissions");
const { provision } = require("../scripts/provisionPlatformAdmin");
const containerName = `codex-platform-test-${process.pid}`;
let server, base, admin, token, started = false;
const id = () => new mongoose.Types.ObjectId();
const docker = args => execFileSync("docker", args, { encoding: "utf8", windowsHide: true, timeout: 60000 }).trim();
const pause = () => new Promise(resolve => setTimeout(resolve, 250));

before(async () => {
  docker(["run", "--rm", "-d", "--name", containerName, "-p", "127.0.0.1::27017", "mongo:7", "mongod", "--replSet", "platform-test", "--bind_ip_all"]);
  started = true;
  const port = docker(["port", containerName, "27017/tcp"]).split(":").pop();
  const uri = `mongodb://127.0.0.1:${port}/platform_test?directConnection=true`;
  for (let attempt = 0; ; attempt++) {
    try { await mongoose.connect(uri, { serverSelectionTimeoutMS: 500, autoCreate: false, autoIndex: false }); break; }
    catch (error) { if (attempt >= 30) throw error; await pause(); }
  }
  await mongoose.connection.db.admin().command({ replSetInitiate: { _id: "platform-test", members: [{ _id: 0, host: "localhost:27017" }] } });
  for (let attempt = 0; ; attempt++) {
    if ((await mongoose.connection.db.admin().command({ hello: 1 })).isWritablePrimary) break;
    if (attempt >= 40) throw new Error("Isolated replica set did not elect a primary");
    await pause();
  }
  for (const Model of [Organization, Condominium, Owner, Membership, PlatformUser, Policy, Plan, require("../models/platformAudit"), require("../models/platformControl"), require("../models/accessPolicy"), require("../models/accessGrant"), require("../models/historico_owner")]) {
    await Model.createCollection(); await Model.createIndexes();
  }
  process.env.JWT_SECRET = "isolated-platform-test-secret";
  const bootstrapOptions = { env: { PLATFORM_ADMIN_NAME: "Platform", PLATFORM_ADMIN_EMAIL: "platform@example.test", PLATFORM_ADMIN_PASSWORD: "test-administrator-password" }, accountModels: [], hash: password => require("bcrypt").hash(password, 4) };
  const bootstrapResults = await Promise.all([provision(bootstrapOptions), provision(bootstrapOptions)]);
  assert.equal(bootstrapResults.filter(Boolean).length, 1);
  assert.equal(await PlatformUser.countDocuments({ role: "PLATFORM_ADMIN" }), 1);
  admin = await PlatformUser.findOne({ role: "PLATFORM_ADMIN" });
  token = createToken(admin);
  const app = express(); app.use(express.json()); app.use(require("../middleware/responseContract"));
  app.use("/api", require("../routes/platform"));
  app.post("/api/login", require("../controllers/users").login);
  app.get("/api/get-properties/current", require("../middleware/auth").authenticated, (_req, res) => res.send({ status: "success", data: [] }));
  app.get("/api/iot/test", require("../middleware/auth").authenticated, (_req, res) => res.send({ status: "success", data: [] }));
  app.post("/api/iot/test", require("../middleware/auth").authenticated, (_req, res) => res.send({ status: "success", data: [] }));
  server = app.listen(0, "127.0.0.1"); await once(server, "listening");
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => { if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); } await mongoose.disconnect(); if (started) docker(["rm", "-f", containerName]); });
test("bootstrap reruns preserve the administrator and password without initial credentials", async () => {
  const original = await PlatformUser.findById(admin._id).select("+password").lean();
  assert.equal(await provision({ env: {} }), false);
  assert.equal(await PlatformUser.countDocuments({ role: "PLATFORM_ADMIN" }), 1);
  assert.deepEqual(await PlatformUser.findById(admin._id).select("+password").lean(), original);
});
async function org(label, limits = { condominiums: 1, units: 3, unitsPerCondominium: 3 }) {
  const account = await Organization.create({ name: label, slug: label.toLowerCase(), email: `${label}@example.test`, ownerAdminId: id(), status: "active" });
  await Membership.create({ subjectType: "ORGANIZATION", subjectId: account._id, plan: "Test", limits, reason: "Test", updatedBy: admin._id });
  return account;
}
function condo(organizationId, alias, count = 1) {
  return new Condominium({ organizationId, createdBy: id(), alias, typeOfProperty: "Residential", phone: "8095550000", street_1: "Test", sector_name: "Test", city: "Test", province: "Test", country: "DO", mPayment: 10, paymentDate: new Date(), units: Array.from({ length: count }, (_, i) => ({ label: `U${i}`, normalizedLabel: `u${i}` })) });
}
async function request(path, body, authToken = token, method = "GET") {
  const response = await fetch(`${base}${path}`, { method, headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, body: await response.json() };
}
test("concurrent creations serialize at the membership and only one can use the last slot", async () => {
  const account = await org("Concurrent");
  const results = await Promise.allSettled(["A", "B"].map(alias => withMembershipWrite("ORGANIZATION", account._id, session => condo(account._id, alias).save({ session }))));
  assert.equal(results.filter(r => r.status === "fulfilled").length, 1);
  assert.equal(results.find(r => r.status === "rejected").reason.code, "SAAS_LIMIT_REACHED");
  assert.equal(await Condominium.countDocuments({ organizationId: account._id }), 1);
});
test("bulk imports roll back completely when the batch exceeds capacity", async () => {
  const account = await org("Bulk");
  await assert.rejects(withMembershipWrite("ORGANIZATION", account._id, session => {
    const docs = [condo(account._id, "A"), condo(account._id, "B")];
    docs.forEach(doc => doc.$session(session));
    return Condominium.insertMany(docs, { session });
  }), { code: "SAAS_LIMIT_REACHED" });
  assert.equal(await Condominium.countDocuments({ organizationId: account._id }), 0);
});
test("unit additions and reactivation cannot bypass quota via query updates", async () => {
  const account = await org("Units", { condominiums: 2, units: 1, unitsPerCondominium: 1 });
  const saved = await withMembershipWrite("ORGANIZATION", account._id, session => condo(account._id, "A").save({ session }));
  await assert.rejects(withMembershipWrite("ORGANIZATION", account._id, session => Condominium.updateOne({ _id: saved._id }, { $push: { units: { label: "Extra", normalizedLabel: "extra" } } }, { session })), { code: "SAAS_LIMIT_REACHED" });
  assert.equal((await usageFor("ORGANIZATION", account._id)).units, 1);
  await assert.rejects(Condominium.updateOne({ _id: saved._id }, { $push: { units: { label: "Extra", normalizedLabel: "extra" } } }), { code: "SAAS_TRANSACTION_REQUIRED" });
});
test("downgrades preserve existing resources and allow reductions", async () => {
  const account = await org("Downgrade", { condominiums: 2, units: 3, unitsPerCondominium: 3 });
  const saved = await withMembershipWrite("ORGANIZATION", account._id, session => condo(account._id, "A", 3).save({ session }));
  await Membership.updateOne({ subjectId: account._id }, { $set: { "limits.units": 1, "limits.unitsPerCondominium": 1 } });
  await withMembershipWrite("ORGANIZATION", account._id, session => Condominium.updateOne({ _id: saved._id }, { $pop: { units: 1 } }, { session }));
  assert.equal((await usageFor("ORGANIZATION", account._id)).units, 2);
});
test("per-condominium limits cannot be bypassed when another condominium already exceeds the plan", async () => {
  const account = await org("PerCondo", { condominiums: 3, units: 10, unitsPerCondominium: 4 });
  await withMembershipWrite("ORGANIZATION", account._id, session => condo(account._id, "Large", 4).save({ session }));
  const small = await withMembershipWrite("ORGANIZATION", account._id, session => condo(account._id, "Small", 1).save({ session }));
  await Membership.updateOne({ subjectId: account._id }, { $set: { "limits.unitsPerCondominium": 1 } });
  await assert.rejects(withMembershipWrite("ORGANIZATION", account._id, session => Condominium.updateOne({ _id: small._id }, { $push: { units: { label: "Extra", normalizedLabel: "extra" } } }, { session })), { code: "SAAS_LIMIT_REACHED" });
});
test("personal OWNER quota is independent of organizations", async () => {
  const owner = await Owner.create({ name: "Owner", lastname: "Test", gender: "unspecified", email: "owner@example.test", phone: "8095559999", emailVerified: true, propertyDetails: [{ contextType: "PERSONAL_RESIDENCE", residenceLabel: "Home" }] });
  await Membership.create({ subjectType: "PERSONAL_OWNER", subjectId: owner._id, plan: "Personal", limits: { residences: 1 }, reason: "Test", updatedBy: admin._id });
  await assert.rejects(withMembershipWrite("PERSONAL_OWNER", owner._id, session => Owner.updateOne({ _id: owner._id }, { $push: { propertyDetails: { contextType: "PERSONAL_RESIDENCE", residenceLabel: "Second" } } }, { session })), { code: "SAAS_LIMIT_REACHED" });
  assert.equal((await usageFor("PERSONAL_OWNER", owner._id)).residences, 1);
});
test("HTTP supervisor scope filters KPIs and blocks cross-account writes and delegation escalation", async () => {
  const account = await org("Scoped");
  const policy = await Policy.create({ name: "Scoped audit", permissions: ["platform.kpis.read", "platform.accounts.read", "platform.memberships.manage", "platform.supervisors.manage"], createdBy: admin._id });
  const supervisor = await PlatformUser.create({ name: "Scoped", email: "scoped@example.test", password: "test-hash", policyIds: [policy._id], scope: { mode: "SELECTED", organizationIds: [account._id], ownerIds: [] } });
  const scopedToken = createToken(supervisor);
  const kpis = await request("/platform/kpis", null, scopedToken);
  assert.equal(kpis.status, 200); assert.equal(kpis.body.data.accounts, 1); assert.equal(kpis.body.data.organizations, 1);
  const other = await Organization.findOne({ _id: { $ne: account._id } });
  assert.equal((await request(`/platform/memberships/ORGANIZATION/${other._id}`, { reason: "forged" }, scopedToken, "PUT")).status, 403);
  assert.equal((await request("/get-properties/current", null, token)).status, 403);
  const escalation = await request("/platform/supervisors", { name: "Escalation", email: "escalation@example.test", password: "long-test-password", status: "active", policyIds: [policy._id], scope: { mode: "ALL", organizationIds: [], ownerIds: [] } }, scopedToken, "POST");
  assert.equal(escalation.status, 403); assert.equal(await PlatformUser.exists({ email: "escalation@example.test" }), null);
  await Policy.updateOne({ _id: policy._id }, { $set: { permissions: [] } });
  assert.equal((await request("/platform/kpis", null, scopedToken)).status, 403);
});
test("membership changes are audited and nullable limits can be assigned through HTTP", async () => {
  const account = await org("Membership");
  const plan = await request("/platform/plans", { name: "Unrestricted", subjectType: "ORGANIZATION", limits: { condominiums: null, units: 0, unitsPerCondominium: 0, residences: null } }, token, "POST");
  assert.equal(plan.status, 200);
  const result = await request(`/platform/memberships/ORGANIZATION/${account._id}`, { plan: "Unrestricted", status: "ACTIVE", billingStatus: "MANUAL", reason: "Controlled test" }, token, "PUT");
  assert.equal(result.status, 200);
  assert.equal(result.body.data.membership.limits.condominiums, null);
  assert.equal(result.body.data.membership.limits.units, 0);
  assert.ok(await require("../models/platformAudit").exists({ action: "membership.upsert", targetId: account._id }));
  assert.ok(PLATFORM_PERMISSIONS.includes("platform.kpis.read"));
});
test("platform login returns the platform context without credential material", async () => {
  const response = await request("/login", { email: admin.email, password: "test-administrator-password" }, token, "POST");
  assert.equal(response.status, 200); assert.equal(response.body.data.access.isPlatform, true);
  assert.equal(response.body.data.user.password, undefined);
  assert.equal(response.body.data.user.role, "PLATFORM_ADMIN");
});
test("organization policy editor reuses tenant policies and grants with a validated destination", async () => {
  const account = await org("AccessBridge");
  const StaffAdmin = require("../models/staff_admin");
  await StaffAdmin.createCollection();
  const user = await StaffAdmin.create({ organizationId: account._id, createdBy: id(), name: "Ana", lastname: "Test", gender: "unspecified", email: "staff@example.test", password: "test-hash", phone: "8095551122", position: "Auditor" });
  const response = await request(`/platform/organizations/${account._id}/access/policies`, { name: "Consulta", permissions: ["condominiums.read"] }, token, "POST");
  assert.equal(response.status, 201);
  const policy = response.body.data.message;
  const grant = await request(`/platform/organizations/${account._id}/access/grants/Staff_Admin/${user._id}`, { policyIds: [policy._id], overrides: { allow: [], deny: [] }, scope: { mode: "ALL", condominiumIds: [] } }, token, "PUT");
  assert.equal(grant.status, 200);
  const context = await require("../service/authorization").resolveAccessContext({ sub: user._id, role: "STAFF_ADMIN" });
  assert.deepEqual(context.permissions, ["condominiums.read"]);
  const endpoint = `/platform/organizations/${account._id}/access/policies`;
  const excluded = await request(endpoint, { name: "Sin IoT", permissions: [], excludedModules: ["iot"] }, token, "POST");
  assert.equal(excluded.status, 201);
  const excludedPolicy = excluded.body.data.message;
  assert.deepEqual(excludedPolicy.excludedModules, ["iot"]);
  const withIot = await request(`${endpoint}/${policy._id}`, { name: "Consulta", permissions: ["condominiums.read", "iot.read", "iot.control"] }, token, "PUT");
  assert.equal(withIot.status, 200);
  assert.equal((await request(`/platform/organizations/${account._id}/access/grants/Staff_Admin/${user._id}`, { policyIds: [policy._id, excludedPolicy._id], overrides: { allow: ["iot.read", "iot.create"], deny: [] }, scope: { mode: "ALL", condominiumIds: [] } }, token, "PUT")).status, 200);
  const excludedContext = await require("../service/authorization").resolveAccessContext({ sub: user._id, role: "STAFF_ADMIN" });
  assert.deepEqual(excludedContext.permissions, ["condominiums.read"]);
  assert.equal((await request("/iot/test", null, createToken(user))).status, 403);
  assert.equal((await request(endpoint, { name: "Invalid", excludedModules: ["unknown"] }, token, "POST")).status, 400);
  assert.equal((await request(`${endpoint}/${excludedPolicy._id}`, { name: "Sin IoT actualizado", permissions: [] }, token, "PUT")).status, 200);
  assert.deepEqual((await require("../models/accessPolicy").findById(excludedPolicy._id).lean()).excludedModules, ["iot"]);
  assert.equal((await request(`${endpoint}/${excludedPolicy._id}`, { name: "Acceso restaurado", permissions: [], excludedModules: [] }, token, "PUT")).status, 200);
  const restored = await require("../service/authorization").resolveAccessContext({ sub: user._id, role: "STAFF_ADMIN" });
  assert.ok(restored.permissions.includes("iot.read"));
  const audit = await request("/platform/audit");
  assert.equal(audit.status, 200);
  assert.ok(audit.body.data.rows.some(row => row.action === "grant.upsert" && row.source === "ORGANIZATION"));
  assert.ok(audit.body.data.rows.every(row => !row.before && !row.after));
});
test("suspended personal memberships preserve reads and reject operational writes and platform access", async () => {
  const owner = await Owner.findOne({ email: "owner@example.test" });
  await Membership.updateOne({ subjectType: "PERSONAL_OWNER", subjectId: owner._id }, { $set: { status: "SUSPENDED" } });
  const ownerToken = createToken(owner);
  assert.equal((await request("/iot/test", null, ownerToken)).status, 200);
  const denied = await request("/iot/test", { command: "test" }, ownerToken, "POST");
  assert.equal(denied.status, 403); assert.equal(denied.body.code, "SAAS_MEMBERSHIP_INACTIVE");
  assert.equal((await request("/platform/kpis", null, ownerToken)).status, 403);
});
