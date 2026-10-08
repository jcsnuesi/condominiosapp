"use strict";

function validateProfilePayload(profile, kind, payload) {
  const fail = () => { throw Object.assign(new Error("Payload does not match device profile"), { code: "IOT_PROFILE_PAYLOAD_INVALID", statusCode: 422 }); };
  if (!["state", "command"].includes(kind) || !profile ||
      !payload || Object.getPrototypeOf(payload) !== Object.prototype ||
      (kind === "command" && Object.keys(payload).length === 0)) fail();
  const fields = profile[kind === "state" ? "stateFields" : "commandFields"];
  if (!Array.isArray(fields)) fail();
  for (const [key, value] of Object.entries(payload)) {
    const field = fields.find((item) => item.name === key);
    if (!field || typeof value !== field.type ||
        (field.type === "number" && (!Number.isFinite(value) ||
          (field.min != null && value < field.min) || (field.max != null && value > field.max))) ||
        (field.type === "string" && (value.length > 128 ||
          (field.values?.length && !field.values.includes(value))))) fail();
  }
  return { ...payload };
}

module.exports = { validateProfilePayload };
