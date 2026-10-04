"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Invoice = require("../models/invoice");
const Owner = require("../models/owners");
const Condominium = require("../models/condominio");
const PaymentTransaction = require("../models/paymentTransaction");
const bankModels = require("../models/bankReconciliation");
const financeModels = require("../models/finance");
const controller = require("../controllers/finance");
const bankController = require("../controllers/bankReconciliation");
const migration = require("../scripts/migrateFinance");
const { issueInvoice } = require("../service/invoiceIssuance");
const { remainingInvoiceBalance } = require("../service/invoiceBalance");

test("financial lifecycle is atomic, scoped and compatible with legacy invoices", { skip: !process.env.FINANCE_TEST_MONGODB_URI && !process.env.FINANCE_TEST_LOCAL }, async t => {
  let uri = process.env.FINANCE_TEST_MONGODB_URI;
  if (!uri) {
    const compose = require("fs").readFileSync(require("path").join(__dirname, "../../builder.yml"), "utf8");
    const username = compose.match(/MONGO_INITDB_ROOT_USERNAME=([^\r\n]+)/)?.[1];
    const password = compose.match(/MONGO_INITDB_ROOT_PASSWORD=([^\r\n]+)/)?.[1];
    if (!username || !password) throw new Error("Local MongoDB test configuration missing");
    // Docker Desktop exposes IPv6; IPv4 can be occupied by a separate Windows mongod.
    uri = `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@[::1]:27017/?authSource=admin&directConnection=true`;
  }
  const dbName = `finance_test_${crypto.randomBytes(8).toString("hex")}`;
  await mongoose.connect(uri, { dbName, directConnection: true, serverSelectionTimeoutMS: 10000 });
  t.after(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });
  await Promise.all([Invoice, Owner, Condominium, PaymentTransaction, ...Object.values(bankModels), ...Object.values(financeModels)].map(model => model.init()));
  const oid = () => new mongoose.Types.ObjectId();
  const organizationId = oid(), condominiumId = oid(), ownerId = oid(), otherOwnerId = oid(), adminId = oid();
  const condo = { _id: condominiumId, organizationId, alias: "Financial test", mPayment: 5000, paymentDate: new Date(), status: "active", createdBy: adminId, units_ownerId: [{ ownerId, status: "active" }, { ownerId: otherOwnerId, status: "active" }] };
  await Condominium.collection.insertOne(condo);
  await Owner.collection.insertMany([
    { _id: ownerId, organizationId, name: "Test", lastname: "Owner", phone: "test-1", email: "test1@finance.invalid", status: "active", propertyDetails: [{ addressId: condominiumId, condominium_unit: "A1", status_property: "active" }] },
    { _id: otherOwnerId, organizationId, name: "Other", lastname: "Owner", phone: "test-2", email: "test2@finance.invalid", status: "active", propertyDetails: [{ addressId: condominiumId, condominium_unit: "B1", status_property: "active" }] },
  ]);
  const req = (body = {}, params = {}, query = {}, override = {}) => ({ user: { role: "ADMIN", sub: adminId }, auth: { organizationId, isOwnerAdmin: true, scope: { mode: "ALL" }, permissions: [] }, body, params, query, ...override });
  const invoke = async (method, request, target = controller) => { const res = { headersSent: false, status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; this.headersSent = true; return this; } }; await target[method](request, res); return res; };
  const key = () => crypto.randomUUID();
  const createCharge = async (unit = "A1", amount = 5000, type = "individual", owner = ownerId, dueDate = "2026-10-02") => {
    const result = await invoke("charges", req({ condominiumId, currency: "DOP", units: [{ ownerId: owner, unitNumber: unit, amount }], issueDate: "2026-10-01", dueDate, chargeType: type, description: "Financial test charge", idempotencyKey: key() }));
    assert.equal(result.statusCode, 200, JSON.stringify(result.body)); return result.body.data.docs[0];
  };

  await t.test("migration reviews duplicates, preserves legacy cash, and replaces only obsolete index", async () => {
    await Invoice.collection.createIndex({ condominiumId: 1, ownerId: 1, unitNumber: 1, issueDate: 1, paymentStatus: 1 }, { unique: true, name: "unique_monthly_unit_invoice" });
    const original = { _id: oid(), organizationId, condominiumId, ownerId, createdBy: adminId, invoice_number: "legacy-month", unitNumber: "A1", amount: 1000, paymentStatus: "completed", issueDate: new Date("2026-09-01"), description: "Monthly maintenance fee - Unit A1 - September 2026", currency: "DOP" };
    await Invoice.collection.insertOne(original);
    const preview = await migration.review(); assert.equal(preview.updates.length, 1);
    assert.equal((await Invoice.findById(original._id)).chargeType, undefined);
    await migration.apply(preview);
    const migrated = await Invoice.findById(original._id); assert.equal(migrated.chargeType, "monthly"); assert.equal(remainingInvoiceBalance(migrated), 0); assert.equal(migrated.paidAmount, undefined);
    assert.ok(!(await Invoice.collection.indexes()).some(index => index.name === "unique_monthly_unit_invoice"));
    await Invoice.collection.insertOne({ ...original, _id: oid(), invoice_number: "legacy-duplicate", sourceKey: undefined });
    assert.equal((await migration.review()).collisions.length, 1);
    await Invoice.deleteOne({ invoice_number: "legacy-duplicate" });
  });
  await t.test("staged activation requires reviewed balances and supports scoped permissions", async () => {
    const settings = { enabled: true, cashbookEnabled: true, reportsEnabled: true, lateFee: { enabled: false, mode: "fixed", value: 0, graceDays: 0 } };
    assert.equal((await invoke("saveSettings", req(settings, { id: condominiumId }))).statusCode, 400);
    assert.equal((await invoke("saveSettings", req({ ...settings, reviewed: true }, { id: condominiumId }))).statusCode, 200);
    const readonly = req({}, {}, { condominiumId }, { auth: { organizationId, scope: { mode: "ALL" }, permissions: ["finance.read"] }, user: { role: "STAFF_ADMIN", sub: adminId } });
    assert.equal((await invoke("receivables", readonly)).statusCode, 200);
    assert.equal((await invoke("charges", readonly)).statusCode, 403);
  });
  await t.test("monthly and extraordinary charges coexist and concurrent monthly emission is unique", async () => {
    await createCharge("A1", 1000, "extraordinary");
    const options = { condominium: condo, ownerId, unitNumber: "A1", amount: 5000, issueDate: "2026-10-01", dueDate: "2026-10-30", chargeType: "monthly", description: "Monthly fee", createdBy: adminId };
    const invoices = await Promise.all([issueInvoice(options), issueInvoice(options)]);
    assert.equal(String(invoices[0]._id), String(invoices[1]._id));
    assert.equal(await Invoice.countDocuments({ chargeType: "monthly", period: "2026-10" }), 1);
    const invalid = await invoke("charges", req({ condominiumId, units: [{ ownerId, unitNumber: "B1", amount: 500 }], issueDate: "2026-10-01", dueDate: "2026-10-30", chargeType: "individual", description: "Invalid owner", idempotencyKey: key() }));
    assert.equal(invalid.statusCode, 409);
    const batch = { condominiumId, units: [{ ownerId, unitNumber: "A1", amount: 700 }], issueDate: "2026-10-01", dueDate: "2026-10-30", chargeType: "extraordinary", description: "Batch idempotency", idempotencyKey: key() };
    assert.equal((await invoke("charges", req(batch))).statusCode, 200);
    assert.equal((await invoke("charges", req({ ...batch, units: [{ ownerId: otherOwnerId, unitNumber: "B1", amount: 700 }] }))).statusCode, 409);
    const before = await Invoice.countDocuments();
    const failed = await invoke("charges", req({ ...batch, idempotencyKey: key(), units: [{ ownerId, unitNumber: "A1", amount: 700 }, { ownerId, unitNumber: "B1", amount: 700 }] }));
    assert.equal(failed.statusCode, 409); assert.equal(await Invoice.countDocuments(), before);
  });
  await t.test("adjustments, credits and reversals preserve cash and cannot overconsume", async () => {
    const invoice = await createCharge();
    const credit = await bankModels.OwnerCredit.create({ organizationId, condominiumId, ownerId, unitNumber: "A1", invoiceId: invoice._id, receiptId: oid(), movementId: oid(), amountMinor: 300000, amount: 3000, currency: "DOP", createdBy: adminId });
    const adjustment = { kind: "discount", amount: 500, reason: "Approved discount", idempotencyKey: key() };
    const first = await invoke("adjustment", req(adjustment, { id: invoice._id })); assert.equal(first.statusCode, 200, JSON.stringify(first.body));
    const repeated = await invoke("adjustment", req(adjustment, { id: invoice._id })); assert.equal(String(repeated.body.data._id), String(first.body.data._id));
    assert.equal((await invoke("adjustment", req({ ...adjustment, amount: 600 }, { id: invoice._id }))).statusCode, 409);
    const attempts = await Promise.all([1, 2].map(() => invoke("applyCredit", req({ amount: 2000, reason: "Apply excess", creditId: credit._id, idempotencyKey: key() }, { id: invoice._id }))));
    assert.equal(attempts.filter(result => result.statusCode === 200).length, 1);
    let updated = await Invoice.findById(invoice._id); assert.equal(updated.paidAmount, 0); assert.equal(remainingInvoiceBalance(updated), 2500);
    const applied = attempts.find(result => result.statusCode === 200).body.data;
    assert.equal((await invoke("reverseApplication", req({ reason: "Correction", idempotencyKey: key() }, { id: applied._id }))).statusCode, 200);
    assert.equal((await bankModels.OwnerCredit.findById(credit._id)).consumedMinor, 0);
    assert.equal((await invoke("adjustment", req({ kind: "waiver", amount: 4500, reason: "Full waiver", idempotencyKey: key() }, { id: invoice._id }))).statusCode, 200);
    updated = await Invoice.findById(invoice._id); assert.equal(updated.paymentStatus, "completed"); assert.equal(updated.paidAmount, 0);
  });
  await t.test("bank reconciliation applies only debt after discount and attaches surplus to unit", async () => {
    const invoice = await createCharge("A1", 1000);
    await invoke("adjustment", req({ kind: "discount", amount: 100, reason: "Discount", idempotencyKey: key() }, { id: invoice._id }));
    const account = await bankModels.BankAccount.create({ organizationId, condominiumId, bank: "Test bank", accountLabel: "Payments", currency: "DOP", createdBy: adminId });
    const statement = await bankModels.BankStatement.create({ organizationId, condominiumId, bankAccountId: account._id, sha256: key(), fileData: Buffer.from("test"), uploadedBy: adminId, status: "committed" });
    const movement = await bankModels.BankMovement.create({ organizationId, condominiumId, bankAccountId: account._id, statementId: statement._id, date: "2026-10-02", amountMinor: 120000, amount: "1200.00", currency: "DOP", direction: "credit", fingerprint: key(), reference: "test" });
    const receipt = await bankModels.TransferReceipt.create({ organizationId, condominiumId, ownerId, invoiceId: invoice._id, bankAccountId: account._id, sha256: key(), fileData: Buffer.from("test"), uploadedBy: adminId, ocrStatus: "ready", fields: { amount: "1200.00", date: "2026-10-02", currency: "DOP", reference: "test", bank: "Test bank" } });
    const confirmed = await invoke("confirm", req({ movementId: movement._id }, { id: receipt._id }), bankController); assert.equal(confirmed.statusCode, 200, JSON.stringify(confirmed.body));
    const updated = await Invoice.findById(invoice._id); assert.equal(updated.paidAmount, 900); assert.equal(updated.balancePending, 0);
    assert.equal((await bankModels.OwnerCredit.findOne({ receiptId: receipt._id })).unitNumber, "A1");
    assert.equal((await bankModels.OwnerCredit.findOne({ receiptId: receipt._id })).amount, 300);
    assert.equal((await invoke("confirm", req({ movementId: movement._id }, { id: receipt._id }), bankController)).statusCode, 200);
    assert.equal(await PaymentTransaction.countDocuments({ invoiceId: invoice._id }), 1);
  });
  await t.test("late fees have one source per invoice despite concurrent jobs and skip historical dates", async () => {
    await createCharge("B1", 2000, "monthly", otherOwnerId, "2026-10-02");
    const settings = await financeModels.FinanceSettings.findOneAndUpdate({ organizationId, condominiumId }, { $set: { lateFee: { enabled: true, mode: "percent", value: 2, graceDays: 0, effectiveFrom: "2026-10-01" } } }, { new: true });
    await Promise.all([controller._helpers.runLateFees(settings, "2026-10-04"), controller._helpers.runLateFees(settings, "2026-10-04")]);
    const fees = await Invoice.find({ chargeType: "late_fee" });
    assert.ok(fees.length > 0); assert.equal(new Set(fees.map(fee => String(fee.sourceInvoiceId))).size, fees.length);
    const count = fees.length; await controller._helpers.runLateFees(settings, "2026-11-01"); assert.equal(await Invoice.countDocuments({ chargeType: "late_fee" }), count + 2); // Monthly and additional extraordinary reach their later due dates.
  });
  await t.test("cashbook classification, reversal, budgets and reports do not double count transfers or bank payments", async () => {
    const account = await bankModels.BankAccount.findOne({ organizationId });
    assert.equal((await invoke("openingBalance", req({ amount: 1000, date: "2026-10-01" }, { id: account._id }))).statusCode, 200);
    const expense = { condominiumId, kind: "expense", category: "Repairs", amount: 200, date: "2026-10-02", currency: "DOP", bankAccountId: account._id, reason: "Paid repair", idempotencyKey: key() };
    const response = await invoke("createEntry", req(expense)); assert.equal(response.statusCode, 200, JSON.stringify(response.body));
    assert.equal((await invoke("createEntry", req(expense))).statusCode, 200);
    assert.equal((await invoke("saveBudget", req({ condominiumId, year: 2026, currency: "DOP", lines: [{ month: 10, kind: "expense", category: "Repairs", amount: 250 }, { month: 10, kind: "income", category: "Cobros de cuotas", amount: 1200 }] }))).statusCode, 200);
    const result = await invoke("report", req({}, {}, { condominiumId, currency: "DOP", from: "2026-10-01", to: "2026-10-31" })); assert.equal(result.statusCode, 200, JSON.stringify(result.body));
    assert.equal(result.body.data.incomeMinor, 120000); assert.equal(result.body.data.expenseMinor, 20000); assert.equal(result.body.data.banks[0].calculatedBalanceMinor, 200000);
    assert.equal(result.body.data.budget.find(line => line.category === "Repairs").varianceMinor, -5000);
    assert.equal((await invoke("saveBudget", req({ condominiumId, year: 2026, currency: "DOP", revision: 0, lines: [] }))).statusCode, 409);
    const other = await bankModels.BankAccount.create({ organizationId, condominiumId, bank: "Test bank", accountLabel: "Other", currency: "DOP", createdBy: adminId });
    const transfer = await invoke("createEntry", req({ ...expense, kind: "transfer", category: "Internal", amount: 50, bankAccountId: account._id, destinationAccountId: other._id, idempotencyKey: key() })); assert.equal(transfer.statusCode, 200);
    const report = await invoke("report", req({}, {}, { condominiumId, from: "2026-10-01", to: "2026-10-31" })); assert.equal(report.body.data.expenseMinor, 20000);
    assert.equal((await invoke("reverseEntry", req({ reason: "Correction", idempotencyKey: key() }, { id: response.body.data._id }))).statusCode, 200);
  });
  await t.test("imported expenses can link to existing records and cannot also be allocated to receipts", async () => {
    const account = await bankModels.BankAccount.findOne({ organizationId, openingDate: { $exists: true } });
    const statement = await bankModels.BankStatement.create({ organizationId, condominiumId, bankAccountId: account._id, sha256: key(), fileData: Buffer.from("test"), uploadedBy: adminId, status: "committed" });
    const movement = await bankModels.BankMovement.create({ organizationId, condominiumId, bankAccountId: account._id, statementId: statement._id, date: "2026-10-02", amountMinor: 10000, amount: "100.00", currency: "DOP", direction: "debit", fingerprint: key(), reference: "EXPENSE" });
    const payload = { condominiumId, kind: "expense", category: "Water", amount: 100, date: "2026-10-02", currency: "DOP", bankAccountId: account._id, reason: "Water bill", idempotencyKey: key() };
    const entry = await invoke("createEntry", req(payload)); assert.equal(entry.statusCode, 200);
    const before = (await invoke("report", req({}, {}, { condominiumId, from: "2026-10-01", to: "2026-10-31" }))).body.data.banks.find(bank => String(bank._id) === String(account._id)).calculatedBalanceMinor;
    assert.equal((await invoke("linkEntry", req({ movementId: movement._id }, { id: entry.body.data._id }))).statusCode, 200);
    const after = (await invoke("report", req({}, {}, { condominiumId, from: "2026-10-01", to: "2026-10-31" }))).body.data.banks.find(bank => String(bank._id) === String(account._id)).calculatedBalanceMinor;
    assert.equal(after - before, 10000);
    assert.equal((await invoke("createEntry", req({ ...payload, movementId: movement._id, idempotencyKey: key() }))).statusCode, 409);
    assert.equal((await invoke("linkEntry", req({ movementId: movement._id }, { id: entry.body.data._id }))).statusCode, 200);
  });
  await t.test("confirmed cash uses Santo Domingo calendar dates and history remains paginated beyond twelve months", async () => {
    const invoice = await Invoice.findOne({ organizationId, chargeType: "monthly" });
    await PaymentTransaction.create({ organizationId, condominiumId, invoiceId: invoice._id, ownerId, provider: "TRANSFERENCIA", amount: 10, currency: "USD", idempotencyKey: key(), status: "succeeded", confirmedAt: new Date("2026-10-02T02:00:00Z") });
    const report = await invoke("report", req({}, {}, { condominiumId, currency: "USD", from: "2026-10-01", to: "2026-10-01" })); assert.equal(report.body.data.incomeMinor, 1000); assert.equal(report.body.data.rows[0].date, "2026-10-01");
    const historical = await invoke("history", req({}, {}, { condominiumId, unitNumber: "A1", from: "2020-01-01", to: "2026-12-31", limit: 2 }));
    assert.equal(historical.statusCode, 200); assert.equal(historical.body.data.docs.length, 2); assert.ok(historical.body.data.total > 2);
  });
  await t.test("owners only see their own unit relationship and organizations cannot cross-read", async () => {
    const own = { user: { role: "OWNER", sub: ownerId }, auth: { organizationId, scope: { mode: "SELECTED", condominiumIds: [condominiumId] } } };
    const result = await invoke("history", req({}, {}, { condominiumId, unitNumber: "A1", from: "2026-01-01", to: "2026-12-31" }, own)); assert.equal(result.statusCode, 200, JSON.stringify(result.body));
    assert.equal((await invoke("history", req({}, {}, { condominiumId, unitNumber: "B1" }, own))).statusCode, 403);
    const otherOrg = req({}, {}, { condominiumId }, { auth: { organizationId: oid(), isOwnerAdmin: true, scope: { mode: "ALL" } } });
    assert.equal((await invoke("receivables", otherOrg)).statusCode, 409);
    const restricted = req({}, {}, { condominiumId }, { auth: { organizationId, isOwnerAdmin: true, scope: { mode: "SELECTED", condominiumIds: [] } } });
    assert.equal((await invoke("receivables", restricted)).statusCode, 403);
  });
});
