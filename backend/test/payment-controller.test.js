"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const paymentController = require("../controllers/payment");

const {
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
} = paymentController._helpers;

test("hasPaymentAccess allows expected roles", () => {
  assert.equal(hasPaymentAccess({ user: { role: "OWNER" } }), true);
  assert.equal(hasPaymentAccess({ user: { role: "ADMIN" } }), true);
  assert.equal(hasPaymentAccess({ user: { role: "STAFF_ADMIN" } }), true);
  assert.equal(hasPaymentAccess({ user: { role: "FAMILY" } }), false);
});

test("mapGatewayStatusToTransactionStatus normalizes unsupported values", () => {
  assert.equal(mapGatewayStatusToTransactionStatus("succeeded"), "succeeded");
  assert.equal(mapGatewayStatusToTransactionStatus("processing"), "processing");
  assert.equal(mapGatewayStatusToTransactionStatus("cancelled"), "cancelled");
  assert.equal(mapGatewayStatusToTransactionStatus("other"), "failed");
});

test("mapTransactionToInvoicePaymentStatus maps to legacy invoice statuses", () => {
  assert.equal(mapTransactionToInvoicePaymentStatus("succeeded"), "completed");
  assert.equal(mapTransactionToInvoicePaymentStatus("failed"), "failed");
  assert.equal(mapTransactionToInvoicePaymentStatus("cancelled"), "failed");
  assert.equal(mapTransactionToInvoicePaymentStatus("processing"), "pending");
});

test("isPrivilegedPaymentRole identifies admin scopes", () => {
  assert.equal(isPrivilegedPaymentRole({ user: { role: "ADMIN" } }), true);
  assert.equal(
    isPrivilegedPaymentRole({ user: { role: "STAFF_ADMIN" } }),
    true
  );
  assert.equal(isPrivilegedPaymentRole({ user: { role: "OWNER" } }), false);
});

test("whatsapp payment helpers validate roles and payloads", () => {
  assert.equal(isOwnerPaymentRole({ user: { role: "OWNER" } }), true);
  assert.equal(isOwnerPaymentRole({ user: { role: "ROLE_OWNER" } }), true);
  assert.equal(isOwnerPaymentRole({ user: { role: "ADMIN" } }), false);

  assert.deepEqual(toNotificationCreator("ADMIN"), {
    createdByModel: "Admin",
    createdByRole: "ADMIN",
  });
  assert.deepEqual(toNotificationCreator("ROLE_STAFF_ADMIN"), {
    createdByModel: "Staff_Admin",
    createdByRole: "STAFF_ADMIN",
  });
  assert.equal(toNotificationCreator("OWNER"), null);

  const valid = normalizeWhatsappPaymentPayload({
    type: " payment_confirmation ",
    note: " Confirmado ",
    paymentLink: "https://pay.example.test/i/1",
  });
  assert.equal(valid.error, undefined);
  assert.equal(valid.type, "payment_confirmation");
  assert.equal(valid.note, "Confirmado");

  const invalidType = normalizeWhatsappPaymentPayload({ type: "other" });
  assert.equal(
    invalidType.error,
    "type debe ser payment_reminder o payment_confirmation"
  );

  assert.equal(
    canSendWhatsappForInvoice(
      { user: { role: "OWNER", sub: "507f1f77bcf86cd799439011" } },
      { ownerId: { _id: "507f1f77bcf86cd799439011" } }
    ),
    true
  );
  assert.equal(
    canSendWhatsappForInvoice(
      { user: { role: "OWNER", sub: "507f1f77bcf86cd799439011" } },
      { ownerId: { _id: "507f1f77bcf86cd799439012" } }
    ),
    false
  );
  assert.equal(
    canSendWhatsappForInvoice(
      { user: { role: "STAFF_ADMIN", sub: "507f1f77bcf86cd799439013" } },
      { ownerId: { _id: "507f1f77bcf86cd799439012" } }
    ),
    true
  );
});

