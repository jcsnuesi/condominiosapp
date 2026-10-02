"use strict";

const mongoose = require("mongoose");
const apiResponse = require("../service/apiResponse");
const Invoice = require("../models/invoice");
const Notification = require("../models/notification");
const PaymentTransaction = require("../models/paymentTransaction");
const CommunicationLog = require("../models/communicationLog");
const paymentGateway = require("../service/paymentGateway");
const whatsappService = require("../service/whatsappService");
const paymentReminderJob = require("../service/paymentReminderJob");
const { canAccessCondominium } = require("../service/authorization");

const ALLOWED_PAYMENT_ROLES = ["ADMIN", "OWNER", "STAFF_ADMIN"];
const MANUAL_RECONCILIATION_STATUSES = [
  "matched",
  "mismatched",
  "manual_review",
];
const IMPORT_RECONCILIATION_STATUSES = [
  "paid",
  "succeeded",
  "settled",
  "matched",
];
const IMPORT_FAILED_STATUSES = ["failed", "cancelled", "reversed", "voided"];

function hasPaymentAccess(req) {
  return ALLOWED_PAYMENT_ROLES.includes(
    String(req?.user?.role || "").toUpperCase()
  );
}

function asObjectId(value) {
  if (!value) return null;
  try {
    return new mongoose.Types.ObjectId(value);
  } catch (error) {
    return null;
  }
}

function mapGatewayStatusToTransactionStatus(status) {
  const normalized = String(status || "").toLowerCase();
  if (["succeeded", "processing", "cancelled", "failed"].includes(normalized)) {
    return normalized;
  }
  return "failed";
}

function mapTransactionToInvoicePaymentStatus(status) {
  if (status === "succeeded") {
    return "completed";
  }

  if (status === "failed" || status === "cancelled") {
    return "failed";
  }

  return "pending";
}

function isPrivilegedPaymentRole(req) {
  const role = String(req?.user?.role || "").toUpperCase();
  return role === "ADMIN" || role === "STAFF_ADMIN";
}

function isBankTransfer(transaction) {
  const provider = String(transaction?.provider || "").toUpperCase();
  return ["TRANSFERENCIA", "TRANSFER", "BANK_TRANSFER", "BANK TRANSFER"].includes(provider) || transaction?.metadata?.source === "bank_statement";
}

function canAccessPaymentResource(req, resource) {
  return Boolean(resource && String(resource.organizationId) === String(req.auth?.organizationId) &&
    canAccessCondominium(req.auth, resource.condominiumId) &&
    (isPrivilegedPaymentRole(req) || String(resource.ownerId) === String(req.user?.sub)));
}

function roleOf(req) {
  return String(req?.user?.role || "").toUpperCase();
}

function isOwnerPaymentRole(req) {
  const role = roleOf(req);
  return role === "OWNER" || role === "ROLE_OWNER";
}

function toNotificationCreator(role) {
  const normalized = String(role || "").toUpperCase();
  if (normalized === "ADMIN" || normalized === "ROLE_ADMIN") {
    return { createdByModel: "Admin", createdByRole: "ADMIN" };
  }

  if (normalized === "STAFF_ADMIN" || normalized === "ROLE_STAFF_ADMIN") {
    return { createdByModel: "Staff_Admin", createdByRole: "STAFF_ADMIN" };
  }

  if (normalized === "STAFF" || normalized === "ROLE_STAFF") {
    return { createdByModel: "Staff", createdByRole: "STAFF" };
  }

  return null;
}

function normalizeWhatsappPaymentPayload(payload) {
  const type = String(payload?.type || "payment_reminder")
    .trim()
    .toLowerCase();
  const note = String(payload?.note || "").trim();

  if (!["payment_reminder", "payment_confirmation"].includes(type)) {
    return {
      error: "type debe ser payment_reminder o payment_confirmation",
    };
  }

  if (note.length > 500) {
    return { error: "La nota de WhatsApp no puede exceder 500 caracteres" };
  }

  return {
    type,
    note,
    paymentLink: String(payload?.paymentLink || "").trim(),
  };
}

function canSendWhatsappForInvoice(req, invoice) {
  if (isPrivilegedPaymentRole(req)) {
    return true;
  }

  if (!isOwnerPaymentRole(req)) {
    return false;
  }

  return String(invoice?.ownerId?._id || invoice?.ownerId) === String(req.user?.sub);
}

function normalizeManualReconciliationPayload(payload) {
  const reconciliationStatus = String(payload?.reconciliationStatus || "")
    .trim()
    .toLowerCase();
  const note = String(payload?.note || "").trim();

  if (!MANUAL_RECONCILIATION_STATUSES.includes(reconciliationStatus)) {
    return {
      error:
        "reconciliationStatus debe ser matched, mismatched o manual_review",
    };
  }

  if (note.length > 500) {
    return { error: "La nota de conciliacion no puede exceder 500 caracteres" };
  }

  return { reconciliationStatus, note };
}

