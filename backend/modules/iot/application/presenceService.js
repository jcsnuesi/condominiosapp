"use strict";
const mongoose = require("mongoose");
const Device = require("../../../models/iotDevice");
const Event = require("../../../models/iotDeviceEvent");
const { contextIsActive } = require("./ingestionContext");
const { scopeFilter, apiError } = require("../../../service/iotService");

class IoTPresenceService {
  constructor({ DeviceModel = Device, EventModel = Event, mongo = mongoose,
    activeContext = contextIsActive, now = () => new Date(), maxAgeMs = 300000 } = {}) {
    Object.assign(this, { DeviceModel, EventModel, mongo, activeContext, now, maxAgeMs });
  }

  async expirePresence({ limit = 100 } = {}) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 500 || !Number.isFinite(this.maxAgeMs) || this.maxAgeMs < 1000)
      throw apiError("IOT_PRESENCE_CONFIG_INVALID", "Invalid presence sweep configuration", 422);
    const occurredAt = this.now();
    const cutoff = new Date(occurredAt.getTime() - this.maxAgeMs);
    const devices = await this.DeviceModel.find({ status: "ACTIVE", enabled: { $ne: false }, gatewayId: { $type: "objectId" },
      connectivity: "ONLINE", lastReportedAt: { $lt: cutoff } }).sort({ lastReportedAt: 1, _id: 1 }).limit(limit).lean();
    let changed = 0;
    for (const device of devices) {
      const session = await this.mongo.startSession();
      try {
        let applied = false;
        await session.withTransaction(async () => {
          applied = false;
          if (!(await this.activeContext(device, session))) return;
          const result = await this.DeviceModel.updateOne({ _id: device._id, status: "ACTIVE", enabled: { $ne: false },
            gatewayId: device.gatewayId, connectivity: "ONLINE", lastReportedAt: device.lastReportedAt },
          { $set: { connectivity: "OFFLINE" } }, { session, runValidators: true });
          if (result.modifiedCount !== 1) return;
          await this.EventModel.create([{
            ...scopeFilter(device), deviceId: device._id, eventType: "device.offline", severity: "INFO",
            observedValue: "OFFLINE", occurredAt,
            eventKey: `${device._id}:device.offline:${new Date(device.lastReportedAt).getTime()}`,
          }], { session });
          applied = true;
        });
        if (applied) changed++;
      } finally { await session.endSession(); }
    }
    return { scanned: devices.length, changed };
  }
}

module.exports = { IoTPresenceService };
