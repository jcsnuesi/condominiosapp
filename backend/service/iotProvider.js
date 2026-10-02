"use strict";

const { AWSIoTProvider } = require("./awsIoTProvider");

class MockIoTProvider {
  constructor() {
    this.things = new Map();
  }

  async createThing({ thingName, attributes }) {
    if (this.things.has(thingName)) {
      const error = new Error("Thing already exists");
      error.code = "THING_ALREADY_EXISTS";
      throw error;
    }
    this.things.set(thingName, {
      thingName,
      attributes,
      shadow: { state: { reported: {}, desired: {} }, version: 0 },
    });
    return { thingName, thingArn: `mock:thing/${thingName}` };
  }

  async describeThing({ thingName }) {
    const thing = this.things.get(thingName);
    if (!thing) {
      const error = new Error("Thing not found");
      error.name = "ResourceNotFoundException";
      throw error;
    }
    return {
      thingName,
      thingArn: `mock:thing/${thingName}`,
      attributes: thing.attributes,
    };
  }

  async deleteThing({ thingName }) {
    const existed = this.things.delete(thingName);
    return { deleted: true, alreadyMissing: !existed };
  }

  async getShadow({ thingName }) {
    return this.things.get(thingName)?.shadow || null;
  }

  async updateShadow({ thingName, desired }) {
    const thing = this.things.get(thingName);
    if (!thing) throw new Error("Thing not found");
    thing.shadow.state.desired = { ...thing.shadow.state.desired, ...desired };
    thing.shadow.version += 1;
    return thing.shadow;
  }
}

function createIoTProvider(env = process.env) {
  const provider = String(env.IOT_PROVIDER || "aws").toLowerCase();
  if (provider === "mock") {
    if (env.NODE_ENV === "production") {
      const error = new Error("Mock IoT provider is disabled in production");
      error.code = "IOT_MOCK_PRODUCTION_FORBIDDEN";
      throw error;
    }
    return new MockIoTProvider();
  }
  if (provider !== "aws") {
    const error = new Error("Unsupported IoT provider");
    error.code = "IOT_PROVIDER_INVALID";
    throw error;
  }
  return new AWSIoTProvider({
    region: env.AWS_REGION || env.AWS_DEFAULT_REGION,
  });
}

let sharedProvider;

function getIoTProvider() {
  if (!sharedProvider) sharedProvider = createIoTProvider();
  return sharedProvider;
}

module.exports = { createIoTProvider, getIoTProvider, MockIoTProvider };
