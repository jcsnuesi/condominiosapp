"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { validateAck } = require("../application/commandFeedbackService");

test("receipt ACK and execution evidence have distinct validated contracts", () => {
  const ack = { eventType: "command.ack", commandId: "cmd-1", status: "ACKNOWLEDGED" };
  validateAck(ack);
  assert.throws(() => validateAck({ ...ack, evidenceRef: "forged" }));
  assert.throws(() => validateAck({ ...ack, feedback: { reported: { power: "ON" } } }));
  assert.throws(() => validateAck({ ...ack, commandId: ["cmd-1"] }));
  assert.throws(() => validateAck({ ...ack, status: "EXECUTED" }));
  validateAck({ ...ack, status: "EXECUTED", feedback: { sourceEventId: "physical-report-1", observedAt: new Date().toISOString(), reported: { power: "ON" } } });
});

test("failed feedback requires a bounded safe error code and cannot claim execution", () => {
  const failed = { eventType: "command.ack", commandId: "cmd-1", status: "FAILED", failureCode: "DEVICE_INTERLOCK" };
  validateAck(failed);
  assert.throws(() => validateAck({ ...failed, failureCode: "secret URI: postgres://..." }));
  assert.throws(() => validateAck({ ...failed, failureCode: ["DEVICE_INTERLOCK"] }));
  assert.throws(() => validateAck({ ...failed, feedback: { reported: { power: "ON" } } }));
});
