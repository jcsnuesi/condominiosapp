"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const commercial = require("../service/saasCommercial");
const mfa = require("../service/platformMfa");
const { isMembershipCurrent } = require("../service/saasMembershipService");
const paypal = require("../service/saasPaypal");
const { nextMonth, subscriptionContext } = require("../service/saasBillingService");
test("legacy plans retain unlimited modules while free and paid prices are validated", () => {
  assert.equal(commercial.commercialInput({}).modules, null);
  assert.equal(commercial.commercialInput({}).kind, "LEGACY");
  assert.throws(() => commercial.commercialInput({ kind: "FREE", priceMinor: 1 }));
  assert.throws(() => commercial.commercialInput({ kind: "PAID", priceMinor: 0 }));
  assert.throws(() => commercial.commercialInput({ kind: "PAID", priceMinor: 500, isDefaultFree: true }));
  assert.throws(() => commercial.commercialInput({ currency: "DOP" }));
  assert.throws(() => commercial.commercialInput({ modules: ["root"] }));
  assert.equal(commercial.commercialInput({ kind: "FREE", isDefaultFree: true }).isDefaultFree, true);
});
test("paid modules never grant user permissions and recordings also require cameras", () => {
  assert.equal(commercial.moduleAllowed(null, "iot.control"), true);
  assert.equal(commercial.moduleAllowed([], "iot.control"), false);
  assert.equal(commercial.moduleAllowed(["cameras"], "cameras.recordings.read"), false);
  assert.equal(commercial.moduleAllowed(["cameras.recordings"], "cameras.recordings.read"), false);
  assert.equal(commercial.moduleAllowed(["cameras", "cameras.recordings"], "cameras.recordings.read"), true);
});
test("MFA matches the RFC 6238 SHA1 vector, rejects replay and permits only the clock window", () => {
  const secret = mfa.base32(Buffer.from("12345678901234567890"));
  assert.equal(secret, "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ");
  assert.equal(mfa.totp(secret, 1), "287082");
  assert.equal(mfa.verifyTotp(secret, "287082", 59000), 1);
  assert.equal(mfa.verifyTotp(secret, "287082", 59000, 1), null);
  assert.equal(mfa.verifyTotp(secret, "287082", 150000), null);
  assert.equal(mfa.verifyTotp(secret, "short", 59000), null);
});
test("MFA secrets use authenticated encryption and reject tampered ciphertext", () => {
  const original = process.env.PLATFORM_MFA_KEY; process.env.PLATFORM_MFA_KEY = "ab".repeat(32);
  try {
    const value = mfa.encrypt("TOPSECRET"); assert.equal(mfa.decrypt(value), "TOPSECRET");
    const bytes = Buffer.from(value, "base64"); bytes[bytes.length - 1] ^= 1;
    assert.throws(() => mfa.decrypt(bytes.toString("base64")));
  } finally { if (original === undefined) delete process.env.PLATFORM_MFA_KEY; else process.env.PLATFORM_MFA_KEY = original; }
});
test("grace permits operations only before its deadline and never bypasses suspension", () => {
  const member = { status: "ACTIVE", billingStatus: "PAST_DUE", endsAt: "2026-10-01", graceUntil: "2026-10-08" };
  assert.equal(isMembershipCurrent(member, new Date("2026-10-07")), true);
  assert.equal(isMembershipCurrent(member, new Date("2026-10-08")), false);
  assert.equal(isMembershipCurrent({ ...member, status: "SUSPENDED" }, new Date("2026-10-07")), false);
});
test("subscription authority comes only from the organization owner or personal owner", () => {
  assert.equal(subscriptionContext({ isOwnerAdmin: true, organizationId: "org" }, "admin").subjectId, "org");
  assert.equal(subscriptionContext({ contextType: "PERSONAL_OWNER" }, "owner").subjectType, "PERSONAL_OWNER");
  assert.throws(() => subscriptionContext({ role: "OWNER", organizationId: "org" }, "owner"), { statusCode: 403 });
  assert.throws(() => subscriptionContext({ isPlatform: true }, "platform"), { statusCode: 403 });
});
test("PayPal money conversion rejects precision loss and monthly dates clamp the last day", () => {
  assert.equal(paypal.moneyMinor("10.01"), 1001);
  assert.equal(paypal.moneyMinor("10.1"), 1010);
  assert.throws(() => paypal.moneyMinor("1.001"));
  assert.throws(() => paypal.moneyMinor("-1"));
  assert.equal(nextMonth(new Date("2026-01-31T12:00:00Z")).toISOString(), "2026-02-28T12:00:00.000Z");
});
test("PayPal webhook verification rejects missing headers without trusting event payload", async () => {
  await assert.rejects(paypal.verifyWebhook({}, { event_type: "PAYMENT.SALE.COMPLETED" }), { statusCode: 400 });
});
test("platform tokens expire in eight hours despite remember-me and include session revocation", () => {
  const jwt = require("../service/jwt"); const token = require("jsonwebtoken").decode(jwt.createToken({ _id: "id", role: "PLATFORM_ADMIN", sessionVersion: 3 }, { rememberMe: true }));
  assert.equal(token.exp - token.iat, 8 * 3600); assert.equal(token.sessionVersion, 3);
  const pending = require("jsonwebtoken").decode(jwt.createToken({ _id: "id", role: "PLATFORM_ADMIN" }, { mfaPending: true }));
  assert.equal(pending.exp - pending.iat, 900);
});
