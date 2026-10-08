"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { assertDelegation, platformScopeAllows } = require("../service/platformPermissions");
const { isMembershipCurrent, exceededLimits, unitCount, residenceCount } = require("../service/saasMembershipService");
const { calculateKpis, limitsInput } = require("../controllers/platform");
const { requirePlatform } = require("../service/platformAuthorization");
const { provision } = require("../scripts/provisionPlatformAdmin");

test("platform bootstrap creates once and preserves the existing administrator without credentials", async () => {
  let administrator;
  let creates = 0;
  const userModel = {
    async exists() { return administrator || null; },
    async create(data) { creates++; administrator = { ...data, status: "inactive" }; }
  };
  assert.equal(await provision({ env: { PLATFORM_ADMIN_EMAIL: " ROOT@example.com ", PLATFORM_ADMIN_PASSWORD: "initial-password-123" }, userModel, accountModels: [], hash: async () => "original-hash" }), true);
  const original = structuredClone(administrator);
  assert.equal(await provision({ env: {}, userModel }), false);
  assert.equal(await provision({ env: { PLATFORM_ADMIN_EMAIL: "other@example.com", PLATFORM_ADMIN_PASSWORD: "different-password-123" }, userModel }), false);
  assert.equal(creates, 1);
  assert.deepEqual(administrator, original);
  assert.equal(administrator.email, "root@example.com");
});

test("platform bootstrap accepts a concurrent administrator creation but propagates unrelated failures", async () => {
  const env = { PLATFORM_ADMIN_EMAIL: "root@example.com", PLATFORM_ADMIN_PASSWORD: "initial-password-123" };
  let checks = 0;
  const duplicate = Object.assign(new Error("duplicate"), { code: 11000 });
  const options = { env, accountModels: [], hash: async () => "hash", userModel: {
    async exists() { return ++checks > 1; },
    async create() { throw duplicate; }
  } };
  assert.equal(await provision(options), false);
  options.userModel.exists = async () => false;
  await assert.rejects(provision(options), duplicate);
  options.userModel.create = async () => { throw new Error("database unavailable"); };
  await assert.rejects(provision(options), /database unavailable/);
});

test("platform bootstrap requires initial credentials and rejects occupied email addresses", async () => {
  const userModel = { exists: async () => false, create: async () => assert.fail("must not create an administrator") };
  await assert.rejects(provision({ env: {}, userModel, accountModels: [] }), /Configura PLATFORM_ADMIN_EMAIL/);
  await assert.rejects(provision({ env: { PLATFORM_ADMIN_EMAIL: "used@example.com", PLATFORM_ADMIN_PASSWORD: "initial-password-123" }, userModel, accountModels: [{ exists: async () => true }] }), /correo ya está registrado/);
});

test("platform delegation cannot add permissions, switch to ALL or include unassigned accounts", () => {
  const actor = { permissions: ["platform.kpis.read"], scope: { mode: "SELECTED", organizationIds: ["org-a"], ownerIds: ["owner-a"] } };
  assert.doesNotThrow(() => assertDelegation(actor, ["platform.kpis.read"], actor.scope));
  assert.throws(() => assertDelegation(actor, ["platform.supervisors.manage"], actor.scope), { statusCode: 403 });
  assert.throws(() => assertDelegation(actor, [], { mode: "ALL", organizationIds: [], ownerIds: [] }), { statusCode: 403 });
  assert.throws(() => assertDelegation(actor, [], { mode: "SELECTED", organizationIds: ["org-b"], ownerIds: [] }), { statusCode: 403 });
  assert.equal(platformScopeAllows(actor.scope, "PERSONAL_OWNER", "owner-b"), false);
  assert.equal(platformScopeAllows({ mode: "ALL" }, "INVALID", "x"), false);
});
test("membership expiry and past due status block writes while null quota is unlimited and zero is enforced", () => {
  const now = new Date("2026-10-07T12:00:00Z");
  assert.equal(isMembershipCurrent({ status: "ACTIVE", billingStatus: "CURRENT", endsAt: now }, now), false);
  assert.equal(isMembershipCurrent({ status: "ACTIVE", billingStatus: "PAST_DUE", endsAt: null }, now), false);
  assert.equal(isMembershipCurrent({ status: "ACTIVE", billingStatus: "MANUAL", endsAt: null }, now), true);
  assert.deepEqual(exceededLimits({ units: null, condominiums: 0 }, { units: 100, condominiums: 1 }), ["condominiums"]);
  assert.throws(() => limitsInput({ units: 2.5 }));
  assert.throws(() => limitsInput({ units: -1 }));
});
test("capacity includes assigned active units and personal residence counting excludes condominium units", () => {
  assert.equal(unitCount({ units: [{ status: "active", availability: "ASSIGNED" }, { status: "inactive" }], availableUnits: [] }), 1);
  assert.equal(unitCount({ units: [{ label: "A1", status: "active" }], availableUnits: ["A1", "A2"] }, ["A3", "a1"]), 3);
  assert.equal(residenceCount({ propertyDetails: [{ contextType: "PERSONAL_RESIDENCE" }, { contextType: "PERSONAL_RESIDENCE", status_property: "inactive" }, { contextType: "CONDOMINIUM_UNIT" }] }), 1);
});
test("KPI totals account for overlapping expiry, quota and billing issues without inventing revenue", () => {
  const rows = [{ subjectType: "ORGANIZATION", status: "active", usage: { condominiums: 2, units: 30, residences: 0 }, exceeded: ["condominiums"], compliance: "INACTIVE", membership: { plan: "Base", status: "SUSPENDED", billingStatus: "PAST_DUE", endsAt: "2026-10-01T00:00:00Z" } }, { subjectType: "PERSONAL_OWNER", status: "active", usage: { condominiums: 0, units: 0, residences: 1 }, exceeded: [], compliance: "UNPROVISIONED", membership: null }];
  const kpis = calculateKpis(rows, new Date("2026-10-07T12:00:00Z"));
  assert.equal(kpis.accounts, 2); assert.equal(kpis.units, 30); assert.equal(kpis.expired, 1); assert.equal(kpis.exceeded, 1); assert.equal(kpis.unprovisioned, 1); assert.equal(kpis.residences, 1);
  assert.equal(kpis.revenue, undefined);
});
test("platform endpoint authorization denies tenant administrators and missing platform permissions", () => {
  const guard = requirePlatform("platform.kpis.read");
  for (const auth of [{ isOwnerAdmin: true, permissions: ["platform.kpis.read"] }, { isPlatform: true, permissions: [] }]) {
    const response = { status(code) { this.code = code; return this; }, send() {} };
    let called = false; guard({ auth }, response, () => { called = true; });
    assert.equal(response.code, 403); assert.equal(called, false);
  }
});
