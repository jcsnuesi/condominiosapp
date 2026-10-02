"use strict";

const IoTSubscription = require("../models/iotSubscription");
const IoTDevice = require("../models/iotDevice");
const Condominium = require("../models/condominio");
const Owner = require("../models/owners");

function subscriptionError(code, message, statusCode = 403) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function subscriptionScopeFilter(scope) {
  if (scope.scopeType === "CONDOMINIUM_UNIT") {
    return {
      scopeType: scope.scopeType,
      organizationId: scope.organizationId,
      condominiumId: scope.condominiumId,
      unitId: scope.unitId,
    };
  }
  if (scope.scopeType === "PERSONAL_RESIDENCE") {
    return {
      scopeType: scope.scopeType,
      ownerId: scope.ownerId,
      residenceId: scope.residenceId,
    };
  }
  return {
    scopeType: "COMMON_AREA",
    organizationId: scope.organizationId,
    condominiumId: scope.condominiumId,
  };
}

class IoTSubscriptionService {
  constructor({
    SubscriptionModel = IoTSubscription,
    DeviceModel = IoTDevice,
    CondominiumModel = Condominium,
    OwnerModel = Owner,
  } = {}) {
    this.SubscriptionModel = SubscriptionModel;
    this.DeviceModel = DeviceModel;
    this.CondominiumModel = CondominiumModel;
    this.OwnerModel = OwnerModel;
  }

  async provision(provisionedBy, input) {
    const scopeType = String(input.scopeType || "").toUpperCase();
    const plan = String(input.plan || "")
      .trim()
      .toUpperCase();
    const deviceLimit = Number(input.deviceLimit);
    if (
      !plan ||
      plan.length > 40 ||
      !Number.isInteger(deviceLimit) ||
      deviceLimit < 0
    ) {
      throw subscriptionError(
        "IOT_SUBSCRIPTION_INVALID",
        "Plan and non-negative integer deviceLimit are required",
        422
      );
    }

    let scope;
    if (scopeType === "PERSONAL_RESIDENCE") {
      const owner = await this.OwnerModel.findOne({
        _id: input.ownerId,
        status: "active",
        propertyDetails: {
          $elemMatch: {
            _id: input.residenceId,
            contextType: "PERSONAL_RESIDENCE",
            status_property: { $ne: "inactive" },
          },
        },
      })
        .select("_id")
        .lean();
      if (!owner) {
        throw subscriptionError(
          "IOT_SUBSCRIPTION_CONTEXT_NOT_FOUND",
          "Personal residence not found",
          404
        );
      }
      scope = { scopeType, ownerId: owner._id, residenceId: input.residenceId };
    } else if (scopeType === "CONDOMINIUM_UNIT") {
      const condominium = await this.CondominiumModel.findOne({
        _id: input.condominiumId,
        status: "active",
      })
        .select("organizationId units")
        .lean();
      const unit = condominium?.units?.find(
        (candidate) =>
          String(candidate._id) === String(input.unitId) &&
          String(candidate.status || "active").toLowerCase() === "active"
      );
      if (!unit) {
        throw subscriptionError(
          "IOT_SUBSCRIPTION_CONTEXT_NOT_FOUND",
          "Condominium unit not found",
          404
        );
      }
      const owner = await this.OwnerModel.findOne({
        status: "active",
        propertyDetails: {
          $elemMatch: {
            addressId: condominium._id,
            unitId: unit._id,
            status_property: { $ne: "inactive" },
          },
        },
      })
        .select("_id")
        .lean();
      if (!owner) {
        throw subscriptionError(
          "IOT_SUBSCRIPTION_CONTEXT_NOT_FOUND",
          "No active owner is linked to this unit",
          404
        );
      }
      scope = {
        scopeType,
        organizationId: condominium.organizationId,
        condominiumId: condominium._id,
        unitId: unit._id,
      };
    } else if (scopeType === "COMMON_AREA") {
      const condominium = await this.CondominiumModel.findOne({
        _id: input.condominiumId,
        status: "active",
      })
        .select("organizationId")
        .lean();
      if (!condominium) {
        throw subscriptionError(
          "IOT_SUBSCRIPTION_CONTEXT_NOT_FOUND",
          "Condominium not found",
          404
        );
      }
      scope = {
        scopeType,
        organizationId: condominium.organizationId,
        condominiumId: condominium._id,
      };
    } else {
      throw subscriptionError(
        "IOT_SUBSCRIPTION_SCOPE_INVALID",
        "Subscription scope is invalid",
        422
      );
    }

    try {
      const [subscription] = await this.SubscriptionModel.create([
        {
          ...scope,
          plan,
          deviceLimit,
          deviceUsage: 0,
          status: "ACTIVE",
          billingStatus: "MANUAL",
          provisionedBy,
        },
      ]);
      return subscription.toJSON();
    } catch (error) {
      if (error?.code === 11000) {
        throw subscriptionError(
          "IOT_SUBSCRIPTION_ALREADY_EXISTS",
          "An entitlement already exists for this context",
          409
        );
      }
      throw error;
    }
  }