function normalizeImportRow(row) {
  const providerTransactionId = String(row?.providerTransactionId || "").trim();
  const providerReference = String(row?.providerReference || "").trim();
  const idempotencyKey = String(row?.idempotencyKey || "").trim();
  const currency = String(row?.currency || "DOP").trim().toUpperCase();
  const status = String(row?.status || "settled").trim().toLowerCase();
  const note = String(row?.note || "").trim();
  const settledAt = row?.settledAt ? new Date(String(row.settledAt)) : null;
  const amount = Number(row?.amount);

  if (!providerTransactionId && !providerReference && !idempotencyKey) {
    return {
      error:
        "Cada fila requiere providerTransactionId, providerReference o idempotencyKey",
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Cada fila requiere un monto valido mayor que cero" };
  }

  if (currency.length !== 3) {
    return { error: "currency debe ser un codigo ISO de 3 letras" };
  }

  if (note.length > 500) {
    return { error: "La nota de importacion no puede exceder 500 caracteres" };
  }

  if (settledAt && Number.isNaN(settledAt.getTime())) {
    return { error: "settledAt invalido" };
  }

  return {
    providerTransactionId,
    providerReference,
    idempotencyKey,
    amount,
    currency,
    status,
    note,
    settledAt,
  };
}

function buildImportRowQuery(provider, row) {
  const conditions = [];

  if (row.providerTransactionId) {
    conditions.push({ providerTransactionId: row.providerTransactionId });
  }

  if (row.providerReference) {
    conditions.push({ providerReference: row.providerReference });
  }

  if (row.idempotencyKey) {
    conditions.push({ idempotencyKey: row.idempotencyKey });
  }

  return {
    provider,
    $or: conditions,
  };
}

function centsAmount(value) {
  return Math.round(Number(value || 0) * 100);
}

function resolveImportedReconciliation(row, transaction) {
  const amountMatches = centsAmount(row.amount) === centsAmount(transaction.amount);
  const currencyMatches =
    String(row.currency || "").toUpperCase() ===
    String(transaction.currency || "").toUpperCase();

  if (!amountMatches || !currencyMatches) {
    return {
      reconciliationStatus: "mismatched",
      transactionStatus: transaction.status,
      reason: !amountMatches ? "amount_mismatch" : "currency_mismatch",
    };
  }

  if (IMPORT_RECONCILIATION_STATUSES.includes(row.status)) {
    return {
      reconciliationStatus: "matched",
      transactionStatus: "succeeded",
      reason: "matched",
    };
  }

  if (IMPORT_FAILED_STATUSES.includes(row.status)) {
    return {
      reconciliationStatus: "manual_review",
      transactionStatus:
        row.status === "cancelled" || row.status === "voided"
          ? "cancelled"
          : "failed",
      reason: "provider_reported_failure",
    };
  }

  return {
    reconciliationStatus: "manual_review",
    transactionStatus: transaction.status,
    reason: "unknown_settlement_status",
  };
}

function canManuallyReconcile(transaction) {
  return ["manual_review", "mismatched"].includes(
    String(transaction?.reconciliationStatus || "").toLowerCase()
  );
}

function mapManualReconciliationToInvoicePaymentStatus(
  reconciliationStatus,
  transactionStatus
) {
  if (reconciliationStatus === "matched") {
    return "completed";
  }

  if (transactionStatus === "failed" || transactionStatus === "cancelled") {
    return "failed";
  }

  return "pending";
}

function buildTransactionFilters(req) {
  const filters = {};
  const query = req?.query || {};

  const invoiceId = asObjectId(query.invoiceId);
  if (query.invoiceId && !invoiceId) {
    return { error: "invoiceId invalido" };
  }
  if (invoiceId) {
    filters.invoiceId = invoiceId;
  }

  const condominiumId = asObjectId(query.condominiumId);
  if (query.condominiumId && !condominiumId) {
    return { error: "condominiumId invalido" };
  }
  if (condominiumId) {
    filters.condominiumId = condominiumId;
  }

  if (query.status) {
    filters.status = String(query.status).toLowerCase();
  }

  if (query.reconciliationStatus) {
    filters.reconciliationStatus = String(query.reconciliationStatus)
      .trim()
      .toLowerCase();
  }

  if (query.provider) {
    const provider = String(query.provider).trim().toUpperCase();
    if (typeof query.provider !== "string" || !provider || provider.length > 80) {
      return { error: "provider invalido" };
    }
    filters.provider = provider;
  }
  if (filters.provider === "TRANSFERENCIA" && query.bankName) {
    filters.bankName = String(query.bankName).trim();
  }

  if (query.idempotencyKey) {
    filters.idempotencyKey = String(query.idempotencyKey).trim();
  }

  if (query.providerTransactionId) {
    filters.providerTransactionId = String(query.providerTransactionId).trim();
  }

  if (query.attemptedFrom || query.attemptedTo) {
    const attemptedAt = {};

    if (query.attemptedFrom) {
      const attemptedFrom = new Date(String(query.attemptedFrom));
      if (Number.isNaN(attemptedFrom.getTime())) {
        return { error: "attemptedFrom invalido" };
      }
      attemptedAt.$gte = attemptedFrom;
    }

    if (query.attemptedTo) {
      const attemptedTo = new Date(String(query.attemptedTo));
      if (Number.isNaN(attemptedTo.getTime())) {
        return { error: "attemptedTo invalido" };
      }

      attemptedTo.setUTCHours(23, 59, 59, 999);
      attemptedAt.$lte = attemptedTo;
    }

    if (attemptedAt.$gte && attemptedAt.$lte && attemptedAt.$gte > attemptedAt.$lte) {
      return { error: "La fecha from debe ser anterior o igual a to" };
    }
    filters.attemptedAt = attemptedAt;
  }

  if (isPrivilegedPaymentRole(req) && query.ownerId) {
    const ownerId = asObjectId(query.ownerId);
    if (!ownerId) {
      return { error: "ownerId invalido" };
    }
    filters.ownerId = ownerId;
  }

  if (!isPrivilegedPaymentRole(req)) {
    const ownerId = asObjectId(req?.user?.sub);
    if (!ownerId) {
      return { error: "Contexto de usuario invalido" };
    }
    filters.ownerId = ownerId;
  }

  return { filters };
}

function buildCommunicationLogFilters(req) {
  const filters = {};
  const query = req?.query || {};

  if (query.channel) {
    filters.channel = String(query.channel).trim().toLowerCase();
  }

  if (query.type) {
    filters.type = String(query.type).trim().toLowerCase();
  }

  if (query.status) {
    filters.status = String(query.status).trim().toLowerCase();
  }

  const invoiceId = asObjectId(query.invoiceId);
  if (query.invoiceId && !invoiceId) {
    return { error: "invoiceId invalido" };
  }
  if (invoiceId) {
    filters.invoiceId = invoiceId;
  }

  const ownerId = asObjectId(query.ownerId);
  if (query.ownerId && !ownerId) {
    return { error: "ownerId invalido" };
  }
  if (ownerId) {
    filters.ownerId = ownerId;
  }

  const condominiumId = asObjectId(query.condominiumId);
  if (query.condominiumId && !condominiumId) {
    return { error: "condominiumId invalido" };
  }
  if (condominiumId) {
    filters.condominiumId = condominiumId;
  }

  if (query.sentFrom || query.sentTo) {
    const sentAt = {};

    if (query.sentFrom) {
      const sentFrom = new Date(String(query.sentFrom));
      if (Number.isNaN(sentFrom.getTime())) {
        return { error: "sentFrom invalido" };
      }
      sentAt.$gte = sentFrom;
    }

    if (query.sentTo) {
      const sentTo = new Date(String(query.sentTo));
      if (Number.isNaN(sentTo.getTime())) {
        return { error: "sentTo invalido" };
      }
      sentTo.setHours(23, 59, 59, 999);
      sentAt.$lte = sentTo;
    }

    filters.sentAt = sentAt;
  }

  return { filters };
}

const paymentController = {
  listPaymentTransactions: async function (req, res) {
    try {
      if (!hasPaymentAccess(req)) {
        return apiResponse.failure(
          res,
          403,
          { message: "No autorizado para consultar cobros" },
          "FORBIDDEN"
        );
      }

      const { filters, error } = buildTransactionFilters(req);
      if (error) {
        return apiResponse.failure(
          res,
          400,
          { message: error },
          "VALIDATION_ERROR"
        );
      }

      const limit = Math.min(Math.max(Number(req.query?.limit) || 20, 1), 500);
      const page = Math.max(Number(req.query?.page) || 1, 1);
      const skip = (page - 1) * limit;

      filters.organizationId = req.auth.organizationId;
      if (req.query.condominiumId && !canAccessCondominium(req.auth, req.query.condominiumId)) {
        return apiResponse.failure(res, 403, { message: "Propiedad fuera del alcance autorizado" }, "FORBIDDEN");
      }
      if (req.auth.scope?.mode !== "ALL" && !filters.condominiumId) {
        filters.condominiumId = { $in: req.auth.scope?.condominiumIds || [] };
      }
      if (req.query.unitNumber) {
        const invoiceFilter = {
          organizationId: req.auth.organizationId,
          ...(filters.condominiumId ? { condominiumId: filters.condominiumId } : {}),
          unitNumber: String(req.query.unitNumber),
          ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
          ...(filters.invoiceId ? { _id: filters.invoiceId } : {}),
        };
        filters.invoiceId = { $in: await Invoice.distinct("_id", invoiceFilter) };
      }

      const [docs, total] = await Promise.all([
        PaymentTransaction.find(filters)
          .populate({ path: "invoiceId", select: "unitNumber issueDate dueDate", match: { organizationId: req.auth.organizationId } })
          .sort({ attemptedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        PaymentTransaction.countDocuments(filters),
      ]);

      return apiResponse.success(
        res,
        200,
        {
          page,
          limit,
          total,
          docs: docs.map((transaction) => {
            const invoice = transaction.invoiceId;
            return {
              ...transaction,
              invoiceId: invoice?._id || invoice,
              unitNumber: invoice?.unitNumber || null,
              issueDate: invoice?.issueDate || null,
              dueDate: invoice?.dueDate || null,
            };
          }),
        },
        "PAYMENT_TRANSACTIONS_LISTED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "No se pudo consultar el estado de transacciones",
          detail: error.message,
        },
        "PAYMENT_TRANSACTIONS_LIST_FAILED"
      );
    }
  },

  createPaymentIntent: async function (req, res) {
    try {
      if (!hasPaymentAccess(req)) {
        return apiResponse.failure(
          res,
          403,
          { message: "No autorizado para iniciar cobros" },
          "FORBIDDEN"
        );
      }

      const payload = req.body || {};
      const invoiceId = asObjectId(payload.invoiceId);
      const provider = paymentGateway.normalizeProvider(payload.provider);
      const idempotencyKey = String(payload.idempotencyKey || "").trim();

      if (!invoiceId || !provider || !idempotencyKey) {
        return apiResponse.failure(
          res,
          400,
          { message: "invoiceId, provider e idempotencyKey son requeridos" },
          "VALIDATION_ERROR"
        );
      }

      if (!paymentGateway.isSupportedProvider(provider)) {
        return apiResponse.failure(
          res,
          400,
          { message: "Proveedor de pago no soportado" },
          "PAYMENT_PROVIDER_UNSUPPORTED"
        );
      }

      const existingByIdempotency = await PaymentTransaction.findOne({
        provider,
        idempotencyKey,
        organizationId: req.auth.organizationId,
      }).lean();

      if (existingByIdempotency) {
        if (!canAccessPaymentResource(req, existingByIdempotency)) return apiResponse.failure(res, 403, { message: "Cobro fuera del alcance autorizado" }, "FORBIDDEN");
        return apiResponse.success(
          res,
          200,
          existingByIdempotency,
          "PAYMENT_IDEMPOTENT_REPLAY"
        );
      }

      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return apiResponse.failure(
          res,
          404,
          { message: "Invoice no encontrada" },
          "INVOICE_NOT_FOUND"
        );
      }

      if (!canAccessPaymentResource(req, invoice)) return apiResponse.failure(res, 403, { message: "Factura fuera del alcance autorizado" }, "FORBIDDEN");
      // Legacy card flows do not allocate split payments. Keep mixed-method
      // invoices in the evidence-backed reconciliation flow to avoid overwrite.
      if (invoice.paidAmount > 0 || invoice.paymentStatus === "completed") return apiResponse.failure(res, 409, { message: "La factura ya tiene pagos aplicados; revise el saldo en conciliación" }, "INVOICE_HAS_PAYMENTS");
      const amount = Number(payload.amount || invoice.amount);
      if (centsAmount(amount) !== centsAmount(invoice.amount) || String(payload.currency || invoice.currency || "DOP").toUpperCase() !== (invoice.currency || "DOP")) return apiResponse.failure(res, 400, { message: "El cobro por pasarela debe cubrir el saldo completo en la moneda de la factura" }, "VALIDATION_ERROR");
      if (!Number.isFinite(amount) || amount <= 0) {
        return apiResponse.failure(
          res,
          400,
          { message: "Monto de cobro invalido" },
          "VALIDATION_ERROR"
        );
      }

      const workflow = await Invoice.updateOne({ _id: invoice._id, organizationId: req.auth.organizationId, paymentWorkflow: { $ne: "bank_transfer" }, paidAmount: { $not: { $gt: 0 } }, paymentStatus: { $ne: "completed" } }, { $set: { paymentWorkflow: "gateway" } });
      if (workflow.matchedCount !== 1) return apiResponse.failure(res, 409, { message: "La factura está reservada para conciliación bancaria o ya recibió pagos" }, "PAYMENT_WORKFLOW_CONFLICT");
      const gatewayResult = await paymentGateway.createCharge({
        provider,
        amount,
        currency: payload.currency || "DOP",
        idempotencyKey,
        invoiceId: String(invoice._id),
        ownerId: String(invoice.ownerId),
      });

      const txStatus = mapGatewayStatusToTransactionStatus(
        gatewayResult.status
      );
      const invoicePaymentStatus =
        mapTransactionToInvoicePaymentStatus(txStatus);

      const transaction = await PaymentTransaction.create({
        organizationId: req.auth.organizationId,
        condominiumId: invoice.condominiumId,
        invoiceId: invoice._id,
        ownerId: invoice.ownerId,
        provider,
        amount,
        currency: String(payload.currency || "DOP").toUpperCase(),
        idempotencyKey,
        providerTransactionId: gatewayResult.providerTransactionId,
        providerReference: gatewayResult.providerReference,
        status: txStatus,
        reconciliationStatus: txStatus === "succeeded" ? "matched" : "pending",
        attemptedAt: new Date(),
        confirmedAt:
          txStatus === "succeeded" ||
          txStatus === "failed" ||
          txStatus === "cancelled"
            ? new Date()
            : null,
        metadata: {
          source: "api-payment-intent",
          gateway: gatewayResult.raw,
        },
      });

      invoice.paymentMethod = provider;
      invoice.paymentStatus = invoicePaymentStatus;
      if (invoicePaymentStatus === "completed") {
        invoice.invoice_paid_date = new Date();
      }
      await invoice.save();

      return apiResponse.success(
        res,
        201,
        transaction,
        "PAYMENT_INTENT_CREATED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "No se pudo crear el intento de cobro",
          detail: error.message,
        },
        "PAYMENT_INTENT_CREATE_FAILED"
      );
    }
  },

  reconcilePaymentTransaction: async function (req, res) {
    try {
      if (!isPrivilegedPaymentRole(req)) {
        return apiResponse.failure(
          res,
          403,
          { message: "No autorizado para conciliar cobros" },
          "FORBIDDEN"
        );
      }

      const transactionId = asObjectId(req.params?.id);
      if (!transactionId) {
        return apiResponse.failure(
          res,
          400,
          { message: "transactionId invalido" },
          "VALIDATION_ERROR"
        );
      }

      const normalized = normalizeManualReconciliationPayload(req.body || {});
      if (normalized.error) {
        return apiResponse.failure(
          res,
          400,
          { message: normalized.error },
          "VALIDATION_ERROR"
        );
      }

      const transaction = await PaymentTransaction.findById(transactionId);
      if (!transaction) {
        return apiResponse.failure(
          res,
          404,
          { message: "Payment transaction no encontrada" },
          "PAYMENT_TRANSACTION_NOT_FOUND"
        );
      }

      if (!canAccessPaymentResource(req, transaction)) return apiResponse.failure(res, 403, { message: "Cobro fuera del alcance autorizado" }, "FORBIDDEN");
      if (isBankTransfer(transaction)) return apiResponse.failure(res, 409, { message: "Las transferencias se confirman exclusivamente con un comprobante y un movimiento del estado bancario" }, "BANK_EVIDENCE_REQUIRED");
      const protectedInvoice = await Invoice.findById(transaction.invoiceId);
      if (protectedInvoice?.paymentWorkflow === "bank_transfer" || protectedInvoice?.paidAmount > 0) return apiResponse.failure(res, 409, { message: "La factura tiene conciliación bancaria; no puede modificarse mediante la pasarela" }, "PAYMENT_WORKFLOW_CONFLICT");

      if (!canManuallyReconcile(transaction)) {
        return apiResponse.failure(
          res,
          409,
          {
            message:
              "Solo se pueden conciliar manualmente transacciones en manual_review o mismatched",
          },
          "PAYMENT_TRANSACTION_NOT_RECONCILABLE"
        );
      }

      const previousReconciliationStatus = transaction.reconciliationStatus;
      transaction.reconciliationStatus = normalized.reconciliationStatus;
      transaction.confirmedAt =
        transaction.confirmedAt ||
        (normalized.reconciliationStatus === "matched" ? new Date() : null);
      transaction.metadata = {
        ...(transaction.metadata || {}),
        manualReconciliation: {
          previousReconciliationStatus,
          reconciliationStatus: normalized.reconciliationStatus,
          note: normalized.note,
          resolvedBy: req.user?.sub || null,
          resolvedAt: new Date(),
        },
      };
      await transaction.save();

      const invoice = await Invoice.findById(transaction.invoiceId);
      if (invoice) {
        invoice.paymentStatus = mapManualReconciliationToInvoicePaymentStatus(
          transaction.reconciliationStatus,
          transaction.status
        );
        invoice.paymentMethod = transaction.provider;
        if (invoice.paymentStatus === "completed") {
          invoice.invoice_paid_date = transaction.confirmedAt || new Date();
        }
        await invoice.save();
      }

      return apiResponse.success(
        res,
        200,
        {
          transactionId: transaction._id,
          reconciliationStatus: transaction.reconciliationStatus,
          invoicePaymentStatus: invoice?.paymentStatus || null,
        },
        "PAYMENT_TRANSACTION_RECONCILED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "No se pudo conciliar la transaccion de pago",
          detail: error.message,
        },
        "PAYMENT_TRANSACTION_RECONCILE_FAILED"
      );
    }
  },

  importPaymentReconciliation: async function (req, res) {
    try {
      if (!isPrivilegedPaymentRole(req)) {
        return apiResponse.failure(
          res,
          403,
          { message: "No autorizado para importar conciliaciones" },
          "FORBIDDEN"
        );
      }

      const provider = paymentGateway.normalizeProvider(req.body?.provider);
      const rows = Array.isArray(req.body?.rows)
        ? req.body.rows
        : Array.isArray(req.body?.records)
        ? req.body.records
        : [];

      if (!paymentGateway.isSupportedProvider(provider)) {
        return apiResponse.failure(
          res,
          400,
          { message: "Proveedor de pago no soportado" },
          "PAYMENT_PROVIDER_UNSUPPORTED"
        );
      }

      if (rows.length === 0 || rows.length > 500) {
        return apiResponse.failure(
          res,
          400,
          { message: "rows debe contener entre 1 y 500 registros" },
          "VALIDATION_ERROR"
        );
      }

      const results = [];
      const summary = {
        total: rows.length,
        matched: 0,
        mismatched: 0,
        manual_review: 0,
        not_found: 0,
        invalid: 0,
      };

      for (const [index, rawRow] of rows.entries()) {
        const row = normalizeImportRow(rawRow);
        if (row.error) {
          summary.invalid += 1;
          results.push({ index, status: "invalid", error: row.error });
          continue;
        }

        const transaction = await PaymentTransaction.findOne({
          ...buildImportRowQuery(provider, row), organizationId: req.auth.organizationId,
          ...(req.auth.scope?.mode !== "ALL" ? { condominiumId: { $in: req.auth.scope?.condominiumIds || [] } } : {}),
        });

        if (!transaction) {
          summary.not_found += 1;
          results.push({
            index,
            status: "not_found",
            providerTransactionId: row.providerTransactionId || null,
            providerReference: row.providerReference || null,
            idempotencyKey: row.idempotencyKey || null,
          });
          continue;
        }

        const resolution = resolveImportedReconciliation(row, transaction);
        const protectedInvoice = await Invoice.findById(transaction.invoiceId);
        if (isBankTransfer(transaction) || protectedInvoice?.paymentWorkflow === "bank_transfer" || protectedInvoice?.paidAmount > 0) {
          summary.manual_review += 1;
          results.push({ index, status: "manual_review", transactionId: transaction._id, reason: "bank_evidence_required" });
          continue;
        }
        if (
          transaction.reconciliationStatus === "matched" &&
          resolution.reconciliationStatus !== "matched"
        ) {
          summary.manual_review += 1;
          results.push({
            index,
            status: "manual_review",
            transactionId: transaction._id,
            invoiceId: transaction.invoiceId,
            reason: "already_matched_not_overwritten",
          });
          continue;
        }

        const previousReconciliationStatus = transaction.reconciliationStatus;
        const previousStatus = transaction.status;

        transaction.status = resolution.transactionStatus;
        transaction.reconciliationStatus = resolution.reconciliationStatus;
        transaction.confirmedAt =
          resolution.reconciliationStatus === "matched"
            ? row.settledAt || transaction.confirmedAt || new Date()
            : transaction.confirmedAt;
        transaction.metadata = {
          ...(transaction.metadata || {}),
          latestSettlementImport: {
            previousStatus,
            previousReconciliationStatus,
            reconciliationStatus: resolution.reconciliationStatus,
            reason: resolution.reason,
            row,
            importedBy: req.user?.sub || null,
            importedAt: new Date(),
          },
        };
        await transaction.save();

        const invoice = await Invoice.findById(transaction.invoiceId);
        if (invoice) {
          invoice.paymentStatus = mapManualReconciliationToInvoicePaymentStatus(
            transaction.reconciliationStatus,
            transaction.status
          );
          invoice.paymentMethod = transaction.provider;
          if (invoice.paymentStatus === "completed") {
            invoice.invoice_paid_date = transaction.confirmedAt || new Date();
          }
          await invoice.save();
        }

        summary[transaction.reconciliationStatus] += 1;
        results.push({
          index,
          status: transaction.reconciliationStatus,
          transactionId: transaction._id,
          invoiceId: transaction.invoiceId,
          reason: resolution.reason,
          invoicePaymentStatus: invoice?.paymentStatus || null,
        });
      }

      return apiResponse.success(
        res,
        200,
        { summary, results },
        "PAYMENT_RECONCILIATION_IMPORTED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "No se pudo importar la conciliacion de pagos",
          detail: error.message,
        },
        "PAYMENT_RECONCILIATION_IMPORT_FAILED"
      );
    }
  },

  sendInvoiceWhatsappReminder: async function (req, res) {
    try {
      if (!hasPaymentAccess(req)) {
        return apiResponse.failure(
          res,
          403,
          { message: "No autorizado para enviar recordatorios de pago" },
          "FORBIDDEN"
        );
      }

      const invoiceId = asObjectId(req.params?.invoiceId);
      if (!invoiceId) {
        return apiResponse.failure(
          res,
          400,
          { message: "invoiceId invalido" },
          "VALIDATION_ERROR"
        );
      }

      const normalized = normalizeWhatsappPaymentPayload(req.body || {});
      if (normalized.error) {
        return apiResponse.failure(
          res,
          400,
          { message: normalized.error },
          "VALIDATION_ERROR"
        );
      }

      const invoice = await Invoice.findById(invoiceId)
        .populate("ownerId", "name lastname email phone")
        .populate("condominiumId", "alias")
        .exec();

      if (!invoice) {
        return apiResponse.failure(
          res,
          404,
          { message: "Invoice no encontrada" },
          "INVOICE_NOT_FOUND"
        );
      }

      if (!canSendWhatsappForInvoice(req, invoice)) {
        return apiResponse.failure(
          res,
          403,
          { message: "No autorizado para esta factura" },
          "FORBIDDEN"
        );
      }

      const ownerPhone = invoice?.ownerId?.phone;
      const message = whatsappService.buildPaymentReminderMessage(invoice, {
        type: normalized.type,
        note: normalized.note,
        paymentLink: normalized.paymentLink,
        currency: "DOP",
      });
      const result = await whatsappService.sendWhatsappText(ownerPhone, message);

      const creator = toNotificationCreator(req.user?.role);
      if (creator) {
        await Notification.create({
          organizationId: req.auth.organizationId,
          title:
            normalized.type === "payment_confirmation"
              ? "Confirmacion de pago enviada por WhatsApp"
              : "Recordatorio de pago enviado por WhatsApp",
          content: message,
          type: "payment",
          priority: normalized.type === "payment_confirmation" ? "medium" : "high",
          condominiumId: invoice.condominiumId?._id || invoice.condominiumId,
          targetAudience: "specific",
          specificRecipients: [invoice.ownerId?._id || invoice.ownerId],
          specificRecipientModel: "Owner",
          createdBy: req.user.sub,
          createdByModel: creator.createdByModel,
          createdByRole: creator.createdByRole,
          metadata: {
            source: "api",
            language: "es",
            tags: ["payment", "whatsapp", normalized.type],
            customFields: {
              invoiceId: invoice._id,
              whatsappMode: result.mode,
              providerMessageId: result.providerMessageId || null,
            },
          },
        });
      }

      invoice.paymentDescription = [
        invoice.paymentDescription,
        `WhatsApp ${normalized.type} enviado ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join(" | ")
        .slice(0, 500);
      await invoice.save();

      return apiResponse.success(
        res,
        200,
        {
          invoiceId: invoice._id,
          phone: whatsappService.normalizePhoneNumber(ownerPhone),
          mode: result.mode,
          providerMessageId: result.providerMessageId || null,
        },
        "PAYMENT_WHATSAPP_SENT"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "No se pudo enviar el WhatsApp de pago",
          detail: error.message,
        },
        "PAYMENT_WHATSAPP_SEND_FAILED"
      );
    }
  },

  listCommunicationLogs: async function (req, res) {
    try {
      if (!isPrivilegedPaymentRole(req)) {
        return apiResponse.failure(
          res,
          403,
          { message: "No autorizado para consultar comunicaciones" },
          "FORBIDDEN"
        );
      }

      const { filters, error } = buildCommunicationLogFilters(req);
      if (error) {
        return apiResponse.failure(
          res,
          400,
          { message: error },
          "VALIDATION_ERROR"
        );
      }
      filters.organizationId = req.auth.organizationId;

      const limit = Math.min(Math.max(Number(req.query?.limit) || 20, 1), 500);
      const page = Math.max(Number(req.query?.page) || 1, 1);
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        CommunicationLog.find(filters)
          .sort({ sentAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        CommunicationLog.countDocuments(filters),
      ]);

      return apiResponse.success(
        res,
        200,
        { page, limit, total, docs },
        "COMMUNICATION_LOGS_LISTED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "No se pudo consultar el historial de comunicaciones",
          detail: error.message,
        },
        "COMMUNICATION_LOGS_LIST_FAILED"
      );
    }
  },

  runPaymentReminderJob: async function (req, res) {
    try {
      if (!isPrivilegedPaymentRole(req)) {
        return apiResponse.failure(
          res,
          403,
          { message: "No autorizado para ejecutar recordatorios" },
          "FORBIDDEN"
        );
      }

      const dryRun = req.body?.dryRun !== false;
      const config = {
        ...paymentReminderJob.getReminderConfig(),
        ...(req.body?.config || {}),
      };

      const summary = await paymentReminderJob.sendOverduePaymentReminders({
        config,
        sendText: dryRun
          ? async () => ({
              mode: "dry_run",
              providerMessageId: "dry-run",
            })
          : undefined,
        createLog: dryRun ? async () => null : undefined,
      });

      return apiResponse.success(
        res,
        200,
        {
          dryRun,
          config: {
            graceDays: config.graceDays,
            minDaysBetween: config.minDaysBetween,
            batchSize: config.batchSize,
          },
          summary,
        },
        dryRun ? "PAYMENT_REMINDER_JOB_DRY_RUN" : "PAYMENT_REMINDER_JOB_RUN"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "No se pudo ejecutar el job de recordatorios",
          detail: error.message,
        },
        "PAYMENT_REMINDER_JOB_FAILED"
      );
    }
  },

  handlePaymentWebhook: async function (req, res) {
    try {
      const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || "";
      const signature = req.headers["x-payment-signature"];

      if (!paymentGateway.verifyWebhookSignature(signature, webhookSecret)) {
        return apiResponse.failure(
          res,
          401,
          { message: "Webhook signature invalida" },
          "WEBHOOK_SIGNATURE_INVALID"
        );
      }

      const event = paymentGateway.normalizeWebhookPayload(req.body || {});
      if (!paymentGateway.isSupportedProvider(event.provider)) return apiResponse.failure(res, 400, { message: "Las transferencias requieren conciliación con evidencia bancaria" }, "BANK_EVIDENCE_REQUIRED");
      if (!event.provider || !event.providerTransactionId) {
        return apiResponse.failure(
          res,
          400,
          { message: "provider y providerTransactionId son requeridos" },
          "VALIDATION_ERROR"
        );
      }

      const transaction = await PaymentTransaction.findOne({
        provider: event.provider,
        providerTransactionId: event.providerTransactionId,
      });

      if (!transaction) {
        return apiResponse.failure(
          res,
          404,
          { message: "Payment transaction no encontrada" },
          "PAYMENT_TRANSACTION_NOT_FOUND"
        );
      }

      const protectedInvoice = await Invoice.findById(transaction.invoiceId);
      if (isBankTransfer(transaction) || protectedInvoice?.paymentWorkflow === "bank_transfer" || protectedInvoice?.paidAmount > 0) return apiResponse.failure(res, 409, { message: "La factura requiere conciliación bancaria y no puede ser confirmada por webhook" }, "BANK_EVIDENCE_REQUIRED");
      transaction.status = mapGatewayStatusToTransactionStatus(event.status);
      transaction.providerReference =
        event.providerReference || transaction.providerReference;
      transaction.reconciliationStatus =
        transaction.status === "succeeded" ? "matched" : "manual_review";
      transaction.confirmedAt =
        transaction.status === "processing" ? null : new Date();
      transaction.metadata = {
        ...(transaction.metadata || {}),
        latestWebhook: event.raw,
      };
      await transaction.save();

      const invoice = await Invoice.findById(transaction.invoiceId);
      if (invoice) {
        invoice.paymentStatus = mapTransactionToInvoicePaymentStatus(
          transaction.status
        );
        invoice.paymentMethod = transaction.provider;
        if (invoice.paymentStatus === "completed") {
          invoice.invoice_paid_date = transaction.confirmedAt || new Date();
        }
        await invoice.save();
      }

      return apiResponse.success(
        res,
        200,
        {
          transactionId: transaction._id,
          status: transaction.status,
          reconciliationStatus: transaction.reconciliationStatus,
        },
        "PAYMENT_WEBHOOK_PROCESSED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        {
          message: "No se pudo procesar el webhook de pago",
          detail: error.message,
        },
        "PAYMENT_WEBHOOK_PROCESS_FAILED"
      );
    }
  },
};

paymentController._helpers = {
  hasPaymentAccess,
  mapGatewayStatusToTransactionStatus,
  mapTransactionToInvoicePaymentStatus,
  isPrivilegedPaymentRole,
  isOwnerPaymentRole,
  toNotificationCreator,
  normalizeWhatsappPaymentPayload,
  canSendWhatsappForInvoice,
  buildTransactionFilters,
  buildCommunicationLogFilters,
  normalizeManualReconciliationPayload,
  normalizeImportRow,
  buildImportRowQuery,
  resolveImportedReconciliation,
  canManuallyReconcile,
  mapManualReconciliationToInvoicePaymentStatus,
};

module.exports = paymentController;
