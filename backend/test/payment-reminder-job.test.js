"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getReminderConfig,
  buildOverdueInvoiceQuery,
  hasRecentReminder,
  createLogPayload,
  processInvoiceReminder,
  sendOverduePaymentReminders,
} = require("../service/paymentReminderJob");

test("getReminderConfig initializes without invoice context", () => {
  assert.doesNotThrow(() => getReminderConfig());

  const config = getReminderConfig();
  assert.equal(typeof config.enabled, "boolean");
  assert.equal(typeof config.cron, "string");
  assert.equal(typeof config.timezone, "string");
});

function mockInvoice(overrides = {}) {
  return {
    _id: "invoice-1",
    invoice_number: "1001",
    amount: 1500,
    paymentStatus: "pending",
    dueDate: new Date("2026-06-01T00:00:00.000Z"),
    ownerId: {
      _id: "owner-1",
      name: "Ana",
      lastname: "Perez",
      phone: "8095551212",
    },
    condominiumId: {
      _id: "condo-1",
      alias: "Torre Central",
    },
    ...overrides,
  };
}

test("paid balances skip reminders without invoking message delivery", async () => {
  const result = await processInvoiceReminder(mockInvoice({ paidAmount: 1500 }), {
    sendText: async () => assert.fail("No reminder for a zero balance"),
    createLog: async () => assert.fail("No external side effect needed"),
    findRecentLogs: async () => assert.fail("No lookup needed"),
  });
  assert.equal(result.reason, "no_pending_balance");
});

test("buildOverdueInvoiceQuery targets pending invoices past grace period", () => {
  const now = new Date("2026-06-17T12:00:00.000Z");
  const query = buildOverdueInvoiceQuery(now, 3);

  assert.equal(query.paymentStatus, "pending");
  assert.equal(query.dueDate.$lte.toISOString(), "2026-06-14T12:00:00.000Z");
});

test("hasRecentReminder enforces frequency limit using sent logs", () => {
  const now = new Date("2026-06-17T12:00:00.000Z");

  assert.equal(
    hasRecentReminder(
      [{ status: "sent", sentAt: new Date("2026-06-12T12:00:00.000Z") }],
      now,
      7
    ),
    true
  );

  assert.equal(
    hasRecentReminder(
      [{ status: "failed", sentAt: new Date("2026-06-12T12:00:00.000Z") }],
      now,
      7
    ),
    false
  );
});

test("createLogPayload maps mock invoice data into communication log", () => {
  const payload = createLogPayload(mockInvoice(), "sent", {
    recipientPhone: "18095551212",
    providerMessageId: "mock-1",
    message: "Mensaje",
    mode: "mock",
    sentAt: new Date("2026-06-17T12:00:00.000Z"),
  });

  assert.equal(payload.channel, "whatsapp");
  assert.equal(payload.type, "payment_reminder");
  assert.equal(payload.status, "sent");
  assert.equal(payload.invoiceId, "invoice-1");
  assert.equal(payload.ownerId, "owner-1");
  assert.equal(payload.condominiumId, "condo-1");
  assert.equal(payload.providerMessageId, "mock-1");
  assert.equal(payload.metadata.whatsappMode, "mock");
});

test("processInvoiceReminder sends WhatsApp with mock dependencies", async () => {
  const createdLogs = [];
  const sentMessages = [];

  const result = await processInvoiceReminder(
    mockInvoice(),
    {
      findRecentLogs: async () => [],
      createLog: async (payload) => {
        createdLogs.push(payload);
      },
      sendText: async (phone, message) => {
        sentMessages.push({ phone, message });
        return { mode: "mock", providerMessageId: "mock-msg-1" };
      },
    },
    {
      now: new Date("2026-06-17T12:00:00.000Z"),
      minDaysBetween: 7,
    }
  );

  assert.equal(result.status, "sent");
  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0].phone, "18095551212");
  assert.match(sentMessages[0].message, /Factura: 1001/);
  assert.equal(createdLogs.length, 1);
  assert.equal(createdLogs[0].status, "sent");
});

test("processInvoiceReminder skips mock invoice without phone", async () => {
  const createdLogs = [];

  const result = await processInvoiceReminder(
    mockInvoice({ ownerId: { _id: "owner-1", name: "Ana", lastname: "Perez" } }),
    {
      findRecentLogs: async () => [],
      createLog: async (payload) => {
        createdLogs.push(payload);
      },
      sendText: async () => {
        throw new Error("should not send");
      },
    }
  );

  assert.equal(result.status, "skipped");
  assert.equal(result.reason, "missing_phone");
  assert.equal(createdLogs[0].status, "skipped");
  assert.equal(createdLogs[0].reason, "missing_phone");
});

test("sendOverduePaymentReminders processes mock data and frequency limits", async () => {
  const createdLogs = [];
  const invoices = [
    mockInvoice({ _id: "invoice-1", invoice_number: "1001" }),
    mockInvoice({ _id: "invoice-2", invoice_number: "1002" }),
  ];

  const summary = await sendOverduePaymentReminders({
    invoices,
    now: new Date("2026-06-17T12:00:00.000Z"),
    config: { minDaysBetween: 7 },
    findRecentLogs: async (invoice) => {
      if (invoice._id === "invoice-2") {
        return [
          {
            status: "sent",
            sentAt: new Date("2026-06-15T12:00:00.000Z"),
          },
        ];
      }
      return [];
    },
    createLog: async (payload) => {
      createdLogs.push(payload);
    },
    sendText: async () => ({ mode: "mock", providerMessageId: "mock-msg" }),
  });

  assert.equal(summary.total, 2);
  assert.equal(summary.sent, 1);
  assert.equal(summary.skipped, 1);
  assert.equal(summary.failed, 0);
  assert.equal(createdLogs.length, 2);
  assert.equal(createdLogs[1].reason, "frequency_limited");
});