test("buildTransactionFilters enforces owner scope for non privileged roles", () => {
  const ownerReq = {
    user: { role: "OWNER", sub: "507f1f77bcf86cd799439011" },
    query: {
      status: "succeeded",
      provider: "azul",
      reconciliationStatus: "manual_review",
    },
  };

  const ownerResult = buildTransactionFilters(ownerReq);
  assert.equal(ownerResult.error, undefined);
  assert.equal(String(ownerResult.filters.ownerId), ownerReq.user.sub);
  assert.equal(ownerResult.filters.status, "succeeded");
  assert.equal(ownerResult.filters.provider, "AZUL");
  assert.equal(ownerResult.filters.reconciliationStatus, "manual_review");

  const adminReq = {
    user: { role: "ADMIN", sub: "507f1f77bcf86cd799439012" },
    query: { ownerId: "507f1f77bcf86cd799439013" },
  };

  const adminResult = buildTransactionFilters(adminReq);
  assert.equal(adminResult.error, undefined);
  assert.equal(String(adminResult.filters.ownerId), "507f1f77bcf86cd799439013");

  const invalidReq = {
    user: { role: "ADMIN", sub: "507f1f77bcf86cd799439012" },
    query: { invoiceId: "invalid-id" },
  };

  const invalidResult = buildTransactionFilters(invalidReq);
  assert.equal(invalidResult.error, "invoiceId invalido");
});

test("buildTransactionFilters supports attempted date range and validates values", () => {
  const reqWithRange = {
    user: { role: "ADMIN", sub: "507f1f77bcf86cd799439012" },
    query: {
      attemptedFrom: "2026-06-01",
      attemptedTo: "2026-06-10",
    },
  };

  const withRange = buildTransactionFilters(reqWithRange);
  assert.equal(withRange.error, undefined);
  assert.equal(withRange.filters.attemptedAt.$gte instanceof Date, true);
  assert.equal(withRange.filters.attemptedAt.$lte instanceof Date, true);

  const invalidFrom = buildTransactionFilters({
    user: { role: "ADMIN", sub: "507f1f77bcf86cd799439012" },
    query: { attemptedFrom: "invalid-date" },
  });
  assert.equal(invalidFrom.error, "attemptedFrom invalido");

  const invalidTo = buildTransactionFilters({
    user: { role: "ADMIN", sub: "507f1f77bcf86cd799439012" },
    query: { attemptedTo: "invalid-date" },
  });
  assert.equal(invalidTo.error, "attemptedTo invalido");
});

test("buildCommunicationLogFilters supports ids, status and sent date range", () => {
  const req = {
    query: {
      channel: " WhatsApp ",
      type: "payment_reminder",
      status: "sent",
      invoiceId: "507f1f77bcf86cd799439011",
      ownerId: "507f1f77bcf86cd799439012",
      condominiumId: "507f1f77bcf86cd799439013",
      sentFrom: "2026-06-01",
      sentTo: "2026-06-17",
    },
  };

  const result = buildCommunicationLogFilters(req);
  assert.equal(result.error, undefined);
  assert.equal(result.filters.channel, "whatsapp");
  assert.equal(result.filters.type, "payment_reminder");
  assert.equal(result.filters.status, "sent");
  assert.equal(String(result.filters.invoiceId), req.query.invoiceId);
  assert.equal(String(result.filters.ownerId), req.query.ownerId);
  assert.equal(String(result.filters.condominiumId), req.query.condominiumId);
  assert.equal(result.filters.sentAt.$gte instanceof Date, true);
  assert.equal(result.filters.sentAt.$lte instanceof Date, true);

  const invalidOwner = buildCommunicationLogFilters({
    query: { ownerId: "bad-id" },
  });
  assert.equal(invalidOwner.error, "ownerId invalido");

  const invalidDate = buildCommunicationLogFilters({
    query: { sentFrom: "not-a-date" },
  });
  assert.equal(invalidDate.error, "sentFrom invalido");
});

test("normalizeManualReconciliationPayload validates status and trims note", () => {
  const valid = normalizeManualReconciliationPayload({
    reconciliationStatus: " MATCHED ",
    note: "  Confirmado contra cierre bancario  ",
  });

  assert.equal(valid.error, undefined);
  assert.equal(valid.reconciliationStatus, "matched");
  assert.equal(valid.note, "Confirmado contra cierre bancario");

  const invalidStatus = normalizeManualReconciliationPayload({
    reconciliationStatus: "pending",
  });
  assert.equal(
    invalidStatus.error,
    "reconciliationStatus debe ser matched, mismatched o manual_review"
  );

  const invalidNote = normalizeManualReconciliationPayload({
    reconciliationStatus: "matched",
    note: "x".repeat(501),
  });
  assert.equal(
    invalidNote.error,
    "La nota de conciliacion no puede exceder 500 caracteres"
  );
});

