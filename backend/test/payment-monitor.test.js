"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const monitor = require("../controllers/paymentMonitor");
const payment = require("../controllers/payment");
const Owner = require("../models/owners");
const Condominium = require("../models/condominio");
const Invoice = require("../models/invoice");
const Transaction = require("../models/paymentTransaction");

const condo = "507f1f77bcf86cd799439011";
const owner = "507f1f77bcf86cd799439012";
const otherCondo = "507f1f77bcf86cd799439013";
const organization = "507f1f77bcf86cd799439014";
const invoice = "507f1f77bcf86cd799439015";
function request(role = "ADMIN", query = {}) {
  return {
    user: { role, sub: owner },
    auth: { organizationId: organization, scope: { mode: role === "ADMIN" ? "ALL" : "SELECTED", condominiumIds: [condo] } },
    query,
  };
}
function response() {
  return { status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; return this; } };
}
function chain(result) {
  return { select() { return this; }, populate() { return this; }, sort() { return this; },
    skip() { return this; }, limit() { return this; }, lean: async () => result };
}

test("empty filters do not generate random invoice or condominium IDs", () => {
  assert.deepEqual(payment._helpers.buildTransactionFilters(request()).filters, {});
});

test("provider filters support Toke and transfers; hidden banks never filter other providers", () => {
  for (const provider of ["TOKE", "TRANSFERENCIA"]) {
    const result = payment._helpers.buildTransactionFilters(request("ADMIN", { provider, bankName: "Otros" }));
    assert.equal(result.filters.provider, provider);
    assert.equal(result.filters.bankName, provider === "TRANSFERENCIA" ? "Otros" : undefined);
  }
  assert.equal(payment._helpers.buildTransactionFilters(request("ADMIN", { provider: "custom provider" })).filters.provider, "CUSTOM PROVIDER");
  assert.ok(payment._helpers.buildTransactionFilters(request("ADMIN", { provider: "x".repeat(81) })).error);
});

test("dates include the entire to day and reject reversed ranges", () => {
  const result = payment._helpers.buildTransactionFilters(request("ADMIN", { attemptedFrom: "2026-09-01", attemptedTo: "2026-09-30" }));
  assert.equal(result.filters.attemptedAt.$lte.toISOString(), "2026-09-30T23:59:59.999Z");
  assert.ok(payment._helpers.buildTransactionFilters(request("ADMIN", { attemptedFrom: "2026-10-01", attemptedTo: "2026-09-30" })).error);
});

test("owner options use only their active registered properties and deduplicate units", async (t) => {
  t.mock.method(Owner, "find", (filter) => {
    assert.equal(filter.organizationId, organization);
    assert.equal(filter._id, owner);
    return chain([{ propertyDetails: [
      { addressId: condo, condominium_unit: "A1", status_property: "active" },
      { addressId: condo, condominium_unit: "A1", status_property: "active" },
      { addressId: condo, condominium_unit: "B2", status_property: "inactive" },
      { addressId: otherCondo, condominium_unit: "C3", status_property: "active" },
    ] }]);
  });
  t.mock.method(Condominium, "find", (filter) => {
    assert.equal(filter.organizationId, organization);
    assert.ok(filter._id.$in.every((id) => id === condo));
    return chain([{ _id: condo, alias: "Mi propiedad" }]);
  });
  const res = response();
  await monitor.options(request("OWNER"), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data, [{ value: condo, label: "Mi propiedad", units: ["A1"] }]);
});

test("organization options include condos without owners and only assigned units", async (t) => {
  t.mock.method(Owner, "find", (filter) => {
    assert.equal(filter._id, undefined);
    return chain([{ propertyDetails: [{ addressId: condo, condominium_unit: "2" }] }]);
  });
  t.mock.method(Condominium, "find", (filter) => {
    assert.deepEqual(filter, { organizationId: organization });
    return chain([{ _id: condo, alias: "A" }, { _id: otherCondo, alias: "B" }]);
  });
  const res = response();
  await monitor.options(request(), res);
  assert.deepEqual(res.body.data.map((row) => row.units), [["2"], []]);
});

test("owners cannot load transactions outside their condo scope", async () => {
  const req = request("OWNER", { condominiumId: otherCondo, attemptedFrom: "2026-09-01", attemptedTo: "2026-09-30" });
  for (const handler of [payment.listPaymentTransactions]) {
    const res = response();
    await handler(req, res);
    assert.equal(res.statusCode, 403);
  }
});

test("transaction unit filter joins invoices and preserves owner and organization scope", async (t) => {
  t.mock.method(Invoice, "distinct", async (field, filter) => {
    assert.equal(filter.organizationId, organization);
    assert.equal(String(filter.ownerId), owner);
    assert.equal(filter.unitNumber, "A1");
    return [invoice];
  });
  t.mock.method(Transaction, "find", (filter) => {
    assert.equal(filter.organizationId, organization);
    assert.equal(String(filter.ownerId), owner);
    assert.deepEqual(filter.invoiceId, { $in: [invoice] });
    return chain([]);
  });
  t.mock.method(Transaction, "countDocuments", async () => 0);
  const res = response();
  await payment.listPaymentTransactions(request("OWNER", { condominiumId: condo, unitNumber: "A1" }), res);
  assert.equal(res.statusCode, 200);
});

test("transaction rows include invoice dates and unit without changing invoiceId", async (t) => {
  const issueDate = new Date("2026-09-01");
  const dueDate = new Date("2026-09-15");
  t.mock.method(Transaction, "find", () => {
    const query = chain([{ invoiceId: { _id: invoice, unitNumber: "A1", issueDate, dueDate }, provider: "TOKE" }]);
    query.populate = (options) => {
      assert.deepEqual(options.match, { organizationId: organization });
      assert.equal(options.path, "invoiceId");
      return query;
    };
    return query;
  });
  t.mock.method(Transaction, "countDocuments", async () => 1);
  const res = response();
  await payment.listPaymentTransactions(request(), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data.docs[0], { invoiceId: invoice, provider: "TOKE", unitNumber: "A1", issueDate, dueDate });
});
