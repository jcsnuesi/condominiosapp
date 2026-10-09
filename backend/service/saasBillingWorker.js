"use strict";
let timer, running = false;
const state = { lastRunAt: null, lastSuccessAt: null, failures: 0, running: false };
async function run() {
  if (running || !require("./saasCommercial").enabled("SAAS_PAYPAL_ENABLED")) return;
  running = true; state.running = true; state.lastRunAt = new Date();
  try {
    let failed = false;
    const Subscription = require("../models/saasSubscription");
    try { await require("./saasCapacityBilling").reconcilePending(); } catch { failed = true; state.failures++; }
    const cursor = Subscription.find({ open: true, environment: require("./saasPaypal").environment(), $or: [{ graceUntil: { $lte: new Date() } }, { paidThrough: { $lte: new Date() } }, { paidThrough: null, createdAt: { $lte: new Date(Date.now() - 86400000) } }] }).lean().cursor();
    for await (const subscription of cursor) {
      try { await require("./saasBillingService").settle(subscription); }
      catch { failed = true; state.failures++; console.error(JSON.stringify({ event: "saas.reconciliation.failed", subscriptionId: String(subscription._id), subjectId: String(subscription.subjectId) })); }
    }
    if (!failed) state.lastSuccessAt = new Date();
  } finally { running = false; state.running = false; }
}
function start() { if (!timer) { timer = setInterval(() => run().catch(() => { state.failures++; }), 60000); timer.unref(); } }
module.exports = { run, start, state };
