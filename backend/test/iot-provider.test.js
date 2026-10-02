"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { AWSIoTProvider } = require("../service/awsIoTProvider");
const {
  createIoTProvider,
  MockIoTProvider,
} = require("../service/iotProvider");
const {
  validateDeviceCommand,
  sanitizeDeviceState,
} = require("../service/iotCapabilities");

test("device commands accept only declared capabilities and values", () => {
  assert.deepEqual(validateDeviceCommand("LIGHT", { power: "ON" }), {
    power: "ON",
  });
  assert.deepEqual(
    validateDeviceCommand("AIR_CONDITIONER", { temperature: 22 }),
    { temperature: 22 }
  );
  assert.throws(() => validateDeviceCommand("SMART_LOCK", { power: "ON" }), {
    code: "IOT_COMMAND_UNSUPPORTED",
  });
  assert.throws(
    () => validateDeviceCommand("AIR_CONDITIONER", { temperature: 99 }),
    { code: "IOT_COMMAND_VALUE_INVALID" }
  );
  assert.throws(
    () => validateDeviceCommand("WATER_SENSOR", { waterDetected: false }),
    { code: "IOT_COMMAND_UNSUPPORTED" }
  );
});

test("reported device state removes unknown fields and invalid capability values", () => {
  assert.deepEqual(
    sanitizeDeviceState("WATER_SENSOR", {
      waterDetected: true,
      battery: 71,
      secret: "must-not-leak",
      temperature: 22,
    }),
    { waterDetected: true, battery: 71 }
  );
  assert.deepEqual(
    sanitizeDeviceState("LIGHT", { power: "UNKNOWN", extra: "value" }),
    {}
  );
});

test("mock provider supports idempotent deletion and device shadow state", async () => {
  const provider = new MockIoTProvider();
  await provider.createThing({
    thingName: "iot-test",
    attributes: { scopeType: "PERSONAL_RESIDENCE" },
  });
  const shadow = await provider.updateShadow({
    thingName: "iot-test",
    desired: { power: "ON" },
  });

  assert.equal(shadow.state.desired.power, "ON");
  assert.equal(shadow.version, 1);
  assert.deepEqual(await provider.deleteThing({ thingName: "iot-test" }), {
    deleted: true,
    alreadyMissing: false,
  });
  assert.deepEqual(await provider.deleteThing({ thingName: "iot-test" }), {
    deleted: true,
    alreadyMissing: true,
  });
});

test("mock provider cannot be selected in production", () => {
  assert.throws(
    () => createIoTProvider({ NODE_ENV: "production", IOT_PROVIDER: "mock" }),
    { code: "IOT_MOCK_PRODUCTION_FORBIDDEN" }
  );
  assert.ok(
    createIoTProvider({ NODE_ENV: "test", IOT_PROVIDER: "mock" }) instanceof
      MockIoTProvider
  );
});

test("AWS provider sends v3 commands through the injected client and parses shadows", async () => {
  const sent = [];
  const client = {
    async send(command) {
      sent.push(command);
      if (command.constructor.name === "DescribeEndpointCommand") {
        return { endpointAddress: "account-ats.iot.us-east-1.amazonaws.com" };
      }
      if (command.constructor.name === "CreateThingCommand")
        return { thingArn: "arn:thing" };
      if (command.constructor.name === "DescribeThingCommand") {
        return {
          thingName: command.input.thingName,
          attributes: { scopeType: "COMMON_AREA" },
        };
      }
      if (command.constructor.name === "GetThingShadowCommand") {
        return {
          payload: Buffer.from(
            JSON.stringify({ version: 4, state: { reported: { power: "ON" } } })
          ),
        };
      }
      if (command.constructor.name === "UpdateThingShadowCommand") {
        return {
          payload: Buffer.from(
            JSON.stringify({ version: 5, state: { desired: { power: "OFF" } } })
          ),
        };
      }
      return {};
    },
  };
  const provider = new AWSIoTProvider({
    region: "us-east-1",
    clientFactory: () => client,
  });

  assert.deepEqual(
    await provider.createThing({
      thingName: "iot-test",
      attributes: { scopeType: "COMMON_AREA" },
    }),
    {
      thingName: "iot-test",
      thingArn: "arn:thing",
    }
  );
  assert.equal(
    (await provider.describeThing({ thingName: "iot-test" })).attributes
      .scopeType,
    "COMMON_AREA"
  );
  assert.deepEqual(
    (await provider.getShadow({ thingName: "iot-test" })).state.reported,
    { power: "ON" }
  );
  assert.deepEqual(
    await provider.updateShadow({
      thingName: "iot-test",
      desired: { power: "OFF" },
    }),
    {
      version: 5,
      state: { desired: { power: "OFF" } },
    }
  );
  assert.equal(sent.length, 5);
});

test("AWS provider requires an explicit region before making requests", async () => {
  const provider = new AWSIoTProvider({ region: "" });
  await assert.rejects(provider.describeThing({ thingName: "iot-test" }), {
    code: "AWS_IOT_REGION_MISSING",
  });
});
