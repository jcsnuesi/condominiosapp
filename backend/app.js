"use strict";

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const packageInfo = require("./package.json");
const app = express();
const responseContract = require("./middleware/responseContract");
// Phase 2 (medium): rate-limit middleware placeholder — install 'express-rate-limit' for inquiry/landing/invoice routes if needed
// In your main app.js or server file
const invoiceService = require("./service/invoice_job");
const icalService = require("./service/ical_job");
const paymentReminderService = require("./service/paymentReminderJob");
const reservationCleanupService = require("./service/reservationCleanupJob");

// Initialize invoice system after all models are loaded
async function initializeInvoiceSystem() {
  try {
    console.log("🔧 Initializing invoice system...");
    await invoiceService.setupInvoiceCronJobs();
    console.log("✅ Invoice system initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize invoice system:", error.message);
  }
}

async function initializeIcalSystem() {
  try {
    console.log("🔧 Initializing iCal sync system...");
    await icalService.setupIcalSyncCronJobs();
    console.log("✅ iCal sync system initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize iCal sync system:", error.message);
  }
}

async function initializePaymentReminderSystem() {
  try {
    console.log("🔧 Initializing WhatsApp payment reminders...");
    await paymentReminderService.setupPaymentReminderCronJobs();
    console.log("✅ WhatsApp payment reminder system initialized");
  } catch (error) {
    console.error(
      "❌ Failed to initialize WhatsApp payment reminders:",
      error.message
    );
  }
}

function initializeReservationCleanupSystem() {
  try {
    reservationCleanupService.setupGuestReservationCleanupJob();
  } catch (error) {
    console.error(
      "Failed to initialize guest reservation cleanup:",
      error.message
    );
  }
}

if (process.env.DISABLE_SCHEDULED_JOBS !== "true") {
  initializeInvoiceSystem();
  initializeIcalSystem();
  initializePaymentReminderSystem();
  initializeReservationCleanupSystem();
  require("./service/receiptOcrWorker").start();
  require("./service/iotReconciliationJob").startIoTReconciliationJob();
} else {
  console.log("Scheduled background jobs are disabled.");
}

//Cargar rutas de archivos
const user_routes = require("./routes/users");
const property_routes = require("./routes/property");
const task_routes = require("./routes/task");
const guest_routes = require("./routes/guest");
const reserve_routes = require("./routes/reserves");
const docs_routes = require("./routes/docs");
const cxc_routes = require("./routes/cxc");
const invoice_routes = require("./routes/invoice");
const personnel_routes = require("./routes/personnel");
const condominio_routes = require("./routes/condominio");
const staff_routes = require("./routes/staff");
const owner = require("./routes/owner");
const super_user = require("./routes/super_user");
const family_routes = require("./routes/family");
const inquiry_routes = require("./routes/inquiry");
const notification_routes = require("./routes/notification");
const str_routes = require("./routes/str");
const payment_routes = require("./routes/payment");
const access_routes = require("./routes/access");
const organization_routes = require("./routes/organization");
const iot_routes = require("./routes/iot");

//Middlewares
app.use(morgan("dev"));

const localOrigins = [
  "http://localhost:9090",
  "*",
  "http://localhost:4200",
  "http://localhost:3000",
];
const configuredOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...configuredOrigins,
  ...(process.env.NODE_ENV === "production" ? [] : localOrigins),
]);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
  })
);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(
  "/api/payments/statements/:id/commit",
  bodyparser.json({ limit: "2mb" })
);
app.use(bodyparser.json());
app.use(responseContract);

app.get("/api/health", function (req, res) {
  res.status(200).send({
    status: "ok",
    version: packageInfo.version,
    uptime: process.uptime(),
  });
});

app.use("/api", user_routes);
app.use("/api", property_routes);
app.use("/api", task_routes);
app.use("/api", guest_routes);
app.use("/api", reserve_routes);
app.use("/api", docs_routes);
app.use("/api", cxc_routes);
app.use("/api", invoice_routes);
app.use("/api", staff_routes);
app.use("/api", personnel_routes);
app.use("/api", condominio_routes);
app.use("/api", owner);
app.use("/api", super_user);
app.use("/api", family_routes);
app.use("/api", inquiry_routes);
app.use("/api", str_routes);
app.use("/api", notification_routes);
app.use("/api", payment_routes);
app.use("/api", require("./routes/bankReconciliation"));
app.use("/api", access_routes);
app.use("/api", organization_routes);
app.use("/api", iot_routes);

module.exports = app;
// Phase 4 (major): auth MFA / brute-force / session-timeout notes preserved in app-level design; not wired without pairing + security review.
