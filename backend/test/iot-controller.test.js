"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { createIoTController } = require("../controllers/iot");

function responseCapture() {
  return {
    statusCode: null,
    body: null,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
}

test("personal device endpoint does not disclose another owner's residence", async () => {
  const foreignResidenceId = "foreign-residence";
  const actor = {
    role: "OWNER",
    permissions: ["iot.read"],
    account: { _id: "owner-a", emailVerified: true },
  };
  const service = {
    async listDevices(requestActor, scope) {
      assert.equal(requestActor, actor);
      assert.deepEqual(scope, {
        scopeType: "PERSONAL_RESIDENCE",
        residenceId: foreignResidenceId,
      });
      const error = new Error("Device context was not found");
      error.code = "IOT_NOT_FOUND";
      error.statusCode = 404;
      throw error;
    },
  };
  const controller = createIoTController({ service });
  const response = responseCapture();

  await controller.listPersonalDevices(
    { auth: actor, params: { residenceId: foreignResidenceId } },
    response
  );

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.body, {
    status: "error",
    code: "IOT_NOT_FOUND",
    message: "Device context was not found",
  });
  assert.equal("devices" in response.body, false);
});

test("Shadow state endpoint does not disclose another owner's device", async () => {
  const foreignDeviceId = "foreign-device";
  const actor = {
    role: "OWNER",
    permissions: ["iot.read"],
    account: { _id: "owner-a", emailVerified: true },
  };
  const service = {
    async getDeviceState(requestActor, deviceId) {
      assert.equal(requestActor, actor);
      assert.equal(deviceId, foreignDeviceId);
      const error = new Error("Device was not found");
      error.code = "IOT_NOT_FOUND";
      error.statusCode = 404;
      throw error;
    },
  };
  const controller = createIoTController({ service });
  const response = responseCapture();

  await controller.getDeviceState(
    { auth: actor, params: { deviceId: foreignDeviceId } },
    response
  );

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.body, {
    status: "error",
    code: "IOT_NOT_FOUND",
    message: "Device was not found",
  });
  assert.equal("state" in response.body, false);
});
