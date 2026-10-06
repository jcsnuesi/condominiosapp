"use strict";
const { randomUUID } = require("node:crypto");
const fail = (code) => Object.assign(new Error(code), { code });
class CallEngine {
  constructor({ authorize, history = async () => {}, ringMs = 30000, connectMs = 20000 }) {
    this.authorize = authorize;
    this.history = history;
    this.ringMs = ringMs;
    this.connectMs = connectMs;
    this.sessions = new Map();
    this.calls = new Map();
    this.busy = new Map();
  }
  add(socket, identity, token) {
    this.sessions.set(socket.id, { socket, ...identity, token, available: false });
    this.broadcast();
  }
  get(id) {
    const session = this.sessions.get(id);
    if (!session) throw fail("unauthorized");
    return session;
  }
  availableStaff(staffId) {
    return [...this.sessions.values()].filter((session) => session.userId === staffId && session.role === "STAFF" && session.available);
  }
  broadcast() {
    for (const session of this.sessions.values()) {
      session.socket.emit("calls:destinations", session.destinations.map((target) => ({ ...target, status: this.busy.has(target.staffId) ? "busy" : this.availableStaff(target.staffId).length ? "available" : "offline" })));
    }
  }
  availability(id, available) {
    const session = this.get(id);
    if (session.role !== "STAFF" || typeof available !== "boolean") throw fail("unauthorized");
    session.available = available && session.destinations.length > 0;
    this.broadcast();
    if (!session.available) {
      for (const call of [...this.calls.values()]) {
        if (call.staffId === session.userId && call.state === "ringing" && !this.availableStaff(call.staffId).length) this.finish(call, "disconnected");
      }
    }
  }
  refresh(id, identity, token) {
    const session = this.get(id);
    if (identity.userId !== session.userId || identity.role !== session.role) throw fail("unauthorized");
    session.destinations = identity.destinations;
    session.authorizedCondominiumIds = identity.authorizedCondominiumIds;
    session.token = token;
    if (!identity.destinations.length) session.available = false;
    this.broadcast();
    for (const call of [...this.calls.values()]) {
      if ([call.residentId, call.staffId].includes(session.userId) && Array.isArray(identity.authorizedCondominiumIds) && !identity.authorizedCondominiumIds.includes(call.condominiumId)) {
        this.finish(call, "cancelled");
        continue;
      }
      if (call.state !== "ringing") continue;
      const resident = this.sessions.get(call.residentSocketId);
      const validResident = resident?.destinations.some((target) => target.condominiumId === call.condominiumId && target.staffId === call.staffId);
      const validStaff = this.availableStaff(call.staffId).some((staff) => staff.destinations.some((target) => target.condominiumId === call.condominiumId));
      if (!validResident || !validStaff) this.finish(call, "cancelled");
    }
  }
  async start(id, condominiumId) {
    const resident = this.get(id);
    if (!["OWNER", "FAMILY"].includes(resident.role) || !resident.destinations.some((target) => target.condominiumId === condominiumId)) throw fail("unauthorized");
    if (this.busy.has(resident.userId)) throw fail("busy");
    const reservation = Symbol();
    this.busy.set(resident.userId, reservation);
    try {
      const details = await this.authorize({ condominiumId, residentToken: resident.token });
      if (!this.sessions.has(id) || this.busy.get(resident.userId) !== reservation) throw fail("disconnected");
      if (details.residentId !== resident.userId) throw fail("unauthorized");
      if (this.busy.has(details.staffId)) throw fail("busy");
      const staffSessions = this.availableStaff(details.staffId).filter((session) => session.destinations.some((target) => target.condominiumId === condominiumId));
      if (!staffSessions.length) throw fail("offline");
      const call = { ...details, callId: randomUUID(), residentSocketId: id, staffSocketId: null, startedAt: new Date().toISOString(), state: "ringing", connected: new Set(), signalCount: 0, historyChain: Promise.resolve() };
      this.calls.set(call.callId, call);
      this.busy.set(resident.userId, call.callId);
      this.busy.set(call.staffId, call.callId);
      call.timer = setTimeout(() => this.finish(call, "missed"), this.ringMs);
      call.timer.unref?.();
      this.record(call, "ringing");
      resident.socket.emit("calls:created", this.publicCall(call));
      staffSessions.forEach((session) => session.socket.emit("calls:incoming", this.publicCall(call)));
      this.broadcast();
      return { callId: call.callId };
    } catch (error) {
      if (this.busy.get(resident.userId) === reservation) this.busy.delete(resident.userId);
      throw error;
    }
  }
  publicCall(call) {
    return { callId: call.callId, alias: call.alias, name: call.name, residentRole: call.residentRole, units: call.units, state: call.state };
  }
  async accept(id, callId) {
    const staff = this.get(id);
    const call = this.calls.get(callId);
    if (!call || staff.role !== "STAFF" || staff.userId !== call.staffId || !staff.available) throw fail("unauthorized");
    if (call.state !== "ringing") throw fail("already_answered");
    // Reserve before awaiting backend authorization: only one tab can accept.
    call.state = "accepting";
    call.staffSocketId = id;
    try {
      const resident = this.get(call.residentSocketId);
      const authorized = await this.authorize({ condominiumId: call.condominiumId, residentToken: resident.token, staffToken: staff.token });
      if (!this.calls.has(callId) || !this.sessions.has(id)) throw fail("disconnected");
      if (authorized.staffId !== call.staffId || authorized.residentId !== call.residentId) throw fail("unauthorized");
      clearTimeout(call.timer);
      call.state = "connecting";
      call.acceptedAt = new Date().toISOString();
      call.timer = setTimeout(() => this.finish(call, "failed"), this.connectMs);
      call.timer.unref?.();
      for (const session of this.sessions.values()) {
        if (session.userId === call.staffId && session.socket.id !== id) session.socket.emit("calls:answered_elsewhere", { callId });
      }
      staff.socket.emit("calls:accepted", { ...this.publicCall(call), initiator: false });
      resident.socket.emit("calls:accepted", { ...this.publicCall(call), initiator: true });
      this.record(call, "connecting");
      return { callId };
    } catch (error) { this.finish(call, "failed"); throw error; }
  }
  participant(id, callId) {
    const call = this.calls.get(callId);
    if (!call || ![call.residentSocketId, call.staffSocketId].includes(id)) throw fail("unauthorized");
    return call;
  }
  signal(id, payload) {
    const call = this.participant(id, payload?.callId);
    if (!["connecting", "active"].includes(call.state) || ++call.signalCount > 1000) throw fail("invalid_signal");
    const { description, candidate } = payload;
    if (Boolean(description) === Boolean(candidate)) throw fail("invalid_signal");
    if (description && (!['offer', 'answer'].includes(description.type) || typeof description.sdp !== "string" || description.sdp.length > 65536 || (description.type === "offer" ? id !== call.residentSocketId : id !== call.staffSocketId))) throw fail("invalid_signal");
    if (candidate && (typeof candidate.candidate !== "string" || candidate.candidate.length > 4096)) throw fail("invalid_signal");
    const peerId = id === call.residentSocketId ? call.staffSocketId : call.residentSocketId;
    this.get(peerId).socket.emit("calls:signal", { callId: call.callId, description, candidate });
  }
  connected(id, callId) {
    const call = this.participant(id, callId);
    if (!["connecting", "active"].includes(call.state)) throw fail("invalid_state");
    call.connected.add(id);
    if (call.connected.size === 2 && call.state !== "active") {
      clearTimeout(call.timer);
      call.state = "active";
      call.connectedAt = new Date().toISOString();
      this.get(call.residentSocketId).socket.emit("calls:active", { callId });
      this.get(call.staffSocketId).socket.emit("calls:active", { callId });
      this.record(call, "active");
    }
  }
  end(id, callId, reason) {
    const session = this.get(id);
    const call = this.calls.get(callId);
    if (call?.state === "ringing" && session.role === "STAFF" && session.userId === call.staffId && session.available) return this.finish(call, "rejected");
    this.participant(id, callId);
    this.finish(call, reason === "failed" ? "failed" : call.state === "ringing" ? "cancelled" : "ended");
  }
  finish(call, result) {
    if (!this.calls.has(call.callId)) return;
    clearTimeout(call.timer);
    this.calls.delete(call.callId);
    this.busy.delete(call.residentId);
    this.busy.delete(call.staffId);
    call.endedAt = new Date().toISOString();
    for (const session of this.sessions.values()) {
      if (session.socket.id === call.residentSocketId || session.userId === call.staffId) session.socket.emit("calls:ended", { callId: call.callId, result });
    }
    this.record(call, result);
    this.broadcast();
  }
  record(call, result) {
    const { callId, organizationId, condominiumId, residentId, residentRole, staffId, startedAt, acceptedAt, connectedAt, endedAt } = call;
    const data = { callId, organizationId, condominiumId, residentId, residentRole, staffId, startedAt, acceptedAt, connectedAt, endedAt, result };
    call.historyChain = call.historyChain.then(() => this.history(data)).catch((error) => console.error(JSON.stringify({ event: "call_history_failed", callId, result, code: error.code || "backend_unavailable" })));
    console.log(JSON.stringify({ event: "call_state", callId, result }));
  }
  remove(id) {
    const session = this.sessions.get(id);
    this.sessions.delete(id);
    if (!session) return;
    for (const call of [...this.calls.values()]) {
      if (call.residentSocketId === id || call.staffSocketId === id || (call.staffId === session.userId && call.state === "ringing" && !this.availableStaff(call.staffId).length)) this.finish(call, "disconnected");
    }
    // A disconnected caller may still have a pending authorization request.
    if (typeof this.busy.get(session.userId) === "symbol") this.busy.delete(session.userId);
    this.broadcast();
  }
}
module.exports = { CallEngine };
