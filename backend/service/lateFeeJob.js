"use strict";
const cron = require("node-cron");
const { FinanceSettings } = require("../models/finance");
let running = false;
let scheduled;
async function run() {
  if (running) return;
  running = true;
  try {
    const { runLateFees } = require("../controllers/finance")._helpers;
    for await (const settings of FinanceSettings.find({ enabled: true, "lateFee.enabled": true }).cursor()) {
      try { await runLateFees(settings); }
      catch (error) { console.error("Late fee job failed for condominium", String(settings.condominiumId), error.code || error.name); }
    }
  } finally { running = false; }
}
function setup() {
  if (!scheduled) scheduled = cron.schedule("0 10 * * *", run, { timezone: "America/Santo_Domingo" });
  return scheduled;
}
module.exports = { setup, run };
