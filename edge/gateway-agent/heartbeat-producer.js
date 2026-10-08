"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { replaceDurable, syncDirectory } = require("./durable-storage");
const fail = (code) => Object.assign(new Error(code), { code });
const hash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const token = /^[A-Za-z0-9_-]{1,128}$/;
const payloadFields = ["eventType", "agentVersion", "configurationVersion", "uptimeSeconds", "spoolCommandCount", "spoolAccountedBytes", "spoolCapacityBytes", "storageBlocked"];
function time(value) {
  const date = new Date(value);
  if (typeof value !== "string" || !Number.isFinite(date.getTime()) || date.toISOString() !== value) throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
  return date.getTime();
}
function payloadValid(value) {
  return value && Object.getPrototypeOf(value) === Object.prototype && Object.keys(value).length === payloadFields.length &&
    Object.keys(value).every((field) => payloadFields.includes(field)) && value.eventType === "gateway.heartbeat" &&
    typeof value.agentVersion === "string" && /^[A-Za-z0-9][A-Za-z0-9._+-]{0,79}$/.test(value.agentVersion) && typeof value.storageBlocked === "boolean" &&
    ["configurationVersion", "uptimeSeconds", "spoolCommandCount", "spoolAccountedBytes", "spoolCapacityBytes"].every((field) =>
      Number.isSafeInteger(value[field]) && value[field] >= (["configurationVersion", "spoolCapacityBytes"].includes(field) ? 1 : 0));
}
class GatewayHeartbeatProducer {
  constructor({ gatewayId, stateDirectory, agentVersion, sample, transport, intervalMs = 60000,
    now = () => new Date(), uptime = () => process.uptime() }) {
    if (typeof gatewayId !== "string" || !token.test(gatewayId) || !path.isAbsolute(stateDirectory || "") ||
      typeof agentVersion !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._+-]{0,79}$/.test(agentVersion) || typeof sample !== "function" ||
      typeof transport?.publishHeartbeat !== "function" || !Number.isInteger(intervalMs) || intervalMs < 30000 || intervalMs > 120000 ||
      typeof now !== "function" || typeof uptime !== "function") throw fail("IOT_EDGE_HEARTBEAT_CONFIG_INVALID");
    Object.assign(this, { gatewayId, stateDirectory, agentVersion, sample, transport, intervalMs, now, uptime });
    this.file = path.join(stateDirectory, "heartbeat-state.json"); this.running = false; this.timer = null;
  }
  async readState() {
    let state;
    try {
      const info = await fs.lstat(this.file);
      if (!info.isFile() || info.isSymbolicLink() || info.size > 16384) throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
      const bytes = await fs.readFile(this.file, "utf8");
      if (Buffer.byteLength(bytes) > 16384) throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
      state = JSON.parse(bytes);
    } catch (error) {
      if (error.code === "ENOENT") return { schemaVersion: 1, gatewayId: this.gatewayId, sequence: 0, pending: null, lastSampleAt: null, lastDelivery: null };
      throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
    }
    if (state?.schemaVersion !== 1 || state.gatewayId !== this.gatewayId || !Number.isSafeInteger(state.sequence) || state.sequence < 0 ||
        Object.keys(state).some((field) => !["schemaVersion", "gatewayId", "sequence", "pending", "lastSampleAt", "lastDelivery"].includes(field)))
      throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
    if (state.lastSampleAt !== null) time(state.lastSampleAt);
    if (state.pending !== null) {
      const pending = state.pending, event = pending?.event;
      if (!event || event.schemaVersion !== 1 || event.gatewayId !== this.gatewayId || event.resourceId !== this.gatewayId ||
          event.sequence !== state.sequence || event.sequence < 1 || event.profileVersion !== 1 || !token.test(event.messageId || "") ||
          event.occurredAt !== state.lastSampleAt || pending.contentHash !== hash(event) || !Number.isSafeInteger(pending.attempts) || pending.attempts < 0 ||
          !payloadValid(event.payload) || Object.keys(event).some((field) => !["schemaVersion", "messageId", "gatewayId", "resourceId", "sequence", "profileVersion", "occurredAt", "payload"].includes(field)))
        throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
      time(pending.nextAttemptAt);
    }
    if (state.lastDelivery !== null) {
      const delivery = state.lastDelivery;
      if (!delivery || !token.test(delivery.messageId || "") || !["ACCEPTED", "REJECTED_STALE"].includes(delivery.status) ||
          !Number.isSafeInteger(delivery.sequence) || delivery.sequence < 1 || delivery.sequence > state.sequence ||
          !/^[a-f0-9]{64}$/.test(delivery.contentHash || "")) throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
      time(delivery.at);
    }
    if ((state.sequence > 0 && !state.lastSampleAt) || (state.sequence > 0 && state.pending === null && state.lastDelivery?.sequence !== state.sequence))
      throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
    return state;
  }
  async tick() {
    if (this.running) return { status: "BUSY" };
    this.running = true; let lock;
    const lockFile = path.join(this.stateDirectory, "heartbeat.lock");
    try {
      const root = await fs.lstat(this.stateDirectory);
      if (!root.isDirectory() || root.isSymbolicLink()) throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
      try { lock = await fs.open(lockFile, "wx", 0o600); }
      catch (error) { if (error.code === "EEXIST") return { status: "BUSY" }; throw error; }
      await lock.writeFile(JSON.stringify({ pid: process.pid, gatewayId: this.gatewayId })); await lock.sync(); await syncDirectory(this.stateDirectory);
      const state = await this.readState(), now = this.now();
      if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw fail("IOT_EDGE_HEARTBEAT_CLOCK_INVALID");
      if (!state.pending) {
        if (state.lastSampleAt && now.getTime() < time(state.lastSampleAt)) return { status: "CLOCK_SKEW" };
        if (state.lastSampleAt && now.getTime() - time(state.lastSampleAt) < this.intervalMs) return { status: "NOT_DUE" };
        if (state.sequence === Number.MAX_SAFE_INTEGER) throw fail("IOT_EDGE_HEARTBEAT_SEQUENCE_EXHAUSTED");
        const sample = await this.sample(), uptimeSeconds = Math.floor(this.uptime());
        const payload = { ...sample, eventType: "gateway.heartbeat", agentVersion: this.agentVersion, uptimeSeconds };
        if (!payloadValid(payload)) throw fail("IOT_EDGE_HEARTBEAT_SAMPLE_INVALID");
        const sequence = state.sequence + 1;
        const event = { schemaVersion: 1, gatewayId: this.gatewayId, resourceId: this.gatewayId, profileVersion: 1,
          sequence, occurredAt: now.toISOString(), payload };
        event.messageId = `heartbeat-${hash(event)}`;
        state.sequence = sequence; state.lastSampleAt = event.occurredAt;
        state.pending = { event, contentHash: hash(event), attempts: 0, nextAttemptAt: event.occurredAt };
        await replaceDurable(this.file, state); // Sequence and immutable pending report commit together before publication.
      }
      const pending = state.pending;
      if (time(pending.nextAttemptAt) > now.getTime()) return { status: "DEFERRED", messageId: pending.event.messageId };
      let response;
      try { response = await this.transport.publishHeartbeat(JSON.parse(JSON.stringify(pending.event))); }
      catch { /* Uncertain receipt leaves the exact report pending, including across restart. */ }
      const completedAt = this.now();
      if (!(completedAt instanceof Date) || !Number.isFinite(completedAt.getTime())) throw fail("IOT_EDGE_HEARTBEAT_CLOCK_INVALID");
      const matches = response?.messageId === pending.event.messageId;
      const accepted = matches && response?.accepted === true;
      // Only an authenticated application rejection can retire a stale health sample. Never rewrite its timestamp.
      const rejected = matches && response?.accepted !== true && response?.rejected === true && response.code === "IOT_EVENT_STALE" &&
        completedAt.getTime() - time(pending.event.occurredAt) > 300000;
      if (accepted || rejected) {
        state.lastDelivery = { messageId: pending.event.messageId, sequence: pending.event.sequence, contentHash: pending.contentHash,
          status: accepted ? "ACCEPTED" : "REJECTED_STALE", at: completedAt.toISOString() };
        state.pending = null;
      } else {
        if (pending.attempts === Number.MAX_SAFE_INTEGER) throw fail("IOT_EDGE_HEARTBEAT_STATE_INVALID");
        pending.attempts++;
        pending.nextAttemptAt = new Date(completedAt.getTime() + Math.min(60000, 1000 * 2 ** Math.min(pending.attempts, 6))).toISOString();
      }
      await replaceDurable(this.file, state);
      return { status: accepted ? "ACCEPTED" : rejected ? "REJECTED_STALE" : "PENDING", messageId: pending.event.messageId, sequence: pending.event.sequence };
    } finally {
      try { if (lock) { await lock.close(); await fs.unlink(lockFile); await syncDirectory(this.stateDirectory); } }
      finally { this.running = false; }
    }
  }
  start({ schedule = setInterval, cancel = clearInterval, onError = () => {} } = {}) {
    if (this.timer !== null) throw fail("IOT_EDGE_HEARTBEAT_ALREADY_STARTED");
    const run = () => { void this.tick().catch((error) => { try { onError(error); } catch { /* An observer cannot break durable retries. */ } }); };
    this.cancelTimer = cancel; this.timer = schedule(run, 5000); this.timer?.unref?.(); run();
    return this;
  }
  stop() { if (this.timer !== null) this.cancelTimer(this.timer); this.timer = null; }
}
module.exports = { GatewayHeartbeatProducer };
