"use strict";
const mongoose = require("mongoose");
const Command = require("../../../models/iotCommand");
const Outbox = require("../../../models/iotIntegrationOutbox");
const { expiryCandidates } = require("../domain/commandDeadline");
const { apiError } = require("../../../service/iotService");

class IoTCommandExpiryService {
  constructor({ CommandModel = Command, OutboxModel = Outbox, mongo = mongoose,
    now = () => new Date(), enabled = () => process.env.IOT_COMMANDS_ENABLED === "true" } = {}) {
    Object.assign(this, { CommandModel, OutboxModel, mongo, now, enabled });
  }

  async expireCommands({ limit = 100 } = {}) {
    if (!this.enabled()) return { status: "DISABLED", scanned: 0, changed: 0 };
    if (!Number.isInteger(limit) || limit < 1 || limit > 500)
      throw apiError("IOT_COMMAND_EXPIRY_CONFIG_INVALID", "Invalid command sweep limit", 422);
    const deadline = this.now();
    const candidates = await this.CommandModel.find(expiryCandidates(deadline))
      .sort({ expiresAt: 1, _id: 1 }).limit(limit).lean();
    let changed = 0;
    for (const command of candidates) {
      const session = await this.mongo.startSession();
      try {
        let applied = false;
        await session.withTransaction(async () => {
          applied = false;
          const result = await this.CommandModel.updateOne({ commandId: command.commandId,
            status: command.status, ...expiryCandidates(deadline) }, { $set: {
            status: "EXPIRED", failureCode: command.status === "REQUESTED"
              ? "IOT_COMMAND_EXPIRED" : "IOT_COMMAND_FEEDBACK_TIMEOUT",
          } }, { session, runValidators: true });
          if (result.modifiedCount !== 1) return;
          // SENT records transport acceptance and must remain available as history.
          await this.OutboxModel.updateMany({ commandId: command.commandId, status: { $in: ["PENDING", "LEASED"] } },
            { $set: { status: "DEAD", lastErrorCode: "IOT_COMMAND_EXPIRED", leaseToken: null, leaseUntil: null } },
            { session, runValidators: true });
          applied = true;
        });
        if (applied) changed++;
      } finally { await session.endSession(); }
    }
    return { scanned: candidates.length, changed };
  }
}
module.exports = { IoTCommandExpiryService };
