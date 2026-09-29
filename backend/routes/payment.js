"use strict";

const express = require("express");
const paymentController = require("../controllers/payment");
const md_auth = require("../middleware/auth");

const router = express.Router();

router.get(
  "/payments/transactions",
  md_auth.authenticated,
  paymentController.listPaymentTransactions
);
router.get(
  "/payments/communications",
  md_auth.authenticated,
  paymentController.listCommunicationLogs
);
router.post(
  "/payments/reminders/run",
  md_auth.authenticated,
  paymentController.runPaymentReminderJob
);
router.post(
  "/payments/intent",
  md_auth.authenticated,
  paymentController.createPaymentIntent
);
router.patch(
  "/payments/transactions/:id/reconciliation",
  md_auth.authenticated,
  paymentController.reconcilePaymentTransaction
);
router.post(
  "/payments/reconciliation/import",
  md_auth.authenticated,
  paymentController.importPaymentReconciliation
);
router.post(
  "/payments/invoices/:invoiceId/whatsapp-reminder",
  md_auth.authenticated,
  paymentController.sendInvoiceWhatsappReminder
);
router.post("/payments/webhook", paymentController.handlePaymentWebhook);

module.exports = router;
