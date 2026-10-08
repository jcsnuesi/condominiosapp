"use strict";
const fs = require("node:fs/promises");
async function read() {
  try {
    const file = process.env.SAAS_BACKUP_STATUS_FILE;
    if (!file) return { verified: false, state: "NOT_CONFIGURED" };
    const input = JSON.parse(await fs.readFile(file, "utf8"));
    const restoredAt = new Date(input.restoredAt), backupAt = new Date(input.backupAt);
    const verified = input.verified === true && Number.isFinite(restoredAt.getTime()) && Number.isFinite(backupAt.getTime()) && restoredAt <= new Date() && backupAt <= restoredAt && typeof input.artifact === "string" && /^[A-Za-z0-9.-]+$/.test(input.artifact);
    return { verified, offsiteVerified: verified && input.offsiteVerified === true, backupAt, restoredAt, artifact: verified ? input.artifact : null, state: verified && Date.now() - restoredAt < 86400000 ? "VERIFIED_RECENT" : "STALE_OR_INVALID" };
  } catch { return { verified: false, state: "UNAVAILABLE" }; }
}
module.exports = { read };
