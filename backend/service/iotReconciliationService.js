"use strict";

const mongoose = require("mongoose");
const IoTDevice = require("../models/iotDevice");
const IoTAuditEvent = require("../models/iotAuditEvent");
const { IoTSubscriptionService } = require("./iotSubscriptionService");
const { getIoTProvider } = require("./iotProvider");

function retryDelayMs(attempt) {
  return Math.min(60 * 60 * 1000, 30 * 1000 * 2 ** Math.max(0, attempt - 1));
}

function deviceAttributes(device) {
  return {
    deviceId: String(device._id),
    scopeType: device.scopeType,
    ...(device.organizationId
      ? { organizationId: String(device.organizationId) }
      : {}),
    ...(device.condominiumId
      ? { condominiumId: String(device.condominiumId) }
      : {}),
    ...(device.unitId ? { unitId: String(device.unitId) } : {}),
  };
}

class IoTReconciliationService {
  constructor({
    DeviceModel = IoTDevice,
    AuditModel = IoTAuditEvent,
    subscriptions = new IoTSubscriptionService({ DeviceModel }),
    provider = getIoTProvider(),
    mongo = mongoose,
    now = () => new Date(),
    maxAttempts = 8,
  } = {}) {
    this.DeviceModel = DeviceModel;
    this.AuditModel = AuditModel;
    this.subscriptions = subscriptions;
    this.provider = provider;
    this.mongo = mongo;
    this.now = now;
    this.maxAttempts = maxAttempts;
  }

  async writeSystemAudit(device, action, success, errorCode = "") {
    const scope = {
      scopeType: device.scopeType,
      organizationId: device.organizationId || null,
      condominiumId: device.condominiumId || null,
      unitId: device.unitId || null,
      ownerId: device.ownerId || null,
      residenceId: device.residenceId || null,
      deviceId: device._id,
    };
    await this.AuditModel.create([
      {
        ...scope,
        actorId: device.createdBy,
        actorRole: "SYSTEM",
        action,
        success,
        errorCode,
      },
    ]);
  }

  async reconcileCreate(device) {
    let thing;
    try {
      thing = await this.provider.describeThing({
        thingName: device.awsThingName,
      });
    } catch (error) {
      if (error?.name !== "ResourceNotFoundException") throw error;
    }

    if (thing && thing.attributes?.deviceId !== String(device._id)) {
      const error = new Error(
        "Existing AWS Thing is not owned by this device record"
      );
      error.code = "AWS_IOT_THING_OWNERSHIP_MISMATCH";
      throw error;
    }
    if (!thing) {
      await this.provider.createThing({
        thingName: device.awsThingName,
        attributes: deviceAttributes(device),
      });
    }

    await this.DeviceModel.updateOne(
      { _id: device._id, status: { $in: ["PROVISIONING", "ERROR"] } },
      {
        $set: {
          status: "ACTIVE",
          lastErrorCode: "",
          nextRetryAt: null,
          reconciliationAttempts: 0,
        },
      }
    );
    await this.writeSystemAudit(device, "DEVICE_PROVISIONED", true);
    return "provisioned";
  }

  async reconcileDelete(device) {
    await this.provider.deleteThing({ thingName: device.awsThingName });
    const session = await this.mongo.startSession();
    try {
      await session.withTransaction(async () => {
        await this.subscriptions.releaseDevice(device, session);
        await this.DeviceModel.updateOne(
          { _id: device._id, status: "DELETING" },
          {
            $set: {
              status: "DELETED",
              enabled: false,
              deletedAt: this.now(),
              nextRetryAt: null,
              lastErrorCode: "",
            },
          },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }
    await this.writeSystemAudit(device, "DEVICE_DELETED", true);
    return "deleted";
  }

  async reconcileOne(device) {
    try {
      return device.status === "DELETING"
        ? await this.reconcileDelete(device)
        : await this.reconcileCreate(device);
    } catch (error) {
      const attempts = Number(device.reconciliationAttempts || 0) + 1;
      const retryAt =
        attempts >= this.maxAttempts
          ? null
          : new Date(this.now().getTime() + retryDelayMs(attempts));
      await this.DeviceModel.updateOne(
        {
          _id: device._id,
          status: { $in: ["PROVISIONING", "ERROR", "DELETING"] },
        },
        {
          $set: {
            status: device.status === "DELETING" ? "DELETING" : "ERROR",
            reconciliationAttempts: attempts,
            nextRetryAt: retryAt,
            lastErrorCode: String(
              error.code || "AWS_IOT_RECONCILIATION_FAILED"
            ).slice(0, 80),
          },
        }
      );
      await this.writeSystemAudit(
        device,
        device.status === "DELETING" ? "DEVICE_DELETED" : "DEVICE_PROVISIONED",
        false,
        error.code || "AWS_IOT_RECONCILIATION_FAILED"
      );
      return "failed";
    }
  }

  async reconcilePending(limit = 25) {
    const now = this.now();
    const devices = await this.DeviceModel.find({
      status: { $in: ["PROVISIONING", "ERROR", "DELETING"] },
      reconciliationAttempts: { $lt: this.maxAttempts },
      $or: [{ nextRetryAt: null }, { nextRetryAt: { $lte: now } }],
    })
      .sort({ updatedAt: 1 })
      .limit(Math.max(1, Math.min(limit, 100)))
      .lean();
    const result = {
      checked: devices.length,
      provisioned: 0,
      deleted: 0,
      failed: 0,
    };
    for (const device of devices) {
      const outcome = await this.reconcileOne(device);
      result[outcome] += 1;
    }
    return result;
  }
}

module.exports = { IoTReconciliationService, retryDelayMs, deviceAttributes };
