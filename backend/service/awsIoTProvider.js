"use strict";

const {
  IoTClient,
  DescribeEndpointCommand,
  CreateThingCommand,
  DescribeThingCommand,
  DeleteThingCommand,
} = require("@aws-sdk/client-iot");
const {
  IoTDataPlaneClient,
  GetThingShadowCommand,
  UpdateThingShadowCommand,
} = require("@aws-sdk/client-iot-data-plane");

function codedError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

class AWSIoTProvider {
  constructor({
    region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
    dataEndpoint = process.env.AWS_IOT_DATA_ENDPOINT || "",
    clientFactory,
  } = {}) {
    this.region = region;
    this.dataEndpoint = dataEndpoint;
    this.clientFactory =
      clientFactory ||
      ((kind, config) =>
        kind === "control"
          ? new IoTClient(config)
          : new IoTDataPlaneClient(config));
    this.controlClient = null;
    this.dataClient = null;
  }

  getClient(kind) {
    if (!this.region) {
      throw codedError(
        "AWS_IOT_REGION_MISSING",
        "AWS_REGION is required for AWS IoT"
      );
    }
    const key = kind === "control" ? "controlClient" : "dataClient";
    if (!this[key])
      this[key] = this.clientFactory(kind, {
        region: this.region,
        maxAttempts: 3,
      });
    return this[key];
  }

  async getDataClient() {
    if (this.dataClient) return this.dataClient;
    if (!this.dataEndpoint) {
      const endpoint = await this.getClient("control").send(
        new DescribeEndpointCommand({ endpointType: "iot:Data-ATS" })
      );
      this.dataEndpoint = endpoint.endpointAddress || "";
    }
    if (!this.dataEndpoint) {
      throw codedError(
        "AWS_IOT_DATA_ENDPOINT_MISSING",
        "AWS IoT data endpoint could not be resolved"
      );
    }
    const endpointUrl = this.dataEndpoint.startsWith("https://")
      ? this.dataEndpoint
      : `https://${this.dataEndpoint}`;
    this.dataClient = this.clientFactory("data", {
      region: this.region,
      endpoint: endpointUrl,
      maxAttempts: 3,
    });
    return this.dataClient;
  }

  async createThing({ thingName, attributes }) {
    const result = await this.getClient("control").send(
      new CreateThingCommand({
        thingName,
        attributePayload: { attributes, merge: false },
      })
    );
    return { thingName, thingArn: result.thingArn || null };
  }

  async describeThing({ thingName }) {
    const result = await this.getClient("control").send(
      new DescribeThingCommand({ thingName })
    );
    return {
      thingName: result.thingName,
      thingArn: result.thingArn || null,
      attributes: result.attributes || {},
      version: result.version || null,
    };
  }

  async deleteThing({ thingName }) {
    try {
      await this.getClient("control").send(
        new DeleteThingCommand({ thingName })
      );
      return { deleted: true, alreadyMissing: false };
    } catch (error) {
      if (error?.name === "ResourceNotFoundException") {
        return { deleted: true, alreadyMissing: true };
      }
      throw error;
    }
  }

  async getShadow({ thingName }) {
    try {
      const result = await (
        await this.getDataClient()
      ).send(new GetThingShadowCommand({ thingName }));
      const payload = JSON.parse(
        Buffer.from(result.payload || []).toString("utf8")
      );
      return {
        state: payload.state || {},
        version: payload.version || 0,
        timestamp: payload.timestamp
          ? new Date(payload.timestamp * 1000)
          : null,
      };
    } catch (error) {
      if (error?.name === "ResourceNotFoundException") return null;
      throw error;
    }
  }

  async updateShadow({ thingName, desired }) {
    const payload = Buffer.from(JSON.stringify({ state: { desired } }));
    const result = await (
      await this.getDataClient()
    ).send(new UpdateThingShadowCommand({ thingName, payload }));
    return JSON.parse(Buffer.from(result.payload || []).toString("utf8"));
  }
}

module.exports = { AWSIoTProvider };
