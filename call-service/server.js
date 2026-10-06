"use strict";
const { createServer } = require("node:http");
const { createHmac } = require("node:crypto");
const { Server } = require("socket.io");
const { CallEngine } = require("./engine");
const list = (value) => (value || "").split(",").map((entry) => entry.trim()).filter(Boolean);
function createCallService(options = {}) {
  const internalToken = options.internalToken || process.env.CALL_INTERNAL_TOKEN;
  const turnSecret = options.turnSecret || process.env.TURN_AUTH_SECRET;
  if ((internalToken || "").length < 32 || (turnSecret || "").length < 32) throw new Error("CALL_INTERNAL_TOKEN and TURN_AUTH_SECRET must have at least 32 characters");
  const origins = options.origins || list(process.env.FRONTEND_ORIGINS);
  const turnUrls = options.turnUrls || list(process.env.TURN_URLS);
  if (!options.backend && (!origins.length || !turnUrls.length)) throw new Error("FRONTEND_ORIGINS and TURN_URLS are required");
  let ready = false;
  const backend = options.backend || (async (path, body) => {
    const response = await fetch(`${process.env.CALL_BACKEND_URL || "http://backend:3993"}/api/calls/internal/${path}`, {
      method: "POST", headers: { "Content-Type": "application/json", "X-Call-Internal-Token": internalToken },
      body: JSON.stringify(body), signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw Object.assign(new Error("Backend validation failed"), { code: response.status === 403 ? "unauthorized" : "service_unavailable" });
    return response.status === 204 ? null : response.json();
  });
  const http = createServer((req, res) => {
    if (req.url !== "/health" && options.requestListener) return options.requestListener(req, res);
    res.writeHead(req.url === "/health" && ready ? 200 : 503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ready }));
  });
  const io = new Server(http, {
    path: "/calls/socket.io/", maxHttpBufferSize: 100000, cors: { origin: origins },
    allowRequest: (req, callback) => callback(null, !req.headers.origin || origins.includes(req.headers.origin)),
  });
  const engine = new CallEngine({ authorize: (body) => backend("authorize", body), history: async (body) => {
    let error;
    for (let attempt = 0; attempt < 3; attempt++) {
      try { await backend("history", body); return; } catch (caught) { error = caught; }
    }
    throw error;
  } });
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (typeof token !== "string" || token.length > 4096) throw new Error("Invalid token");
      socket.data.identity = await backend("validate", { token });
      socket.data.token = token;
      next();
    } catch { next(new Error("unauthorized")); }
  });
  io.on("connection", (socket) => {
    engine.add(socket, socket.data.identity, socket.data.token);
    let lastStart = 0;
    let checking = false;
    const handler = (event, action) => socket.on(event, async (body, ack) => {
      try { const result = await action(body || {}); if (typeof ack === "function") ack({ ok: true, ...result }); }
      catch (error) { if (typeof ack === "function") ack({ ok: false, code: error.code || "service_unavailable" }); }
    });
    handler("calls:refresh", async ({ token }) => {
      if (typeof token !== "string" || token.length > 4096) throw new Error("Invalid token");
      const identity = await backend("validate", { token });
      engine.refresh(socket.id, identity, token);
    });
    handler("calls:availability", ({ available }) => engine.availability(socket.id, available));
    handler("calls:start", ({ condominiumId }) => {
      if (Date.now() - lastStart < 2000) throw Object.assign(new Error("Rate limit"), { code: "rate_limited" });
      lastStart = Date.now();
      return engine.start(socket.id, condominiumId);
    });
    handler("calls:accept", ({ callId }) => engine.accept(socket.id, callId));
    handler("calls:end", ({ callId, reason }) => engine.end(socket.id, callId, reason));
    handler("calls:signal", (body) => engine.signal(socket.id, body));
    handler("calls:connected", ({ callId }) => engine.connected(socket.id, callId));
    handler("calls:ice", ({ callId }) => {
      const call = engine.participant(socket.id, callId);
      if (!["connecting", "active"].includes(call.state)) throw Object.assign(new Error("Invalid state"), { code: "invalid_state" });
      const username = `${Math.floor(Date.now() / 1000) + 3600}:${engine.get(socket.id).userId}`;
      return { iceServers: [{ urls: turnUrls, username, credential: createHmac("sha1", turnSecret).update(username).digest("base64") }] };
    });
    const timer = setInterval(async () => {
      if (checking) return;
      checking = true;
      try {
        const session = engine.get(socket.id);
        const identity = await backend("validate", { token: session.token });
        engine.refresh(socket.id, identity, session.token);
      } catch { socket.disconnect(true); }
      finally { checking = false; }
    }, 15000);
    timer.unref();
    socket.on("disconnect", () => { clearInterval(timer); engine.remove(socket.id); });
  });
  return {
    http, io, engine,
    async listen(port = 4000, host) {
      await backend("recover", {});
      await new Promise((resolve, reject) => { http.once('error', reject); http.listen(port, host, resolve); });
      ready = true;
    },
    async close() {
      ready = false;
      const calls = [...engine.calls.values()];
      calls.forEach((call) => engine.finish(call, "service_restart"));
      await Promise.race([Promise.all(calls.map((call) => call.historyChain)), new Promise((resolve) => { const timer = setTimeout(resolve, 5000); timer.unref(); })]);
      await new Promise((resolve) => io.close(resolve));
    },
  };
}
module.exports = { createCallService };
