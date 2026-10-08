"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");
const TOKEN = /^[A-Za-z0-9_-]{1,128}$/;
const { syncDirectory, writeDurable } = require("./durable-storage");
const { GatewaySpoolCapacity } = require("./spool-capacity");

function invalid(code = "IOT_EDGE_COMMAND_INVALID") {
  return Object.assign(new Error("Invalid, expired or unauthorized gateway command"), { code });
}

class GatewayCommandHandler {
  constructor({ gatewayId, stateDirectory, resources, execute, now = () => new Date(), storage = {} }) {
    if (typeof gatewayId !== "string" || !TOKEN.test(gatewayId) || !path.isAbsolute(stateDirectory || "") || typeof execute !== "function") throw invalid();
    Object.assign(this, { gatewayId, resources, execute, now });
    this.stateDirectory = stateDirectory;
    this.directory = path.join(stateDirectory, "commands");
    this.capacity = new GatewaySpoolCapacity({ ...storage, stateDirectory });
  }

  async handle(input) {
    const fields = ["schemaVersion", "commandId", "resourceId", "gatewayId", "profileVersion", "expiresAt", "payload"];
    if (!input || Object.getPrototypeOf(input) !== Object.prototype || Object.keys(input).some((key) => !fields.includes(key)) ||
        input.schemaVersion !== 1 || typeof input.commandId !== "string" || !TOKEN.test(input.commandId) ||
        typeof input.resourceId !== "string" || !TOKEN.test(input.resourceId) ||
        input.gatewayId !== this.gatewayId || !Number.isSafeInteger(input.profileVersion) || input.profileVersion < 1 ||
        !input.payload || Object.getPrototypeOf(input.payload) !== Object.prototype) throw invalid();
    const resource = Object.hasOwn(this.resources, input.resourceId) ? this.resources[input.resourceId] : null;
    if (!resource || resource.enabled === false || resource.profileVersion !== input.profileVersion ||
        !["LIGHT", "AIR_CONDITIONER", "WATER_PUMP"].includes(resource.deviceType)) throw invalid();
    const entries = Object.entries(input.payload);
    if (entries.length !== 1 || entries.some(([key, value]) =>
      (key === "power" ? !["ON", "OFF"].includes(value) : key === "temperature" ?
        resource.deviceType !== "AIR_CONDITIONER" || typeof value !== "number" || !Number.isFinite(value) || value < 16 || value > 30 : true))) throw invalid();
    const expiresAt = new Date(input.expiresAt);
    if (typeof input.expiresAt !== "string" || !Number.isFinite(expiresAt.getTime()) || expiresAt.toISOString() !== input.expiresAt) throw invalid();
    const canonical = { schemaVersion: 1, commandId: input.commandId, resourceId: input.resourceId,
      gatewayId: input.gatewayId, profileVersion: input.profileVersion, expiresAt: input.expiresAt, payload: { ...input.payload } };
    const contentHash = createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
    const key = createHash("sha256").update(input.commandId).digest("hex");
    if (!(await fs.stat(this.stateDirectory)).isDirectory()) throw invalid();
    const directory = path.join(this.directory, key);
    const claimed = await this.capacity.claim(key);
    if (!claimed) {
      let intent;
      try { intent = JSON.parse(await fs.readFile(path.join(directory, "intent.json"), "utf8")); }
      catch { return { status: "REQUIRES_RECONCILIATION", duplicate: true, events: [] }; }
      if (intent.contentHash !== contentHash) throw invalid("IOT_EDGE_MESSAGE_CONFLICT");
      try { return { ...JSON.parse(await fs.readFile(path.join(directory, "result.json"), "utf8")), duplicate: true }; }
      catch {
        let events = [];
        try { events = [JSON.parse(await fs.readFile(path.join(directory, "ack.json"), "utf8"))]; } catch {}
        return { status: "REQUIRES_RECONCILIATION", duplicate: true, events };
      }
    }
    await syncDirectory(this.directory);
    await writeDurable(path.join(directory, "intent.json"), { contentHash, command: canonical });
    const remainingMs = expiresAt - this.now();
    if (remainingMs <= 0 || remainingMs > 60000) {
      const result = { status: "REJECTED_EXPIRED", duplicate: false, events: [] };
      await writeDurable(path.join(directory, "result.json"), result);
      return result;
    }
    const event = (status, sequence, occurredAt, extra = {}) => ({
      schemaVersion: 1, messageId: `${status === "ACKNOWLEDGED" ? "ack" : "result"}-${key}`,
      resourceId: input.resourceId, gatewayId: input.gatewayId, profileVersion: input.profileVersion,
      occurredAt, sequence, payload: { eventType: "command.ack", commandId: input.commandId, status, ...extra },
    });
    const ack = event("ACKNOWLEDGED", 0, this.now().toISOString());
    await writeDurable(path.join(directory, "ack.json"), ack);
    let result = { status: "ACKNOWLEDGED", confirmed: false, duplicate: false, events: [ack] };
    // Recheck after durable IO; the adapter must also enforce expiry/interlocks
    // immediately before its physical operation.
    if (expiresAt <= this.now()) {
      result.reason = "EXPIRED_BEFORE_EXECUTION";
    } else {
      try {
        const report = await this.execute(resource, canonical.payload, { commandId: input.commandId, expiresAt: input.expiresAt });
        const observedAt = new Date(report?.observedAt);
        if (resource.feedbackEnabled === true && report && typeof report.sourceEventId === "string" && TOKEN.test(report.sourceEventId) &&
            Number.isFinite(observedAt.getTime()) && observedAt >= new Date(ack.occurredAt) && observedAt <= this.now() && observedAt < expiresAt &&
            entries.every(([name, value]) => report.reported?.[name] === value)) {
          const feedback = { sourceEventId: report.sourceEventId, observedAt: observedAt.toISOString(),
            reported: Object.fromEntries(entries.map(([name]) => [name, report.reported[name]])) };
          result = { status: "EXECUTED", confirmed: true, duplicate: false, events: [ack, event("EXECUTED", 1, feedback.observedAt, { feedback })] };
        } else result.reason = "NO_VALID_PHYSICAL_FEEDBACK";
      } catch { result.reason = "EXECUTION_UNCONFIRMED"; }
    }
    await writeDurable(path.join(directory, "result.json"), result);
    return result;
  }
}

module.exports = { GatewayCommandHandler };
