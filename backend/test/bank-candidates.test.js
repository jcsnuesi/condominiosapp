"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const controller = require("../controllers/bankReconciliation");
const { TransferReceipt, BankMovement } = require("../models/bankReconciliation");

test("imported credits outside the date window remain visible as excluded evidence", async (t) => {
  const organizationId = "507f1f77bcf86cd799439014";
  const bankAccountId = "507f1f77bcf86cd799439015";
  const fields = { amount: "48928.86", currency: "DOP", date: "2026-09-26", reference: "923732" };
  const imported = { _id: "old-credit", amountMinor: 4892886, amount: "48928.86", currency: "DOP", date: "2026-09-10", reference: "9237325 PAGO", direction: "credit" };
  t.mock.method(TransferReceipt, "findOne", async () => ({ bankAccountId, fields }));
  t.mock.method(BankMovement, "find", query => {
    assert.equal(query.organizationId, organizationId);
    assert.equal(query.bankAccountId, bankAccountId);
    assert.equal(query.allocatedReceiptId, null);
    assert.equal(query.amountMinor, 4892886);
    return { sort() { return this; }, limit() { return this; }, lean: async () => [imported, { ...imported, _id: "valid-credit", date: "2026-09-25", reference: fields.reference }] };
  });
  const req = { params: { id: "507f1f77bcf86cd799439016" }, query: {}, user: { role: "ADMIN" }, auth: { organizationId, isOwnerAdmin: true, scope: { mode: "ALL" } } };
  const res = { status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; return this; } };
  await controller.candidates(req, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data.docs.map(item => item.movement._id), ["valid-credit"]);
  const [excluded] = res.body.data.excluded;
  assert.equal(excluded.movement._id, "old-credit");
  assert.equal(excluded.eligible, false);
  assert.equal(excluded.dayDifference, 16);
  assert.deepEqual(excluded.reasons, ["date_outside_window", "reference_requires_review"]);
});