  async reserveDevice(scope, session) {
    if (!session)
      throw new Error("A MongoDB transaction is required to reserve IoT quota");
    const now = new Date();
    const query = {
      ...subscriptionScopeFilter(scope),
      status: "ACTIVE",
      billingStatus: { $in: ["MANUAL", "CURRENT"] },
      $or: [{ endsAt: null }, { endsAt: { $gt: now } }],
    };
    const subscription = await this.SubscriptionModel.findOne(query)
      .session(session)
      .lean();
    if (!subscription) {
      throw subscriptionError(
        "IOT_SUBSCRIPTION_REQUIRED",
        "No active IoT subscription exists for this context"
      );
    }
    if (subscription.deviceUsage >= subscription.deviceLimit) {
      throw subscriptionError(
        "IOT_DEVICE_LIMIT_REACHED",
        "The IoT device limit has been reached",
        409
      );
    }

    const reservation = await this.SubscriptionModel.updateOne(
      {
        _id: subscription._id,
        ...query,
        deviceLimit: subscription.deviceLimit,
        deviceUsage: { $lt: subscription.deviceLimit },
      },
      { $inc: { deviceUsage: 1 } },
      { session }
    );
    if (reservation.modifiedCount !== 1) {
      throw subscriptionError(
        "IOT_DEVICE_LIMIT_REACHED",
        "The IoT device limit has been reached",
        409
      );
    }
    return subscription;
  }

  async getEntitlement(scope) {
    const subscription = await this.SubscriptionModel.findOne(
      subscriptionScopeFilter(scope)
    )
      .select("plan deviceLimit deviceUsage status billingStatus endsAt")
      .lean();
    if (!subscription) {
      return {
        plan: null,
        deviceLimit: 0,
        deviceUsage: 0,
        remainingDevices: 0,
        status: "NOT_SUBSCRIBED",
        billingStatus: "NONE",
      };
    }
    const isCurrent =
      subscription.status === "ACTIVE" &&
      (!subscription.endsAt || new Date(subscription.endsAt) > new Date());
    return {
      plan: subscription.plan,
      deviceLimit: subscription.deviceLimit,
      deviceUsage: subscription.deviceUsage,
      remainingDevices: Math.max(
        0,
        subscription.deviceLimit - subscription.deviceUsage
      ),
      status: isCurrent ? subscription.status : "SUSPENDED",
      billingStatus: subscription.billingStatus,
    };
  }

  async releaseDevice(device, session) {
    if (!session)
      throw new Error("A MongoDB transaction is required to release IoT quota");
    const reservation = await this.DeviceModel.updateOne(
      { _id: device._id, quotaReserved: true },
      { $set: { quotaReserved: false } },
      { session }
    );
    if (reservation.modifiedCount !== 1) return false;

    const result = await this.SubscriptionModel.updateOne(
      {
        ...subscriptionScopeFilter(device),
        deviceUsage: { $gt: 0 },
      },
      { $inc: { deviceUsage: -1 } },
      { session }
    );
    if (result.modifiedCount !== 1) {
      throw subscriptionError(
        "IOT_QUOTA_RECONCILIATION_REQUIRED",
        "IoT quota reservation could not be reconciled",
        409
      );
    }
    return true;
  }
}

module.exports = {
  IoTSubscriptionService,
  subscriptionScopeFilter,
  subscriptionError,
};
