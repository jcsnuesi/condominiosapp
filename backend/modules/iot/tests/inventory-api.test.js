"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const { createInventoryRouter } = require("../api");
const responseContract = require("../../../middleware/responseContract");

async function server(t, service, permissions = ["iot.read", "iot.create", "iot.update", "iot.history"], enabled = () => true, commandService) {
  const app = express();
  app.use(express.json(), responseContract);
  app.use("/api", createInventoryRouter({ service, commandService, enabled, authenticate: (req, _res, next) => {
    req.auth = { role: "OWNER", permissions, account: { _id: "owner" }, scope: { mode: "PERSONAL" } }; next();
  } }));
  const listener = await new Promise((resolve) => { const listener = app.listen(0, "127.0.0.1", () => resolve(listener)); });
  t.after(() => new Promise((resolve) => { listener.close(resolve); listener.closeAllConnections(); }));
  return `http://127.0.0.1:${listener.address().port}/api`;
}

test("HTTP gateway listing accepts Express query objects and emits only public inventory fields", async (t) => {
  let received;
  const url = await server(t, { listGateways: async (_actor, scope, page) => {
    received = { scope, page };
    return { items: [{ _id: "gateway", displayName: "Pilot", status: "PROVISIONING", awsThingName: "internal-thing", certificate: "secret", ownerId: "internal-owner" }], nextCursor: null };
  } });
  const res = await fetch(`${url}/iot/gateways?scopeType=PERSONAL_RESIDENCE&residenceId=012345678901234567890123&limit=5`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.gateways[0].id, "gateway");
  assert.equal(received.scope.residenceId, "012345678901234567890123");
  assert.equal(received.page.limit, "5");
  for (const privateField of ["awsThingName", "certificate", "ownerId"]) assert.ok(!(privateField in body.data.gateways[0]));
  const forged = await fetch(`${url}/iot/gateways?scopeType=COMMON_AREA&organizationId=forged`);
  assert.equal(forged.status, 422);
});

test("HTTP inventory switch defaults to disabled and does not invoke the service", async (t) => {
  const url = await server(t, { getGateway: async () => { throw new Error("must not run"); } }, ["iot.read"], () => false);
  const response = await fetch(`${url}/iot/gateways/012345678901234567890123`);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "IOT_INVENTORY_DISABLED");
});

test("HTTP registration returns provisioning inventory and delegates the full input to validation", async (t) => {
  const input = { scope: { scopeType: "COMMON_AREA", condominiumId: "012345678901234567890123" }, displayName: "Pilot", idempotencyKey: "register-1" };
  const url = await server(t, { createGateway: async (_actor, body) => {
    assert.deepEqual(body, input);
    return { _id: "gateway", displayName: body.displayName, status: "PROVISIONING", awsThingName: "internal" };
  } });
  const res = await fetch(`${url}/iot/gateways`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.data.gateway.status, "PROVISIONING");
  assert.equal(body.error, null);
});

test("HTTP permission failures prevent service execution and internal errors stay generic", async (t) => {
  const url = await server(t, { getCommand: async () => { throw new Error("private database URI"); } }, ["iot.read"]);
  const denied = await fetch(`${url}/iot/commands/cmd-1`);
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).code, "AUTH_PERMISSION_DENIED");
  const allowedUrl = await server(t, { getCommand: async () => { throw new Error("private database URI"); } });
  const failed = await fetch(`${allowedUrl}/iot/commands/cmd-1`);
  assert.equal(failed.status, 500);
  const body = await failed.json();
  assert.equal(body.error.message, "IoT operation could not be completed");
  assert.equal(JSON.stringify(body).includes("database URI"), false);
});

test("HTTP ACK result remains unconfirmed and excludes command payload/evidence", async (t) => {
  const url = await server(t, { getCommand: async () => ({ commandId: "cmd-1", deviceId: "device", status: "ACKNOWLEDGED", evidenceRef: null, payload: { open: true }, actorId: "internal" }) });
  const body = await (await fetch(`${url}/iot/commands/cmd-1`)).json();
  assert.equal(body.data.command.confirmed, false);
  assert.equal(body.data.command.id, "cmd-1");
  assert.equal("payload" in body.data.command, false);
  assert.equal("actorId" in body.data.command, false);
});

test("HTTP queued command acceptance returns 202 and does not report execution", async (t) => {
  const input = { deviceId: "012345678901234567890123", payload: { power: "ON" }, idempotencyKey: "request-1" };
  const url = await server(t, {}, ["iot.control"], () => true, { requestCommand: async (_actor, body) => {
    assert.deepEqual(body, input);
    return { commandId: "cmd-request", deviceId: input.deviceId, status: "REQUESTED" };
  } });
  const response = await fetch(`${url}/iot/commands`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  assert.equal(response.status, 202);
  const body = await response.json();
  assert.equal(body.code, "ACCEPTED");
  assert.equal(body.data.command.confirmed, false);
});
