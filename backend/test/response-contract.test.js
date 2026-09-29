"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const responseContract = require("../middleware/responseContract");

test("normalizes legacy success payloads to standard contract", () => {
  const payload = {
    status: "success",
    data: { id: "1" },
  };

  const normalized = responseContract._normalizeLegacyBody(payload, 200);

  assert.deepEqual(normalized, {
    success: true,
    data: { id: "1" },
    error: null,
    code: "REQUEST_OK",
  });
});

test("normalizes legacy error payloads to standard contract", () => {
  const payload = {
    status: "error",
    message: "Invalid request",
  };

  const normalized = responseContract._normalizeLegacyBody(payload, 400);

  assert.deepEqual(normalized, {
    success: false,
    data: null,
    error: { message: "Invalid request" },
    code: "BAD_REQUEST",
  });
});

test("keeps already standardized payload unchanged", () => {
  const payload = {
    success: true,
    data: { ok: true },
    error: null,
    code: "READY",
  };

  const normalized = responseContract._normalizeLegacyBody(payload, 200);

  assert.deepEqual(normalized, payload);
});
