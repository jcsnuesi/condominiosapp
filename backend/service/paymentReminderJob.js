"use strict";

const cron = require("node-cron");
const Invoice = require("../models/invoice");
const CommunicationLog = require("../models/communicationLog");
// Phase 3 (medium): notification pipeline batch — extend reminder pipeline to bookings/inquiry confirmations (approved scope)
const whatsappService = require("./whatsappService");
const { remainingInvoiceBalance } = require("./invoiceBalance");

function getReminderConfig() {
  return {
    enabled:
      String(process.env.ENABLE_WHATSAPP_PAYMENT_REMINDERS || "false")
        .trim()
        .toLowerCase() === "true",
    cron: process.env.WHATSAPP_PAYMENT_REMINDER_CRON || "0 10 * * *",
    timezone: process.env.WHATSAPP_PAYMENT_REMINDER_TIMEZONE || "America/Santo_Domingo",
    graceDays: Math.max(Number(process.env.WHATSAPP_PAYMENT_REMINDER_GRACE_DAYS || 1), 0),
    minDaysBetween: Math.max(
      Number(process.env.WHATSAPP_PAYMENT_REMINDER_MIN_DAYS_BETWEEN || 7),
      1
    ),
    batchSize: Math.min(
      Math.max(Number(process.env.WHATSAPP_PAYMENT_REMINDER_BATCH_SIZE || 50), 1),
      500
    ),
  };
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildOverdueInvoiceQuery(now = new Date(), graceDays = 1) {
  return {
    paymentStatus: "pending",
    dueDate: { $lte: addDays(now, -graceDays) },
  };
}

function hasRecentReminder(logs, now = new Date(), minDaysBetween = 7) {
  const cutoff = addDays(now, -minDaysBetween);
  return (logs || []).some((log) => {
    const status = String(log?.status || "").toLowerCase();
    const sentAt = new Date(log?.sentAt || 0);
    return status === "sent" && sentAt >= cutoff;
  });
}

function getInvoiceOwner(invoice) {
  return invoice?.ownerId || {};
}

function getInvoiceCondo(invoice) {
  return invoice?.condominiumId || {};
}

function createLogPayload(invoice, status, details = {}) {
  const owner = getInvoiceOwner(invoice);
  const condo = getInvoiceCondo(invoice);

  return {
    channel: "whatsapp",
    type: "payment_reminder",
    status,
    invoiceId: invoice?._id,
    ownerId: owner?._id || invoice?.ownerId,
    condominiumId: condo?._id || invoice?.condominiumId,
    recipientPhone: details.recipientPhone || owner?.phone || "",
    providerMessageId: details.providerMessageId || null,
    message: details.message || "",
    reason: details.reason || "",
    sentAt: details.sentAt || new Date(),
    metadata: {
      source: "whatsapp-payment-reminder-job",
      whatsappMode: details.mode || null,
      error: details.error || null,
    },
  };
}

async function processInvoiceReminder(invoice, deps, options = {}) {
  if (!await require("./saasCommercial").automationAllowed(invoice.organizationId, "finance") || !await require("./saasCommercial").automationAllowed(invoice.organizationId, "communications")) return { status: "skipped", reason: "membership_or_module_unavailable", invoiceId: invoice?._id };
  const now = options.now || new Date();
  if (remainingInvoiceBalance(invoice) <= 0) {
    return { status: "skipped", reason: "no_pending_balance", invoiceId: invoice?._id };
  }
  const minDaysBetween = options.minDaysBetween || 7;
  const owner = getInvoiceOwner(invoice);
  const phone = whatsappService.normalizePhoneNumber(owner?.phone);

  if (!phone) {
    const payload = createLogPayload(invoice, "skipped", {
      reason: "missing_phone",
      sentAt: now,
    });
    await deps.createLog(payload);
    return { status: "skipped", reason: "missing_phone", invoiceId: invoice?._id };
  }

  const recentLogs = await deps.findRecentLogs(invoice, minDaysBetween, now);
  if (hasRecentReminder(recentLogs, now, minDaysBetween)) {
    const payload = createLogPayload(invoice, "skipped", {
      recipientPhone: phone,
      reason: "frequency_limited",
      sentAt: now,
    });
    await deps.createLog(payload);
    return {
      status: "skipped",
      reason: "frequency_limited",
      invoiceId: invoice?._id,
    };
  }

  const message = whatsappService.buildPaymentReminderMessage(invoice, {
    type: "payment_reminder",
  });

  try {
    const result = await deps.sendText(phone, message);
    await deps.createLog(
      createLogPayload(invoice, "sent", {
        recipientPhone: phone,
        providerMessageId: result.providerMessageId,
        message,
        mode: result.mode,
        sentAt: now,
      })
    );

    return {
      status: "sent",
      invoiceId: invoice?._id,
      providerMessageId: result.providerMessageId || null,
      mode: result.mode,
    };
  } catch (error) {
    await deps.createLog(
      createLogPayload(invoice, "failed", {
        recipientPhone: phone,
        message,
        reason: "send_failed",
        error: error.message,
        sentAt: now,
      })
    );

    return {
      status: "failed",
      reason: "send_failed",
      invoiceId: invoice?._id,
      error: error.message,
    };
  }
}

async function findOverdueInvoices(config = getReminderConfig()) {
  return Invoice.find(buildOverdueInvoiceQuery(new Date(), config.graceDays))
    .populate("ownerId", "name lastname email phone")
    .populate("condominiumId", "alias")
    .sort({ dueDate: 1 })
    .limit(config.batchSize)
    .lean();
}

async function sendOverduePaymentReminders(options = {}) {
  const config = { ...getReminderConfig(), ...(options.config || {}) };
  const invoices = options.invoices || (await findOverdueInvoices(config));
  const deps = {
    sendText: options.sendText || whatsappService.sendWhatsappText,
    createLog:
      options.createLog ||
      ((payload) => {
        return CommunicationLog.create(payload);
      }),
    findRecentLogs:
      options.findRecentLogs ||
      ((invoice, minDaysBetween, now) => {
        return CommunicationLog.find({
          invoiceId: invoice._id,
          channel: "whatsapp",
          type: "payment_reminder",
          status: "sent",
          sentAt: { $gte: addDays(now, -minDaysBetween) },
        }).lean();
      }),
  };

  const summary = {
    total: invoices.length,
    sent: 0,
    skipped: 0,
    failed: 0,
    results: [],
  };

  for (const invoice of invoices) {
    const result = await processInvoiceReminder(invoice, deps, {
      now: options.now || new Date(),
      minDaysBetween: config.minDaysBetween,
    });
    summary[result.status] += 1;
    summary.results.push(result);
  }

  return summary;
}

async function setupPaymentReminderCronJobs() {
  const config = getReminderConfig();

  if (!config.enabled) {
    console.log("WhatsApp payment reminder cron disabled");
    return null;
  }

  const task = cron.schedule(
    config.cron,
    async () => {
      console.log("WhatsApp payment reminder cron triggered");
      try {
        const summary = await sendOverduePaymentReminders({ config });
        console.log("WhatsApp payment reminder summary", summary);
      } catch (error) {
        console.error("WhatsApp payment reminder cron failed:", error.message);
      }
    },
    {
      scheduled: true,
      timezone: config.timezone,
    }
  );

  console.log(`WhatsApp payment reminder cron configured: ${config.cron}`);
  return task;
}

module.exports = {
  getReminderConfig,
  buildOverdueInvoiceQuery,
  hasRecentReminder,
  createLogPayload,
  processInvoiceReminder,
  sendOverduePaymentReminders,
  setupPaymentReminderCronJobs,
};
