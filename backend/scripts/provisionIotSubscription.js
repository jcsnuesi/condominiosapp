"use strict";
// Server-only operator command. Input comes from a JSON file; no public quota-management endpoint.
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { IoTSubscriptionService } = require("../service/iotSubscriptionService");
async function main() {
  if (!process.argv[2] || !process.env.MONGODB_URI) throw new Error("Usage: node scripts/provisionIotSubscription.js input.json (MONGODB_URI required)");
  const input = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  if (!mongoose.isValidObjectId(input.provisionedBy)) throw new Error("provisionedBy must identify the accountable administrator");
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    const subscription = await new IoTSubscriptionService().provision(input.provisionedBy, input);
    console.log(JSON.stringify({ id: subscription._id, plan: subscription.plan, deviceLimit: subscription.deviceLimit }));
  } finally { await mongoose.disconnect(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
