"use strict";

const NEXT = Object.freeze({
  REQUESTED: ["DISPATCHED", "FAILED", "EXPIRED"],
  DISPATCHED: ["ACKNOWLEDGED", "FAILED", "EXPIRED"],
  ACKNOWLEDGED: ["EXECUTED", "FAILED", "EXPIRED"],
  EXECUTED: [], FAILED: [], EXPIRED: [],
});

// Returns the filter/update for an atomic compare-and-set. No dispatch or
// actuator operation is performed by this domain helper.
function commandTransition(command, status, { now = new Date(), evidenceRef, failureCode = "" } = {}) {
  const invalid = () => { throw Object.assign(new Error("Invalid command transition"), { code: "IOT_COMMAND_TRANSITION_INVALID", statusCode: 409 }); };
  if (!command?.commandId || !NEXT[command.status]?.includes(status)) invalid();
  const expiresAt = new Date(command.expiresAt);
  if (!Number.isFinite(expiresAt.getTime()) || !Number.isFinite(now.getTime()) ||
      (status === "EXPIRED" ? expiresAt > now : expiresAt <= now)) invalid();
  if (status === "EXECUTED" && (typeof evidenceRef !== "string" || !evidenceRef.trim() || evidenceRef.length > 256)) invalid();
  if (status === "FAILED" && !/^[A-Z0-9_]{1,80}$/.test(failureCode)) invalid();
  const update = { status };
  const timeField = { DISPATCHED: "dispatchedAt", ACKNOWLEDGED: "acknowledgedAt", EXECUTED: "executedAt" }[status];
  if (timeField) update[timeField] = now;
  if (status === "EXECUTED") update.evidenceRef = evidenceRef;
  if (status === "FAILED") update.failureCode = failureCode;
  return {
    filter: { commandId: command.commandId, status: command.status, expiresAt: status === "EXPIRED" ? { $lte: now } : { $gt: now } },
    update: { $set: update },
  };
}

module.exports = { commandTransition };
