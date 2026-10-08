"use strict";
// Reuse the existing disposable replica-set fixture, including its safety checks.
require("./platform.integration.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const express = require("express");
const { once } = require("node:events");
const User = require("../models/platformUser");
const Organization = require("../models/organization");
const Membership = require("../models/saasMembership");
const Plan = require("../models/saasPlan");
const Subscription = require("../models/saasSubscription");
const { Charge, Event } = require("../models/saasBilling");
const jwt = require("../service/jwt");
async function fixture(fn) {
  for (const Model of [Subscription, Charge, Event, ...Object.values(require("../models/platformOperations"))]) { await Model.createCollection(); await Model.createIndexes(); }
  const app = express(); app.use(express.json()); app.use("/api", require("../routes/platform")); app.use("/api", require("../routes/saas"));
  app.get("/api/iot/probe", require("../middleware/auth").authenticated, (_req, res) => res.send({ ok: true }));
  const server = app.listen(0, "127.0.0.1"); await once(server, "listening");
  const admin = await User.findOne({ role: "PLATFORM_ADMIN" }).lean();
  const token = jwt.createToken(admin);
  const request = async (route, body, method = "GET", auth = token) => {
    const res = await fetch(`http://127.0.0.1:${server.address().port}/api${route}`, { method, headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
    return { status: res.status, body: res.headers.get("content-type")?.includes("application/json") ? await res.json() : null };
  };
  try { await fn({ admin, token, request }); } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}
const freePlan = async (name, subjectType = "ORGANIZATION") => Plan.create({ name, subjectType, kind: "FREE", modules: ["dashboard", "condominiums"], isDefaultFree: true, limits: { condominiums: 1, units: 2, unitsPerCondominium: 2, residences: subjectType === "PERSONAL_OWNER" ? 1 : null } });
test("free assignment is transactional, defaults are required and reviewed migration rejects stale previews", async () => fixture(async ({ admin, request }) => {
  await Plan.updateMany({ isDefaultFree: true }, { $set: { isDefaultFree: false } });
  const orgPlan = await freePlan("Commercial free organization");
  await freePlan("Commercial free personal", "PERSONAL_OWNER");
  const org = await Organization.create({ name: "Commercial migration", slug: `commercial-${Date.now()}`, email: "commercial@example.test", ownerAdminId: new mongoose.Types.ObjectId(), status: "active" });
  const accounts = [{ subjectType: "ORGANIZATION", subjectId: String(org._id) }];
  const preview = await request("/platform/migrations/preview", { accounts, planId: orgPlan._id }, "POST"); assert.equal(preview.status, 200);
  await require("../models/condominio").create({ organizationId: org._id, alias: "new resource", typeOfProperty: "Residential", phone: "8095550000", street_1: "Test", sector_name: "Test", city: "Test", province: "Test", country: "DO", mPayment: 10, paymentDate: new Date(), status: "active", createdBy: admin._id, availableUnits: ["A1"] });
  const stale = await request("/platform/migrations/apply", { accounts, planId: orgPlan._id, reason: "Reviewed", expiresAt: preview.body.data.expiresAt, token: preview.body.data.token }, "POST"); assert.equal(stale.status, 409); assert.equal(await Membership.exists({ subjectId: org._id }), null);
  const fresh = (await request("/platform/migrations/preview", { accounts, planId: orgPlan._id }, "POST")).body.data;
  const applied = await request("/platform/migrations/apply", { accounts, planId: orgPlan._id, reason: "Reviewed", expiresAt: fresh.expiresAt, token: fresh.token }, "POST"); assert.equal(applied.status, 200);
  assert.equal((await Membership.findOne({ subjectId: org._id })).kind, "FREE");
  process.env.SAAS_MODULES_ENABLED = "true";
  try {
    assert.equal(await require("../service/saasCommercial").automationAllowed(org._id, "finance"), false);
    assert.equal(await require("../service/saasCommercial").automationAllowed(org._id, "condominiums"), true);
  } finally { delete process.env.SAAS_MODULES_ENABLED; }
  process.env.SAAS_FREE_REGISTRATION_ENABLED = "true";
  try {
    const newId = new mongoose.Types.ObjectId();
    await mongoose.connection.transaction(session => require("../service/saasCommercial").provisionFree("ORGANIZATION", newId, admin._id, session));
    assert.equal((await Membership.findOne({ subjectId: newId })).endsAt, null);
    const rollbackId = new mongoose.Types.ObjectId();
    await assert.rejects(mongoose.connection.transaction(async session => { await require("../service/saasCommercial").provisionFree("ORGANIZATION", rollbackId, admin._id, session); throw new Error("rollback"); }));
    assert.equal(await Membership.exists({ subjectId: rollbackId }), null);
  } finally { delete process.env.SAAS_FREE_REGISTRATION_ENABLED; }
}));
test("renewals missing a webhook reconcile once before expiry, refunds link to their original sale", async () => fixture(async ({ admin }) => {
  const org = await Organization.create({ name: "Reconciliation", slug: `reconciliation-${Date.now()}`, email: "reconcile@example.test", ownerAdminId: new mongoose.Types.ObjectId(), status: "active" });
  const plan = await Plan.create({ name: "Reconciled paid", kind: "PAID", subjectType: "ORGANIZATION", priceMinor: 1000, modules: ["iot"], limits: { condominiums: 2 } });
  const sub = await Subscription.create({ subjectType: "ORGANIZATION", subjectId: org._id, actorId: admin._id, planId: plan._id, terms: require("../service/saasCommercial").snapshot(plan), providerId: "I-RECONCILE", environment: "sandbox", requestKey: "reconciliation-fixture", paidThrough: new Date("2026-02-01"), state: "ACTIVE", createdAt: new Date("2026-01-01") });
  const provider = require("../service/saasPaypal"); const oldRequest = provider.request, oldVerify = provider.verifyWebhook, oldCancel = provider.cancel;
  provider.verifyWebhook = async () => {};
  provider.request = async path => path.includes("/transactions?") ? { transactions: [{ id: "SALE-MISSING-WEBHOOK", status: "COMPLETED", time: "2026-02-01T00:00:00Z", amount_with_breakdown: { gross_amount: { currency_code: "USD", value: "10.00" } } }] } : { status: "ACTIVE", custom_id: String(sub._id) };
  provider.cancel = async () => { throw new Error("a paid account must not be cancelled"); };
  try {
    const service = require("../service/saasBillingService");
    await service.settle(sub.toObject(), new Date("2026-02-09"));
    assert.equal((await Subscription.findById(sub._id)).state, "ACTIVE");
    assert.equal((await Membership.findOne({ subjectId: org._id })).endsAt.toISOString(), "2026-03-01T00:00:00.000Z");
    await service.reconcilePayments(sub.toObject(), new Date("2026-02-09"));
    assert.equal(await Charge.countDocuments({ subscriptionId: sub._id, kind: "PAYMENT" }), 1);
    await service.processWebhook({}, { id: "EV-REFUND", event_type: "PAYMENT.SALE.REFUNDED", resource: { id: "REFUND-MISSING-WEBHOOK", sale_id: "SALE-MISSING-WEBHOOK", create_time: "2026-02-02T00:00:00Z", amount: { currency: "USD", total: "2.00" } } });
    assert.equal((await Charge.findOne({ providerId: "REFUND-MISSING-WEBHOOK" })).amountMinor, 200);
    assert.equal(await Charge.countDocuments({ subjectId: org._id }), 2);
  } finally { provider.request = oldRequest; provider.verifyWebhook = oldVerify; provider.cancel = oldCancel; }
}));
test("support, notices, exports and reviewed lifecycle keep account isolation and preserve audit", async () => fixture(async ({ admin, request }) => {
  process.env.PLATFORM_OPERATIONS_ENABLED = "true"; process.env.PLATFORM_DATA_PURGE_ENABLED = "true";
  const fs = require("node:fs/promises"), path = require("node:path");
  const marker = path.resolve(__dirname, `../../tmp/backup-status-${process.pid}.json`); process.env.SAAS_BACKUP_STATUS_FILE = marker;
  const org = await Organization.create({ name: "Operations isolated", slug: `operations-${Date.now()}`, email: "ops@example.test", ownerAdminId: new mongoose.Types.ObjectId(), status: "active" });
  const outside = await Organization.create({ name: "Operations outside", slug: `outside-${Date.now()}`, email: "outside@example.test", ownerAdminId: new mongoose.Types.ObjectId(), status: "active" });
  const policy = await require("../models/platformPolicy").create({ name: "Operations review", createdBy: admin._id, permissions: ["platform.data.read", "platform.data.manage", "platform.support.read", "platform.support.manage", "platform.communications.read", "platform.communications.manage", "platform.audit.read"], status: "active" });
  const reviewer = await User.create({ name: "Reviewer", email: "reviewer@example.test", password: "test-hash", role: "PLATFORM_SUPERVISOR", status: "active", policyIds: [policy._id], scope: { mode: "SELECTED", organizationIds: [org._id], ownerIds: [] } });
  const reviewerToken = jwt.createToken(reviewer);
  try {
    assert.equal((await request("/platform/support", { subjectType: "ORGANIZATION", subjectId: outside._id, title: "Forbidden", description: "Outside scope" }, "POST", reviewerToken)).status, 403);
    assert.equal((await request("/platform/support", { subjectType: "ORGANIZATION", subjectId: org._id, title: "Connection issue", description: "A harmless diagnostic" }, "POST", reviewerToken)).status, 200);
    const preview = (await request("/platform/communications/preview", { title: "Maintenance", body: "Scheduled maintenance", mode: "SELECTED", accounts: [{ subjectType: "ORGANIZATION", subjectId: org._id }], expiresAt: new Date(Date.now() + 3600000).toISOString() }, "POST", reviewerToken)).body.data;
    assert.equal(preview.recipientCount, 1);
    assert.equal((await request("/platform/communications/publish", { preview }, "POST", reviewerToken)).status, 202);
    await require("../service/platformNoticeWorker").run(); await require("../service/platformNoticeWorker").run();
    const { Delivery, Lifecycle, Export } = require("../models/platformOperations");
    assert.equal(await Delivery.countDocuments({ subjectId: org._id }), 1); assert.equal(await Delivery.countDocuments({ subjectId: outside._id }), 0);
    const exported = await request("/platform/exports", { organizationId: org._id }, "POST", reviewerToken); assert.equal(exported.status, 202);
    await require("../service/platformExportWorker").run();
    const job = await Export.findById(exported.body.data._id); assert.equal(job.state, "READY");
    const contents = await fs.readFile(require("../service/platformExportWorker").fileFor(job._id), "utf8"); assert.ok(contents.includes(String(org._id))); assert.ok(!contents.includes(String(outside._id))); assert.ok(!contents.includes("test-hash"));
    const closed = await request("/platform/lifecycle", { organizationId: org._id, reason: "Reviewed closure" }, "POST"); const id = closed.body.data._id;
    assert.equal((await request(`/platform/lifecycle/${id}/execute`, {}, "POST")).status, 403);
    assert.equal((await request(`/platform/lifecycle/${id}/execute`, {}, "POST", reviewerToken)).status, 200);
    assert.equal((await request(`/platform/lifecycle/${id}/deletion`, { reason: "Retention" }, "POST")).status, 409);
    await Lifecycle.updateOne({ _id: id }, { $set: { eligibleAfter: new Date(Date.now() - 86400000) } });
    assert.equal((await request(`/platform/lifecycle/${id}/deletion`, { reason: "Retention completed" }, "POST")).status, 200);
    const blocked = (await request(`/platform/lifecycle/${id}/deletion-preview`, {}, "POST", reviewerToken)).body.data; assert.ok(blocked.blockers.length > 0);
    await fs.writeFile(marker, JSON.stringify({ verified: true, offsiteVerified: true, backupAt: new Date(Date.now() - 2000), restoredAt: new Date(Date.now() - 1000), artifact: "isolated-proof.enc" }));
    const deletion = (await request(`/platform/lifecycle/${id}/deletion-preview`, {}, "POST", reviewerToken)).body.data; assert.deepEqual(deletion.blockers, []);
    assert.equal((await request(`/platform/lifecycle/${id}/delete`, { preview: deletion, confirmation: "wrong" }, "POST", reviewerToken)).status, 400);
    assert.equal((await request(`/platform/lifecycle/${id}/delete`, { preview: deletion, confirmation: org.slug }, "POST", reviewerToken)).status, 200);
    assert.equal(await Organization.exists({ _id: org._id }), null); assert.ok(await Organization.exists({ _id: outside._id }));
    assert.ok(await require("../models/platformAudit").exists({ targetId: org._id, action: "platform.deletion.execute" }));
    await require("../service/platformExportWorker").run();
  } finally { delete process.env.PLATFORM_OPERATIONS_ENABLED; delete process.env.PLATFORM_DATA_PURGE_ENABLED; delete process.env.SAAS_BACKUP_STATUS_FILE; await fs.unlink(marker).catch(() => {}); }
}));
test("MFA enrollment, one-use recovery and session revocation are enforced through HTTP", async () => fixture(async ({ admin, request }) => {
  process.env.PLATFORM_MFA_ENABLED = "true"; process.env.PLATFORM_MFA_KEY = "ac".repeat(32);
  try {
    assert.equal((await request("/platform/kpis")).status, 403);
    const setup = await request("/platform/security/setup", {}, "POST"); assert.equal(setup.status, 200);
    const mfa = require("../service/platformMfa");
    const code = mfa.totp(setup.body.data.secret, Math.floor(Date.now() / 30000));
    const enrolled = await request("/platform/security/enroll", { code }, "POST"); assert.equal(enrolled.status, 200);
    assert.equal(enrolled.body.data.recoveryCodes.length, 10);
    const verifiedToken = enrolled.body.data.token;
    assert.equal((await request("/platform/kpis", null, "GET", verifiedToken)).status, 200);
    const recovered = await request("/platform/security/challenge", { code: enrolled.body.data.recoveryCodes[0] }, "POST", verifiedToken); assert.equal(recovered.status, 200);
    assert.equal((await request("/platform/kpis", null, "GET", verifiedToken)).status, 403);
    assert.equal((await request("/platform/security/challenge", { code: enrolled.body.data.recoveryCodes[0] }, "POST", recovered.body.data.token)).status, 401);
    assert.equal((await request(`/platform/security/users/${admin._id}/revoke`, {}, "POST", recovered.body.data.token)).status, 200);
    assert.equal((await request("/platform/kpis", null, "GET", recovered.body.data.token)).status, 403);
  } finally { delete process.env.PLATFORM_MFA_ENABLED; delete process.env.PLATFORM_MFA_KEY; await User.updateOne({ _id: admin._id }, { $set: { mfaEnabled: false }, $unset: { mfaSecret: "", mfaRecoveryHashes: "" } }); }
}));
test("verified duplicate PayPal sales create one charge and grace ends at free without deleting resources", async () => fixture(async ({ admin }) => {
  const org = await Organization.create({ name: "PayPal isolated", slug: `paypal-${Date.now()}`, email: "paypal@example.test", ownerAdminId: new mongoose.Types.ObjectId(), status: "active" });
  const plan = await Plan.create({ name: "Commercial paid", kind: "PAID", subjectType: "ORGANIZATION", priceMinor: 1000, modules: ["iot"], limits: { condominiums: 2 } });
  const sub = await Subscription.create({ subjectType: "ORGANIZATION", subjectId: org._id, actorId: admin._id, planId: plan._id, terms: require("../service/saasCommercial").snapshot(plan), providerId: "I-ISOLATED", environment: "sandbox", requestKey: "isolated-paypal" });
  const provider = require("../service/saasPaypal"); const verify = provider.verifyWebhook, remoteRequest = provider.request, cancel = provider.cancel;
  provider.verifyWebhook = async headers => { if (!headers.valid) throw Object.assign(new Error("forged"), { statusCode: 400 }); };
  provider.request = async path => path.includes("/transactions?") ? { transactions: [] } : { status: "ACTIVE", custom_id: String(sub._id) }; let cancels = 0; provider.cancel = async () => { cancels++; };
  try {
    const service = require("../service/saasBillingService");
    const event = { id: "EV-ISOLATED", event_type: "PAYMENT.SALE.COMPLETED", resource: { id: "SALE-ISOLATED", billing_agreement_id: sub.providerId, create_time: "2026-01-01T00:00:00Z", amount: { currency: "USD", total: "10.00" } } };
    await assert.rejects(service.processWebhook({}, event), { statusCode: 400 });
    assert.equal(await Charge.countDocuments({ subscriptionId: sub._id }), 0);
    await service.processWebhook({ valid: true }, event); await service.processWebhook({ valid: true }, event);
    assert.equal(await Charge.countDocuments({ subscriptionId: sub._id }), 1);
    const active = await Subscription.findById(sub._id).lean();
    await service.settle(active, new Date("2026-02-03"));
    assert.equal((await Membership.findOne({ subjectId: org._id })).billingStatus, "PAST_DUE");
    assert.equal(require("../service/saasMembershipService").isMembershipCurrent((await Membership.findOne({ subjectId: org._id })).toObject(), new Date("2026-02-04")), true);
    await service.settle(await Subscription.findById(sub._id).lean(), new Date("2026-02-09"));
    assert.equal((await Membership.findOne({ subjectId: org._id })).kind, "FREE"); assert.equal((await Subscription.findById(sub._id)).open, false); assert.equal(cancels, 1);
    assert.ok(await Organization.findById(org._id));
  } finally { provider.verifyWebhook = verify; provider.request = remoteRequest; provider.cancel = cancel; }
}));
