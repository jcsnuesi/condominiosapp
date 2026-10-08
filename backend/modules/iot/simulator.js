"use strict";
const { validateEnvelope } = require("./domain/envelope");
const { validateProfilePayload } = require("./domain/profilePayload");

// Offline deterministic contract simulator. No AWS/Mongo writes or pairing.
function simulate(now = new Date("2026-10-07T12:00:00.000Z")) {
  return ["AWS_SHADOW", "ZIGBEE"].map((protocol, index) => {
    const context = { scopeType: "COMMON_AREA", organizationId: "org-pilot", condominiumId: "condo-pilot" };
    const gateway = { ...context, _id: "gateway-pilot", status: "ACTIVE" };
    const device = { ...context, _id: `device-${index}`, gatewayId: gateway._id, status: "ACTIVE", profileVersion: 1, protocol };
    const profile = { stateFields: [{ name: "power", type: "boolean" }] };
    const envelope = validateEnvelope({ schemaVersion: 1, messageId: `message-${index}`, resourceId: device._id, gatewayId: gateway._id, sequence: 1, profileVersion: 1, occurredAt: now.toISOString(), payload: { power: index === 0 } }, { gateway, device, authenticatedGatewayId: gateway._id, now });
    validateProfilePayload(profile, "state", envelope.payload);
    return { protocol, envelope };
  });
}

if (require.main === module) process.stdout.write(`${JSON.stringify(simulate(), null, 2)}\n`);
module.exports = { simulate };
