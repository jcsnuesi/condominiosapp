"use strict";

// Delivery grace never extends the physical execution deadline.
const COMMAND_FEEDBACK_GRACE_MS = 300000;
function expiryCandidates(now) {
  return { $or: [
    { status: "REQUESTED", expiresAt: { $lte: now } },
    { status: { $in: ["DISPATCHED", "ACKNOWLEDGED"] },
      expiresAt: { $lte: new Date(now.getTime() - COMMAND_FEEDBACK_GRACE_MS) } },
  ] };
}
module.exports = { COMMAND_FEEDBACK_GRACE_MS, expiryCandidates };
