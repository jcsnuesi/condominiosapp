"use strict";
const mongoose = require("mongoose");
const api = require("../service/apiResponse");
const Invoice = require("../models/invoice");
const Owner = require("../models/owners");
const Condominium = require("../models/condominio");
const PaymentTransaction = require("../models/paymentTransaction");
const { BankAccount, BankMovement, BankStatement, OwnerCredit } = require("../models/bankReconciliation");
const { FinanceSettings, FinanceApplication, FinanceEntry, FinanceBudget, FinanceChargeBatch } = require("../models/finance");
const { id, access, scope, condominium, enabled, findScoped, migrationReady } = require("../service/financeAccess");
const { problem, bounded, moneyMinor, dateOnly, currencyCode } = require("../service/bankReconciliationRules");
const { unitKey, operationKey, signedMinor, balanceMinor, refreshInvoice, lateFeeMinor, csv } = require("../service/financeRules");
const { issueInvoice } = require("../service/invoiceIssuance");
const { activeOwnerPropertyDetails } = require("../service/residentPropertyAccess");
const reporting = require("../service/financeReporting");

function today() { return new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Santo_Domingo" }).format(new Date()); }
function reason(value) { const text = bounded(value, 500); if (text.length < 3) throw problem("Indique el motivo (mínimo 3 caracteres)"); return text; }
function pagination(req) {
  const page = Number(req.query.page || 1), limit = Number(req.query.limit || 50);
  if (!Number.isInteger(page) || page < 1 || page > 100000 || !Number.isInteger(limit) || limit < 1 || limit > 200) throw problem("Paginación inválida");
  return { page, limit };
}
function range(req) {
  const year = Number(req.query.year || today().slice(0, 4));
  if (!Number.isInteger(year) || year < 2000 || year > 2200) throw problem("Año inválido");
  const from = dateOnly(req.query.from || `${year}-01-01`), to = dateOnly(req.query.to || `${year}-12-31`);
  if (from > to) throw problem("Rango de fechas inválido");
  return { from, to, currency: currencyCode(req.query.currency || "DOP") };
}
function endpoint(fn, write = false, permission = "finance.read") {
  return async (req, res) => {
    try { access(req, write, permission); const result = await fn(req, res); if (!res.headersSent) return api.success(res, 200, result, "FINANCE_OK"); }
    catch (error) {
      const transactionUnavailable = /Transaction numbers|replica set|retryable writes/.test(error.message || "");
      const status = error.code === 11000 ? 409 : transactionUnavailable ? 503 : error.status || (error.name === "ValidationError" || error.name === "CastError" ? 400 : 500);
      return api.failure(res, status, { message: error.code === 11000 ? "La operación ya existe; vuelva a consultar antes de repetirla" : transactionUnavailable ? "Se requiere MongoDB con replica set; no se aplicó la operación" : status === 500 ? "No se pudo completar la operación financiera" : error.message }, error.code === 11000 ? "DUPLICATE_OPERATION" : transactionUnavailable ? "TRANSACTIONS_REQUIRED" : typeof error.code === "string" ? error.code : "FINANCE_ERROR");
    }
  };
}
async function noGateway(invoice, session) {
  if (invoice.paymentWorkflow === "gateway" || await PaymentTransaction.exists({ organizationId: invoice.organizationId, invoiceId: invoice._id, provider: { $nin: ["TRANSFERENCIA", "TRANSFER", "BANK_TRANSFER", "BANK TRANSFER"] }, status: { $in: ["pending", "processing", "succeeded"] } }).session(session)) throw problem("La factura tiene un flujo de pasarela; resuélvalo antes de aplicar ajustes", 409, "PAYMENT_WORKFLOW_CONFLICT");
}
async function claimMovement(req, entry, movementId, destination, session) {
  const accountId = destination ? entry.destinationAccountId : entry.bankAccountId;
  const direction = destination || entry.kind === "income" ? "credit" : "debit";
  const movement = await findScoped(BankMovement, req, id(movementId), session);
  const statement = await findScoped(BankStatement, req, movement.statementId, session);
  if (statement.status !== "committed" || String(movement.bankAccountId) !== String(accountId) || String(movement.condominiumId) !== String(entry.condominiumId) || movement.currency !== entry.currency || movement.amountMinor !== entry.amountMinor || movement.date !== entry.date || movement.direction !== direction || movement.allocatedReceiptId || movement.financeEntryId && String(movement.financeEntryId) !== String(entry._id)) throw problem("Movimiento incompatible o ya clasificado", 409);
  movement.financeEntryId = entry._id; await movement.save({ session });
}
function sameOperation(existing, expected) {
  for (const [key, value] of Object.entries(expected)) if (String(existing[key] ?? "") !== String(value ?? "")) throw problem("La clave de operación corresponde a otros datos", 409, "IDEMPOTENCY_CONFLICT");
  return existing;
}

async function apply(req, kind) {
  const key = operationKey(req.body.idempotencyKey), note = reason(req.body.reason), amountMinor = moneyMinor(req.body.amount);
  let result;
  await mongoose.connection.transaction(async session => {
    const invoice = await findScoped(Invoice, req, req.params.id, session);
    await enabled(req, invoice.condominiumId);
    const query = { organizationId: req.auth.organizationId, condominiumId: invoice.condominiumId, idempotencyKey: key };
    const expected = { invoiceId: invoice._id, kind, amountMinor, reason: note, creditId: kind === "credit" ? id(req.body.creditId) : undefined };
    const existing = await FinanceApplication.findOne(query).session(session);
    if (existing) { result = sameOperation(existing, expected); return; }
    await noGateway(invoice, session);
    if (amountMinor > balanceMinor(invoice)) throw problem("El importe excede la deuda pendiente", 409);
    if (kind === "credit") {
      const credit = await findScoped(OwnerCredit, req, id(req.body.creditId), session);
      if (!credit.unitNumber || unitKey(credit.unitNumber) !== unitKey(invoice.unitNumber) || String(credit.condominiumId) !== String(invoice.condominiumId) || String(credit.ownerId) !== String(invoice.ownerId) || credit.currency !== (invoice.currency || "DOP")) throw problem("El crédito pertenece a otra unidad, titular o moneda, o necesita revisión", 409);
      if (credit.amountMinor - (credit.consumedMinor || 0) < amountMinor) throw problem("Crédito insuficiente", 409);
      credit.consumedMinor = (credit.consumedMinor || 0) + amountMinor;
      await credit.save({ session });
      invoice.creditAppliedAmount = Number(invoice.creditAppliedAmount || 0) + amountMinor / 100;
    } else invoice.adjustmentAmount = Number(invoice.adjustmentAmount || 0) + amountMinor / 100;
    invoice.paymentWorkflow = "bank_transfer";
    refreshInvoice(invoice);
    await invoice.save({ session });
    [result] = await FinanceApplication.create([{ ...query, ...expected, ownerId: invoice.ownerId, unitNumber: invoice.unitNumber, currency: invoice.currency || "DOP", createdBy: req.user.sub }], { session });
  });
  return result;
}

async function runLateFees(settings, currentDate = today()) {
  if (!settings.enabled || !settings.lateFee?.enabled) return { created: 0 };
  const query = { organizationId: settings.organizationId, condominiumId: settings.condominiumId };
  let created = 0;
  for await (const candidate of Invoice.find({ ...query, chargeType: { $in: ["monthly", "extraordinary", "individual", "fine"] }, paymentStatus: { $ne: "completed" }, dueDate: { $lt: new Date(currentDate + "T00:00:00Z") } }).cursor()) {
    let made = false;
    await mongoose.connection.transaction(async session => {
      made = false;
      const invoice = await Invoice.findOne({ ...query, _id: candidate._id }).session(session);
      const activeSettings = await FinanceSettings.findOne(query).session(session).lean();
      if (!activeSettings?.enabled || !activeSettings.lateFee?.enabled) return;
      const amountMinor = lateFeeMinor(invoice, activeSettings.lateFee, currentDate), sourceKey = `late_fee:${invoice._id}`;
      if (!amountMinor || await Invoice.exists({ ...query, sourceKey }).session(session)) return;
      // Serialize against payments and adjustments so the percentage uses a consistent balance.
      invoice.receiptUploadRevision = (invoice.receiptUploadRevision || 0) + 1;
      await invoice.save({ session });
      await Invoice.create([{ ...query, ownerId: invoice.ownerId, unitNumber: invoice.unitNumber, unitId: invoice.unitId, amount: amountMinor / 100, paidAmount: 0, balancePending: amountMinor / 100, issueDate: new Date(currentDate + "T00:00:00Z"), dueDate: new Date(currentDate + "T00:00:00Z"), currency: invoice.currency || "DOP", chargeType: "late_fee", sourceKey, sourceInvoiceId: invoice._id, description: `Mora de factura ${invoice.invoice_number}`, createdBy: activeSettings.updatedBy, status: "active", paymentStatus: "pending" }], { session });
      made = true;
    });
    if (made) created += 1;
  }
  return { created };
}

const controller = {
  options: endpoint(async req => {
    const scoped = scope(req);
    const condos = await Condominium.find({ _id: scoped.condominiumId || { $exists: true }, organizationId: scoped.organizationId, status: "active" }).select("alias units_ownerId mPayment").lean();
    const owners = await Owner.find({ organizationId: scoped.organizationId, status: "active", ...(req.user.role === "OWNER" ? { _id: req.user.sub } : {}) }).select("name lastname propertyDetails").lean();
    const docs = condos.map(condo => ({ _id: condo._id, alias: condo.alias, mPayment: condo.mPayment, units: owners.flatMap(owner => {
      if (!(condo.units_ownerId || []).some(entry => String(entry.ownerId) === String(owner._id) && entry.status !== "inactive")) return [];
      return activeOwnerPropertyDetails(owner, condo._id).map(property => ({ ownerId: owner._id, unitNumber: property.condominium_unit, ownerName: `${owner.name} ${owner.lastname}` }));
    }) })).filter(condo => req.user.role !== "OWNER" || condo.units.length);
    return { docs };
  }),
  settings: endpoint(async req => {
    const query = scope(req, id(req.params.id));
    return { settings: await FinanceSettings.findOne(query).lean() || { enabled: false, cashbookEnabled: false, reportsEnabled: false, lateFee: { enabled: false, mode: "fixed", value: 0, graceDays: 0 } }, migrationReady: req.user.role === "OWNER" ? undefined : await migrationReady() };
  }),
  saveSettings: endpoint(async req => {
    await condominium(req, req.params.id);
    const query = scope(req, req.params.id), previous = await FinanceSettings.findOne(query).lean();
    for (const key of ["enabled", "cashbookEnabled", "reportsEnabled"]) if (typeof req.body[key] !== "boolean") throw problem("Configuración inválida");
    if (req.body.enabled && !previous?.enabled && req.body.reviewed !== true) throw problem("Confirme que revisó los saldos antes de activar esta etapa");
    if (req.body.enabled && !await migrationReady()) throw problem("Ejecute la revisión y migración de índices antes de activar finanzas", 409, "MIGRATION_REQUIRED");
    if (req.body.reportsEnabled && !req.body.cashbookEnabled || req.body.cashbookEnabled && !req.body.enabled) throw problem("Active las etapas anteriores primero");
    const policy = req.body.lateFee || {};
    if (typeof policy.enabled !== "boolean" || !["fixed", "percent"].includes(policy.mode) || !Number.isInteger(Number(policy.graceDays)) || Number(policy.graceDays) < 0 || Number(policy.graceDays) > 365) throw problem("Política de mora inválida");
    const value = Number(policy.value);
    if (!Number.isFinite(value) || value < 0 || value > 9999999999.99 || policy.enabled && value === 0 || policy.mode === "percent" && value > 100 || Number(value.toFixed(2)) !== value) throw problem("Importe o porcentaje de mora inválido");
    const changed = !previous?.lateFee?.enabled || previous.lateFee.mode !== policy.mode || previous.lateFee.value !== value || previous.lateFee.graceDays !== Number(policy.graceDays);
    const effectiveFrom = changed ? today() : previous.lateFee.effectiveFrom;
    return FinanceSettings.findOneAndUpdate(query, { $set: { enabled: req.body.enabled, cashbookEnabled: req.body.cashbookEnabled, reportsEnabled: req.body.reportsEnabled, lateFee: { enabled: policy.enabled && req.body.enabled, mode: policy.mode, value, graceDays: Number(policy.graceDays), effectiveFrom }, updatedBy: req.user.sub } }, { new: true, upsert: true, runValidators: true });
  }, true, "finance.update"),
  charges: endpoint(async req => {
    const condo = await condominium(req, id(req.body.condominiumId));
    await enabled(req, condo._id);
    const type = req.body.chargeType;
    if (!["monthly", "extraordinary", "individual", "fine"].includes(type)) throw problem("Tipo de cargo inválido");
    const selections = req.body.units;
    if (!Array.isArray(selections) || selections.length < 1 || selections.length > 500) throw problem("Seleccione entre 1 y 500 unidades");
    if (["individual", "fine"].includes(type) && selections.length !== 1) throw problem("Seleccione una sola unidad para este cargo");
    const seen = new Set();
    for (const item of selections) { const unit = unitKey(item.unitNumber); if (seen.has(unit)) throw problem("Unidad repetida"); seen.add(unit); }
    const key = operationKey(req.body.idempotencyKey), description = reason(req.body.description);
    const digest = require("crypto").createHash("sha256").update(JSON.stringify({ type, description, issueDate: dateOnly(req.body.issueDate), dueDate: dateOnly(req.body.dueDate), currency: currencyCode(req.body.currency || "DOP"), units: selections.map(item => [String(item.ownerId), unitKey(item.unitNumber), moneyMinor(item.amount ?? req.body.amount)]).sort((a, b) => a[1].localeCompare(b[1])) })).digest("hex");
    let docs;
    await mongoose.connection.transaction(async session => {
      const batchQuery = { organizationId: req.auth.organizationId, condominiumId: condo._id, idempotencyKey: key };
      const existingBatch = await FinanceChargeBatch.findOne(batchQuery).session(session);
      if (existingBatch) { sameOperation(existingBatch, { digest }); docs = await Invoice.find({ organizationId: req.auth.organizationId, condominiumId: condo._id, _id: { $in: existingBatch.invoiceIds } }).session(session); return; }
      docs = [];
      for (const selection of selections) {
        const doc = await issueInvoice({ condominium: condo, ownerId: id(selection.ownerId), unitNumber: selection.unitNumber, amount: selection.amount ?? req.body.amount, issueDate: req.body.issueDate, dueDate: req.body.dueDate, currency: req.body.currency || "DOP", chargeType: type, sourceKey: `charge:${key}:${unitKey(selection.unitNumber)}`, description, createdBy: req.user.sub, session });
        if (type !== "monthly") sameOperation(doc, { ownerId: selection.ownerId, amount: moneyMinor(selection.amount ?? req.body.amount) / 100, currency: currencyCode(req.body.currency || "DOP"), chargeType: type, description });
        docs.push(doc);
      }
      await FinanceChargeBatch.create([{ ...batchQuery, digest, invoiceIds: docs.map(doc => doc._id), createdBy: req.user.sub }], { session });
    });
    return { docs };
  }, true, "finance.create"),
  adjustment: endpoint(req => {
    if (!["discount", "waiver"].includes(req.body.kind)) throw problem("Seleccione descuento o condonación");
    return apply(req, req.body.kind);
  }, true, "finance.update"),
  applyCredit: endpoint(req => apply(req, "credit"), true, "finance.update"),
  reverseApplication: endpoint(async req => {
    const key = operationKey(req.body.idempotencyKey), note = reason(req.body.reason);
    let result;
    await mongoose.connection.transaction(async session => {
      const original = await findScoped(FinanceApplication, req, req.params.id, session);
      await enabled(req, original.condominiumId);
      if (original.kind === "reversal") throw problem("No se puede revertir un reverso", 409);
      const query = { organizationId: original.organizationId, condominiumId: original.condominiumId, idempotencyKey: key };
      const existing = await FinanceApplication.findOne(query).session(session);
      if (existing) { result = sameOperation(existing, { kind: "reversal", reversesId: original._id, reason: note }); return; }
      if (original.reversedById) throw problem("La operación ya fue revertida", 409);
      const invoice = await findScoped(Invoice, req, original.invoiceId, session);
      await noGateway(invoice, session);
      if (original.kind === "credit") {
        const credit = await findScoped(OwnerCredit, req, original.creditId, session);
        credit.consumedMinor = (credit.consumedMinor || 0) - original.amountMinor;
        if (credit.consumedMinor < 0) throw problem("Crédito inconsistente", 409);
        await credit.save({ session });
        invoice.creditAppliedAmount = Number(invoice.creditAppliedAmount || 0) - original.amountMinor / 100;
      } else invoice.adjustmentAmount = Number(invoice.adjustmentAmount || 0) - original.amountMinor / 100;
      refreshInvoice(invoice); await invoice.save({ session });
      [result] = await FinanceApplication.create([{ ...query, kind: "reversal", reversesId: original._id, invoiceId: invoice._id, ownerId: invoice.ownerId, unitNumber: invoice.unitNumber, amountMinor: original.amountMinor, currency: original.currency, reason: note, creditId: original.creditId, createdBy: req.user.sub }], { session });
      original.reversedById = result._id; await original.save({ session });
    });
    return result;
  }, true, "finance.update"),
  credits: endpoint(async req => {
    const query = scope(req, req.query.condominiumId);
    if (req.user.role === "OWNER") query.ownerId = req.user.sub;
    const docs = await OwnerCredit.find(query).sort({ createdAt: -1 }).lean();
    return { docs: docs.map(credit => ({ ...credit, availableMinor: credit.amountMinor - (credit.consumedMinor || 0), needsReview: !credit.unitNumber })) };
  }),
  receivables: endpoint(async (req, res) => {
    const query = scope(req, id(req.query.condominiumId));
    await enabled(req, req.query.condominiumId);
    if (req.user.role === "OWNER") query.ownerId = req.user.sub;
    const result = await reporting.receivables({ ...query, issueDate: { $lte: new Date(today() + "T23:59:59.999Z") } }, today());
    if (req.query.format === "csv") return res.type("text/csv; charset=utf-8").attachment("cuentas-por-cobrar.csv").send(csv([["Factura", "Unidad", "Tipo", "Moneda", "Saldo", "Antigüedad"], ...result.docs.map(invoice => [invoice.invoice_number, invoice.unitNumber, invoice.chargeType || "legacy", invoice.currency || "DOP", invoice.balancePending, invoice.bucket])]));
    const { page, limit } = pagination(req);
    return { ...result, docs: result.docs.slice((page - 1) * limit, page * limit), total: result.docs.length, page, limit };
  }),
  history: endpoint(async (req, res) => {
    const query = scope(req, id(req.query.condominiumId));
    await enabled(req, req.query.condominiumId);
    const unit = bounded(req.query.unitNumber, 80); unitKey(unit);
    if (req.user.role === "OWNER") {
      query.ownerId = req.user.sub;
      const owner = await Owner.findOne({ _id: req.user.sub, organizationId: query.organizationId, status: "active" }).lean();
      if (!activeOwnerPropertyDetails(owner, query.condominiumId).some(property => unitKey(property.condominium_unit) === unitKey(unit))) throw problem("Unidad fuera de alcance", 403);
    }
    const result = await reporting.unitHistory(query, { ...range(req), ...pagination(req), unitNumber: unit });
    if (req.query.format === "csv") {
      // Export all rows through bounded pages instead of silently exporting only the UI page.
      const all = []; let page = 1;
      do { const batch = await reporting.unitHistory(query, { ...range(req), page, limit: 200, unitNumber: unit }); all.push(...batch.docs); if (all.length >= batch.total) break; page += 1; } while (true);
      return res.type("text/csv; charset=utf-8").attachment("estado-de-cuenta.csv").send(csv([["Fecha", "Concepto", "Cargo", "Aplicación", "Saldo"], ...all.map(row => [row.date, row.description, row.debitMinor / 100, row.creditMinor / 100, row.balanceMinor / 100])]));
    }
    return result;
  }),
  runLateFees: endpoint(async req => runLateFees(await enabled(req, id(req.body.condominiumId))), true, "finance.create"),
  entries: endpoint(async req => {
    await enabled(req, id(req.query.condominiumId), "cashbookEnabled");
    const { page, limit } = pagination(req), query = scope(req, req.query.condominiumId);
    const [docs, total] = await Promise.all([FinanceEntry.find(query).sort({ date: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(), FinanceEntry.countDocuments(query)]);
    return { docs, total, page, limit };
  }, true),
  movements: endpoint(async req => {
    await enabled(req, id(req.query.condominiumId), "cashbookEnabled");
    const query = { ...scope(req, req.query.condominiumId), allocatedReceiptId: null, financeEntryId: null };
    const { page, limit } = pagination(req);
    const [docs, total] = await Promise.all([BankMovement.find(query).sort({ date: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(), BankMovement.countDocuments(query)]);
    return { docs, total, page, limit };
  }, true),
  createEntry: endpoint(async req => {
    await enabled(req, id(req.body.condominiumId), "cashbookEnabled");
    const query = scope(req, req.body.condominiumId), body = req.body;
    if (!["income", "expense", "transfer"].includes(body.kind)) throw problem("Tipo de movimiento inválido");
    const fields = { kind: body.kind, category: bounded(body.category, 120), date: dateOnly(body.date), amountMinor: moneyMinor(body.amount), currency: currencyCode(body.currency || "DOP"), reason: reason(body.reason), reference: bounded(body.reference), supportReference: bounded(body.supportReference, 500), bankAccountId: body.bankAccountId ? id(body.bankAccountId) : undefined, destinationAccountId: body.destinationAccountId ? id(body.destinationAccountId) : undefined, movementId: body.movementId ? id(body.movementId) : undefined, destinationMovementId: body.destinationMovementId ? id(body.destinationMovementId) : undefined, idempotencyKey: operationKey(body.idempotencyKey) };
    if (!fields.category) throw problem("Indique una categoría");
    if (fields.date > today()) throw problem("Registre únicamente movimientos ya realizados");
    if (fields.category === "Cobros de cuotas") throw problem("Los cobros de cuotas se obtienen de los pagos confirmados");
    if (fields.kind === "transfer" && (!fields.bankAccountId || !fields.destinationAccountId || String(fields.bankAccountId) === String(fields.destinationAccountId))) throw problem("Seleccione cuentas distintas para la transferencia");
    if (fields.kind !== "transfer" && (fields.destinationAccountId || fields.destinationMovementId)) throw problem("La cuenta destino solo se usa en transferencias");
    let result;
    await mongoose.connection.transaction(async session => {
      const existing = await FinanceEntry.findOne({ ...query, idempotencyKey: fields.idempotencyKey }).session(session);
      if (existing) { result = sameOperation(existing, fields); return; }
      for (const accountId of [fields.bankAccountId, fields.destinationAccountId].filter(Boolean)) {
        const account = await findScoped(BankAccount, req, accountId, session);
        if (String(account.condominiumId) !== String(query.condominiumId) || account.currency !== fields.currency) throw problem("Cuenta incompatible con el condominio o moneda", 409);
      }
      [result] = await FinanceEntry.create([{ ...query, ...fields, createdBy: req.user.sub }], { session });
      for (const [movementId, destination] of [[fields.movementId, false], [fields.destinationMovementId, true]]) {
        if (!movementId) continue;
        await claimMovement(req, result, movementId, destination, session);
      }
    });
    return result;
  }, true, "finance.create"),
  linkEntry: endpoint(async req => {
    let result;
    await mongoose.connection.transaction(async session => {
      const entry = await findScoped(FinanceEntry, req, req.params.id, session);
      await enabled(req, entry.condominiumId, "cashbookEnabled");
      if (entry.reversalOf || entry.reversedById) throw problem("Este registro fue revertido", 409);
      if (!req.body.movementId && !req.body.destinationMovementId) throw problem("Seleccione un movimiento bancario");
      if (req.body.destinationMovementId && entry.kind !== "transfer") throw problem("Destino incompatible");
      for (const [value, field, destination] of [[req.body.movementId, "movementId", false], [req.body.destinationMovementId, "destinationMovementId", true]]) {
        if (!value) continue;
        if (entry[field] && String(entry[field]) !== String(value)) throw problem("La operación ya tiene otro movimiento vinculado", 409);
        await claimMovement(req, entry, value, destination, session);
        entry[field] = value;
      }
      await entry.save({ session }); result = entry;
    });
    return result;
  }, true, "finance.update"),
  reverseEntry: endpoint(async req => {
    const note = reason(req.body.reason), key = operationKey(req.body.idempotencyKey);
    let result;
    await mongoose.connection.transaction(async session => {
      const original = await findScoped(FinanceEntry, req, req.params.id, session);
      await enabled(req, original.condominiumId, "cashbookEnabled");
      const query = { organizationId: original.organizationId, condominiumId: original.condominiumId, idempotencyKey: key };
      const existing = await FinanceEntry.findOne(query).session(session);
      if (existing) { result = sameOperation(existing, { reversalOf: original._id, reason: note }); return; }
      if (original.reversalOf || original.reversedById) throw problem("Este registro no puede revertirse", 409);
      const fields = original.toObject(); delete fields._id; delete fields.createdAt; delete fields.updatedAt; delete fields.__v;
      [result] = await FinanceEntry.create([{ ...fields, ...query, reversalOf: original._id, date: today(), reason: note, createdBy: req.user.sub }], { session });
      original.reversedById = result._id; await original.save({ session });
      for (const movementId of [original.movementId, original.destinationMovementId].filter(Boolean)) await BankMovement.updateOne({ ...scope(req), _id: movementId, financeEntryId: original._id }, { $set: { financeEntryId: null } }, { session });
    });
    return result;
  }, true, "finance.update"),
  accounts: endpoint(async req => ({ docs: await BankAccount.find(scope(req, req.query.condominiumId)).lean() }), true),
  openingBalance: endpoint(async req => {
    const account = await findScoped(BankAccount, req, req.params.id);
    await enabled(req, account.condominiumId, "cashbookEnabled");
    const openingBalanceMinor = signedMinor(req.body.amount), openingDate = dateOnly(req.body.date);
    if (openingDate > today()) throw problem("El saldo inicial no puede tener una fecha futura");
    if (account.openingDate) throw problem("El saldo inicial ya fue definido", 409);
    const result = await BankAccount.findOneAndUpdate({ _id: account._id, organizationId: req.auth.organizationId, openingDate: { $exists: false } }, { $set: { openingBalanceMinor, openingDate, openingDefinedBy: req.user.sub, openingDefinedAt: new Date() } }, { returnDocument: "after" });
    if (!result) throw problem("El saldo inicial ya fue definido", 409);
    return result;
  }, true, "finance.update"),
  budget: endpoint(async req => {
    await enabled(req, id(req.query.condominiumId), "reportsEnabled");
    const { from, currency } = range(req);
    return await FinanceBudget.findOne({ ...scope(req, req.query.condominiumId), year: Number(from.slice(0, 4)), currency }).lean() || { lines: [], revision: 0 };
  }, true),
  saveBudget: endpoint(async req => {
    await enabled(req, id(req.body.condominiumId), "reportsEnabled");
    const year = Number(req.body.year);
    if (!Number.isInteger(year) || year < 2000 || year > 2200 || !Array.isArray(req.body.lines) || req.body.lines.length > 2400) throw problem("Presupuesto inválido");
    const seen = new Set();
    const lines = req.body.lines.map(line => {
      const month = Number(line.month), category = bounded(line.category, 120), kind = line.kind;
      if (!Number.isInteger(month) || month < 1 || month > 12 || !["income", "expense"].includes(kind) || !category) throw problem("Partida inválida");
      const key = JSON.stringify([month, kind, category]); if (seen.has(key)) throw problem("Partida repetida"); seen.add(key);
      const amountMinor = String(line.amount) === "0" ? 0 : moneyMinor(line.amount);
      return { month, kind, category, amountMinor };
    });
    const revision = Number(req.body.revision || 0);
    if (!Number.isInteger(revision) || revision < 0) throw problem("Versión de presupuesto inválida");
    const result = await FinanceBudget.findOneAndUpdate({ ...scope(req, req.body.condominiumId), year, currency: currencyCode(req.body.currency || "DOP"), revision }, { $set: { lines, updatedBy: req.user.sub }, $inc: { revision: 1 } }, { returnDocument: "after", upsert: revision === 0, runValidators: true });
    if (!result) throw problem("El presupuesto cambió; vuelva a cargarlo antes de guardar", 409);
    return result;
  }, true, "finance.update"),
  report: endpoint(async (req, res) => {
    await enabled(req, id(req.query.condominiumId), "reportsEnabled");
    const query = scope(req, req.query.condominiumId), dates = range(req);
    if (dates.from.slice(0, 4) !== dates.to.slice(0, 4)) throw problem("Consulte un año por reporte presupuestario");
    const [cash, banks, debt] = await Promise.all([reporting.cashReport(query, dates.from, dates.to, dates.currency), reporting.bankSummary(query, dates.to), reporting.receivables({ ...query, issueDate: { $lte: new Date(today() + "T23:59:59.999Z") } }, today())]);
    if (req.query.format === "csv") return res.type("text/csv; charset=utf-8").attachment("ingresos-egresos.csv").send(csv([["Fecha", "Tipo", "Categoría", "Moneda", "Importe", "Referencia"], ...cash.rows.map(row => [row.date, row.kind, row.category, row.currency, row.amountMinor / 100, row.reference])]));
    return { ...cash, banks, receivables: debt.totals, receivablesAsOf: today() };
  }, true),
};
controller._helpers = { runLateFees, today, sameOperation };
module.exports = controller;