test("manual reconciliation helpers gate eligible transactions and invoice status", () => {
  assert.equal(
    canManuallyReconcile({ reconciliationStatus: "manual_review" }),
    true
  );
  assert.equal(canManuallyReconcile({ reconciliationStatus: "mismatched" }), true);
  assert.equal(canManuallyReconcile({ reconciliationStatus: "pending" }), false);
  assert.equal(canManuallyReconcile({ reconciliationStatus: "matched" }), false);

  assert.equal(
    mapManualReconciliationToInvoicePaymentStatus("matched", "failed"),
    "completed"
  );
  assert.equal(
    mapManualReconciliationToInvoicePaymentStatus("mismatched", "failed"),
    "failed"
  );
  assert.equal(
    mapManualReconciliationToInvoicePaymentStatus("manual_review", "processing"),
    "pending"
  );
});

test("normalizeImportRow validates settlement import rows", () => {
  const valid = normalizeImportRow({
    providerTransactionId: " tx-1 ",
    amount: "1250.50",
    currency: "dop",
    status: " PAID ",
    settledAt: "2026-06-10",
    note: " cierre banco ",
  });

  assert.equal(valid.error, undefined);
  assert.equal(valid.providerTransactionId, "tx-1");
  assert.equal(valid.amount, 1250.5);
  assert.equal(valid.currency, "DOP");
  assert.equal(valid.status, "paid");
  assert.equal(valid.settledAt instanceof Date, true);
  assert.equal(valid.note, "cierre banco");

  const missingReference = normalizeImportRow({ amount: 100 });
  assert.equal(
    missingReference.error,
    "Cada fila requiere providerTransactionId, providerReference o idempotencyKey"
  );

  const invalidAmount = normalizeImportRow({
    providerReference: "ref-1",
    amount: 0,
  });
  assert.equal(
    invalidAmount.error,
    "Cada fila requiere un monto valido mayor que cero"
  );

  const invalidDate = normalizeImportRow({
    providerReference: "ref-1",
    amount: 10,
    settledAt: "not-a-date",
  });
  assert.equal(invalidDate.error, "settledAt invalido");
});

test("buildImportRowQuery matches by supported settlement identifiers", () => {
  const query = buildImportRowQuery("AZUL", {
    providerTransactionId: "tx-1",
    providerReference: "ref-1",
    idempotencyKey: "idem-1",
  });

  assert.equal(query.provider, "AZUL");
  assert.deepEqual(query.$or, [
    { providerTransactionId: "tx-1" },
    { providerReference: "ref-1" },
    { idempotencyKey: "idem-1" },
  ]);
});

test("resolveImportedReconciliation classifies settlement rows safely", () => {
  const transaction = {
    amount: 1200,
    currency: "DOP",
    status: "processing",
  };

  assert.deepEqual(
    resolveImportedReconciliation(
      { amount: 1200, currency: "DOP", status: "settled" },
      transaction
    ),
    {
      reconciliationStatus: "matched",
      transactionStatus: "succeeded",
      reason: "matched",
    }
  );

  assert.deepEqual(
    resolveImportedReconciliation(
      { amount: 1199, currency: "DOP", status: "settled" },
      transaction
    ),
    {
      reconciliationStatus: "mismatched",
      transactionStatus: "processing",
      reason: "amount_mismatch",
    }
  );

  assert.deepEqual(
    resolveImportedReconciliation(
      { amount: 1200, currency: "USD", status: "settled" },
      transaction
    ),
    {
      reconciliationStatus: "mismatched",
      transactionStatus: "processing",
      reason: "currency_mismatch",
    }
  );

  assert.deepEqual(
    resolveImportedReconciliation(
      { amount: 1200, currency: "DOP", status: "reversed" },
      transaction
    ),
    {
      reconciliationStatus: "manual_review",
      transactionStatus: "failed",
      reason: "provider_reported_failure",
    }
  );
});
