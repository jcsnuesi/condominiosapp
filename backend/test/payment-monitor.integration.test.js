"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const Invoice = require("../models/invoice");
const Transaction = require("../models/paymentTransaction");
const Owner = require("../models/owners");
const Condominium = require("../models/condominio");
const monitor = require("../controllers/paymentMonitor");

test("invoice monitor includes invoices before payment and keeps scoped payment filters", {
  skip: !process.env.PAYMENT_MONITOR_TEST_MONGODB_URI,
}, async (t) => {
  const dbName = `payment_monitor_test_${crypto.randomBytes(8).toString("hex")}`;
  await mongoose.connect(process.env.PAYMENT_MONITOR_TEST_MONGODB_URI, { dbName, autoIndex: false });
  t.after(async () => {
    assert.equal(mongoose.connection.name, dbName);
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  const oid = () => new mongoose.Types.ObjectId();
  const organizationId = oid(), condominiumId = oid(), ownerId = oid();
  const otherCondo = oid(), otherOwner = oid(), foreignOrganization = oid();
  await Owner.collection.insertMany([
    { _id: ownerId, organizationId, name: "Ana", lastname: "Perez", email: "ana@example.test", phone: "8090000001" },
    { _id: otherOwner, organizationId: foreignOrganization, name: "Foreign", lastname: "Owner" },
  ]);
  await Condominium.collection.insertOne({ _id: condominiumId, organizationId, alias: "Residencial Test" });
  const pending = {
    _id: oid(), organizationId, condominiumId, ownerId, unitNumber: "002",
    amount: 1000, currency: "DOP", paymentStatus: "pending",
    issueDate: new Date("2026-10-28T04:00:00Z"), dueDate: new Date("2026-11-28T04:00:00Z"),
  };
  const paid = { ...pending, _id: oid(), unitNumber: "003", paymentStatus: "completed" };
  await Invoice.collection.insertMany([
    pending, paid,
    { ...pending, _id: oid(), ownerId: otherOwner, unitNumber: "001" },
    { ...pending, _id: oid(), condominiumId: otherCondo },
    { ...pending, _id: oid(), organizationId: foreignOrganization },
  ]);
  const transaction = {
    _id: oid(), organizationId, condominiumId, ownerId, invoiceId: paid._id,
    provider: "TOKE", amount: 1000, currency: "DOP", status: "succeeded",
    reconciliationStatus: "matched", attemptedAt: new Date("2026-10-29T23:59:59Z"),
  };
  await Transaction.collection.insertMany([
    transaction,
    { ...transaction, _id: oid(), organizationId: foreignOrganization, invoiceId: pending._id },
    { ...transaction, _id: oid(), ownerId: otherOwner, invoiceId: pending._id },
  ]);
  async function query(query = {}, overrides = {}) {
    const req = {
      user: { role: "OWNER", sub: String(ownerId) },
      auth: { organizationId: String(organizationId), scope: { mode: "SELECTED", condominiumIds: [String(condominiumId)] } },
      query, ...overrides,
    };
    const res = { status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; return this; } };
    await monitor.invoices(req, res);
    assert.equal(res.statusCode, 200, JSON.stringify(res.body));
    return res.body.data;
  }

  await t.test("unpaid invoice is visible without fabricating an attempted payment", async () => {
    const result = await query();
    assert.equal(result.total, 2);
    const row = result.docs.find((doc) => String(doc.invoiceId) === String(pending._id));
    assert.equal(row.rowType, "invoice");
    assert.equal(row.amount, 1000);
    assert.equal(row.ownerName, "Ana Perez");
    assert.equal(row.ownerPhone, "8090000001");
    assert.equal(row.ownerEmail, "ana@example.test");
    assert.equal(row.condominiumAlias, "Residencial Test");
    assert.equal(row.invoicePaymentStatus, "pending");
    assert.equal(row.status, "pending");
    assert.equal(row.reconciliationStatus, "not_started");
    assert.equal(row.provider, null);
    assert.equal(row.attemptedAt, null);
    assert.equal(row.confirmedAt, null);
    assert.equal(await Transaction.countDocuments({ organizationId, invoiceId: pending._id, ownerId }), 0);
  });
  await t.test("PDF data uses invoice totals and payment status instead of attempt totals", async () => {
    await Transaction.collection.updateOne({ _id: transaction._id }, { $set: { amount: 600 } });
    const result = await query({ invoiceId: String(paid._id) });
    assert.equal(result.docs[0].amount, 600);
    assert.equal(result.docs[0].invoiceAmount, 1000);
    assert.equal(result.docs[0].invoicePaymentStatus, "completed");
    assert.equal(result.docs[0].ownerName, "Ana Perez");
  });
  await t.test("dates use issue date without an attempt and attempt date otherwise", async () => {
    assert.equal((await query({ attemptedFrom: "2026-10-01", attemptedTo: "2026-10-02" })).total, 0);
    const issued = await query({ attemptedFrom: "2026-10-28", attemptedTo: "2026-10-28" });
    assert.equal(issued.total, 1);
    assert.equal(String(issued.docs[0].invoiceId), String(pending._id));
    const attempted = await query({ attemptedFrom: "2026-10-29", attemptedTo: "2026-10-29" });
    assert.equal(attempted.total, 1);
    assert.equal(String(attempted.docs[0]._id), String(transaction._id));
  });
  await t.test("payment, unit and ID filters do not create phantom pending rows", async () => {
    assert.equal((await query({ provider: "AZUL" })).total, 0);
    assert.equal((await query({ provider: "TOKE" })).total, 1);
    assert.equal((await query({ status: "pending" })).total, 1);
    assert.equal((await query({ reconciliationStatus: "not_started" })).total, 1);
    assert.equal((await query({ reconciliationStatus: "matched" })).total, 1);
    assert.equal((await query({ unitNumber: "002" })).total, 1);
    assert.equal((await query({ invoiceId: String(paid._id) })).total, 1);
    assert.equal((await query({ ownerId: String(otherOwner) })).total, 2);
  });
  await t.test("pagination and administrator scope include all authorized invoices", async () => {
    const first = await query({ limit: "1", page: "1" });
    const second = await query({ limit: "1", page: "2" });
    assert.equal(first.total, 2);
    assert.equal(second.total, 2);
    assert.notEqual(String(first.docs[0]._id), String(second.docs[0]._id));
    const admin = await query({ condominiumId: String(condominiumId) }, {
      user: { role: "ADMIN", sub: String(oid()) },
      auth: { organizationId: String(organizationId), scope: { mode: "ALL" } },
    });
    assert.equal(admin.total, 3);
    assert.equal(admin.docs.find((row) => String(row.ownerId) === String(otherOwner)).ownerName, "");
    const scoped = await query({}, { user: { role: "STAFF_ADMIN", sub: String(oid()) } });
    assert.equal(scoped.total, 3);
  });
  await t.test("real attempts replace the invoice-only row and retain individual IDs", async () => {
    await Transaction.collection.insertMany([
      { ...transaction, _id: oid(), invoiceId: pending._id, status: "failed" },
      { ...transaction, _id: oid(), invoiceId: pending._id, status: "processing" },
    ]);
    const result = await query({ invoiceId: String(pending._id) });
    assert.equal(result.total, 2);
    assert.ok(result.docs.every((row) => row.rowType === "transaction"));
    assert.equal((await query({ status: "pending" })).total, 0);
  });
});
