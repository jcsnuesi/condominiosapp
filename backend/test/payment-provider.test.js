"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const controller = require("../controllers/paymentProvider");
const Provider = require("../models/paymentProvider");
const organizationId = "507f1f77bcf86cd799439011";
const providerId = "507f1f77bcf86cd799439012";
const req = (body = {}, role = "ADMIN") => ({ user: { role }, auth: { organizationId }, body, params: { id: providerId } });
const response = () => ({ status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; return this; } });

test("provider list combines defaults with only the current organization custom providers", async (t) => {
  t.mock.method(Provider, "find", (query) => {
    assert.deepEqual(query, { organizationId });
    return { select() { return this; }, sort() { return this; }, lean: async () => [{ _id: providerId, name: "Nuevo", code: "NUEVO" }] };
  });
  const res = response();
  await controller.list(req({}, "OWNER"), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data.map((provider) => provider.code), ["AZUL", "CARDNET", "TOKE", "TRANSFERENCIA", "NUEVO"]);
  assert.equal(res.body.data[4].builtIn, false);
});

test("create normalizes names and ignores client supplied organization and code", async (t) => {
  t.mock.method(Provider, "create", async (data) => {
    assert.deepEqual(data, { organizationId, name: "Nuevo Banco", code: "NUEVO BANCO" });
    return { _id: providerId };
  });
  const res = response();
  await controller.create(req({ name: "  Nuevo   Banco ", organizationId: "other", code: "AZUL" }), res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.data._id, providerId);
});

test("invalid and reserved names cannot be created", async () => {
  for (const name of ["", "   ", "x".repeat(81), null, {}, "bad\u0000name"]) {
    const res = response();
    await controller.create(req({ name }), res);
    assert.equal(res.statusCode, 400);
  }
  const res = response();
  await controller.create(req({ name: " azul " }), res);
  assert.equal(res.statusCode, 409);
});

test("duplicate names return conflict and model enforces uniqueness per organization", async (t) => {
  assert.ok(Provider.schema.indexes().some(([keys, options]) => keys.organizationId === 1 && keys.code === 1 && options.unique));
  t.mock.method(Provider, "create", async () => { throw Object.assign(new Error("duplicate"), { code: 11000 }); });
  const res = response();
  await controller.create(req({ name: "Nuevo" }), res);
  assert.equal(res.statusCode, 409);
});

test("delete is scoped to organization and does not alter payment history", async (t) => {
  t.mock.method(Provider, "findOneAndDelete", async (query) => {
    assert.deepEqual(query, { _id: providerId, organizationId });
    return { _id: providerId };
  });
  const res = response();
  await controller.remove(req(), res);
  assert.equal(res.statusCode, 200);
});

test("deleting missing or foreign provider returns not found", async (t) => {
  t.mock.method(Provider, "findOneAndDelete", async () => null);
  const res = response();
  await controller.remove(req(), res);
  assert.equal(res.statusCode, 404);
});

test("owners cannot create or delete organization providers", async () => {
  for (const handler of [controller.create, controller.remove]) {
    const res = response();
    await handler(req({ name: "Nuevo" }, "OWNER"), res);
    assert.equal(res.statusCode, 403);
  }
});

test("deleting built-in codes or invalid IDs is rejected", async () => {
  for (const id of ["AZUL", "bad-id"]) {
    const res = response();
    await controller.remove({ ...req(), params: { id } }, res);
    assert.equal(res.statusCode, 400);
  }
});
