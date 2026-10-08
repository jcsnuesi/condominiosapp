"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { replaceDurable } = require("./durable-storage");
const hash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const error = (code) => Object.assign(new Error(code), { code });

async function readJson(file, optional = false) {
  try {
    const info = await fs.lstat(file);
    if (!info.isFile() || info.isSymbolicLink() || info.size > 16384) throw error("IOT_EDGE_SPOOL_INVALID");
    const value = await fs.readFile(file, "utf8");
    if (Buffer.byteLength(value) > 16384) throw error("IOT_EDGE_SPOOL_INVALID");
    return JSON.parse(value);
  } catch (failure) {
    if (optional && failure.code === "ENOENT") return null;
    throw failure;
  }
}

function validateEvent(event, command, key, gatewayId, status) {
  const time = new Date(event?.occurredAt);
  if (!event || event.schemaVersion !== 1 || event.gatewayId !== gatewayId ||
    event.gatewayId !== command.gatewayId || event.resourceId !== command.resourceId ||
    event.profileVersion !== command.profileVersion || event.payload?.commandId !== command.commandId ||
    event.payload?.eventType !== "command.ack" || event.payload.status !== status ||
    event.sequence !== (status === "ACKNOWLEDGED" ? 0 : 1) ||
    event.messageId !== `${status === "ACKNOWLEDGED" ? "ack" : "result"}-${key}` ||
    !Number.isFinite(time.getTime()) || time.toISOString() !== event.occurredAt)
    throw error("IOT_EDGE_SPOOL_INVALID");
}

class GatewayEventUploader {
  // Adapter must return accepted:true only after durable application ingestion.
  // MQTT PUBACK alone is insufficient. No default network implementation.
  constructor({ gatewayId, stateDirectory, transport, now = () => new Date() }) {
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(gatewayId || "") || !path.isAbsolute(stateDirectory || "") ||
      typeof transport?.publishEvent !== "function") throw error("IOT_EDGE_UPLOADER_CONFIG_INVALID");
    Object.assign(this, { gatewayId, stateDirectory, transport, now });
    this.running = false;
  }

  async uploadPending({ limit = 100 } = {}) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw error("IOT_EDGE_UPLOADER_CONFIG_INVALID");
    if (this.running) return { status: "BUSY" };
    this.running = true;
    const totals = { attempted: 0, accepted: 0, deferred: 0, invalid: 0 };
    try {
      let entries;
      try { entries = await fs.opendir(path.join(this.stateDirectory, "commands")); }
      catch (failure) { if (failure.code === "ENOENT") return totals; throw failure; }
      for await (const entry of entries) {
        if (totals.attempted >= limit) break;
        if (!entry.isDirectory() || !/^[a-f0-9]{64}$/.test(entry.name)) continue;
        const directory = path.join(this.stateDirectory, "commands", entry.name);
        try {
          const intent = await readJson(path.join(directory, "intent.json"));
          if (!intent.command || intent.contentHash !== hash(intent.command) ||
            createHash("sha256").update(intent.command.commandId).digest("hex") !== entry.name ||
            intent.command.gatewayId !== this.gatewayId) throw error("IOT_EDGE_SPOOL_INVALID");
          const ack = await readJson(path.join(directory, "ack.json"), true);
          if (!ack) continue; // Intent persisted before ACK, or rejected without execution.
          validateEvent(ack, intent.command, entry.name, this.gatewayId, "ACKNOWLEDGED");
          if (!(await this.deliver(directory, "ack", ack, totals))) continue;
          if (totals.attempted >= limit) continue;
          const result = await readJson(path.join(directory, "result.json"), true);
          // Missing result can still deliver the durable ACK without repeating the actuator.
          if (!result || result.status !== "EXECUTED") continue;
          if (!Array.isArray(result.events) || result.events.length !== 2 || hash(result.events[0]) !== hash(ack))
            throw error("IOT_EDGE_SPOOL_INVALID");
          validateEvent(result.events[1], intent.command, entry.name, this.gatewayId, "EXECUTED");
          await this.deliver(directory, "result", result.events[1], totals);
        } catch { totals.invalid++; }
      }
      return totals;
    } finally { this.running = false; }
  }

  async deliver(directory, stage, event, totals) {
    const file = path.join(directory, `delivery-${stage}.json`);
    const receipt = await readJson(file, true);
    const contentHash = hash(event);
    if (receipt && receipt.contentHash !== contentHash) throw error("IOT_EDGE_SPOOL_CONFLICT");
    if (receipt?.accepted === true) return true;
    if (receipt?.nextAttemptAt && new Date(receipt.nextAttemptAt) > this.now()) { totals.deferred++; return false; }
    totals.attempted++;
    let accepted = false;
    try {
      const response = await this.transport.publishEvent(JSON.parse(JSON.stringify(event)));
      accepted = response?.accepted === true && response.messageId === event.messageId;
    } catch { /* Uncertain delivery retries the identical event, never the actuator. */ }
    const attempts = (Number.isSafeInteger(receipt?.attempts) ? receipt.attempts : 0) + 1;
    await replaceDurable(file, { contentHash, attempts, accepted,
      acceptedAt: accepted ? this.now().toISOString() : null,
      nextAttemptAt: accepted ? null : new Date(this.now().getTime() + Math.min(60000, 1000 * 2 ** Math.min(attempts, 6))).toISOString() });
    if (accepted) totals.accepted++;
    return accepted;
  }
}
module.exports = { GatewayEventUploader };
