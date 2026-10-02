"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { IoTSubscriptionService } = require("../service/iotSubscriptionService");

function queryResult(value) {
  return {
    select() {
      return this;
    },
    lean: async () => value,
  };
}

test("subscription provisioning derives organization from condominium and validates stable unit", async () => {
  const condominium = {
    _id: "condo-1",
    organizationId: "org-from-db",
    units: [{ _id: "unit-1", status: "active" }],
  };
  let createdDocument;
  const service = new IoTSubscriptionService({
    CondominiumModel: { findOne: () => queryResult(condominium) },
    OwnerModel: { findOne: () => queryResult({ _id: "owner-1" }) },
    SubscriptionModel: {
      create: async ([document]) => {
        createdDocument = document;
        return [{ toJSON: () => document }];
      },
    },
  });

  const subscription = await service.provision("platform-1", {
    scopeType: "CONDOMINIUM_UNIT",
    condominiumId: "condo-1",
    unitId: "unit-1",
    organizationId: "forged-org",
    plan: "basic",
    deviceLimit: 6,
  });

  assert.equal(subscription.organizationId, "org-from-db");
  assert.equal(subscription.deviceLimit, 6);
  assert.equal(subscription.billingStatus, "MANUAL");
  assert.equal(createdDocument.organizationId, "org-from-db");
});

test("subscription provisioning rejects missing personal residences", async () => {
  const service = new IoTSubscriptionService({
    OwnerModel: { findOne: () => queryResult(null) },
    SubscriptionModel: {
      create: async () => assert.fail("must not create an entitlement"),
    },
  });

  await assert.rejects(
    service.provision("platform-1", {
      scopeType: "PERSONAL_RESIDENCE",
      ownerId: "owner-1",
      residenceId: "foreign-residence",
      plan: "BASIC",
      deviceLimit: 3,
    }),
    { code: "IOT_SUBSCRIPTION_CONTEXT_NOT_FOUND" }
  );
});

test("subscription provisioning requires a valid non-negative device limit", async () => {
  const service = new IoTSubscriptionService();
  await assert.rejects(
    service.provision("platform-1", {
      scopeType: "PERSONAL_RESIDENCE",
      plan: "BASIC",
      deviceLimit: -1,
    }),
    { code: "IOT_SUBSCRIPTION_INVALID" }
  );
});

test("quota reservation rejects an entitlement that is already exhausted", async () => {
  let updateCalled = false;
  const service = new IoTSubscriptionService({
    SubscriptionModel: {
      findOne: () => ({
        session() {
          return this;
        },
        lean: async () => ({
          _id: "subscription-1",
          deviceLimit: 2,
          deviceUsage: 2,
        }),
      }),
      updateOne: async () => {
        updateCalled = true;
        return { modifiedCount: 1 };
      },
    },
  });

  await assert.rejects(
    service.reserveDevice(
      {
        scopeType: "PERSONAL_RESIDENCE",
        ownerId: "owner-1",
        residenceId: "residence-1",
      },
      {}
    ),
    { code: "IOT_DEVICE_LIMIT_REACHED", statusCode: 409 }
  );
  assert.equal(updateCalled, false);
});

test("quota reservation rejects a concurrent increment after the limit is reached", async () => {
  let reservationFilter;
  const service = new IoTSubscriptionService({
    SubscriptionModel: {
      findOne: () => ({
        session() {
          return this;
        },
        lean: async () => ({
          _id: "subscription-1",
          deviceLimit: 2,
          deviceUsage: 1,
        }),
      }),
      updateOne: async (filter) => {
        reservationFilter = filter;
        return { modifiedCount: 0 };
      },
    },
  });

  await assert.rejects(
    service.reserveDevice(
      {
        scopeType: "PERSONAL_RESIDENCE",
        ownerId: "owner-1",
        residenceId: "residence-1",
      },
      {}
    ),
    { code: "IOT_DEVICE_LIMIT_REACHED", statusCode: 409 }
  );
  assert.equal(reservationFilter.deviceUsage.$lt, 2);
});
