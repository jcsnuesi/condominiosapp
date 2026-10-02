"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { IoTAuthorizationService } = require("../service/iotAuthorization");

const id = () => new mongoose.Types.ObjectId();

function query(value) {
  return {
    select() {
      return this;
    },
    lean: async () => value,
  };
}

function makeAuthorization(owner) {
  return new IoTAuthorizationService({
    OwnerModel: { findOne: () => query(owner) },
    CondominiumModel: {
      findOne: () =>
        query({
          _id: owner.propertyDetails[0].addressId,
          organizationId: owner.organizationId,
          units: [],
        }),
    },
    OrganizationModel: {
      findOne: () => query({ _id: owner.organizationId, status: "active" }),
    },
  });
}

test("Owner A cannot view, update, control or delete Owner B unit devices", async () => {
  const condoId = id();
  const ownerAId = id();
  const ownerA = {
    _id: ownerAId,
    organizationId: id(),
    propertyDetails: [
      {
        addressId: condoId,
        unitId: id(),
        contextType: "CONDOMINIUM_UNIT",
        status_property: "active",
      },
    ],
  };
  const ownerBUnitId = id();
  const device = {
    _id: id(),
    scopeType: "CONDOMINIUM_UNIT",
    organizationId: ownerA.organizationId,
    condominiumId: condoId,
    unitId: ownerBUnitId,
  };
  const actor = {
    role: "OWNER",
    account: ownerA,
    permissions: ["iot.read", "iot.update", "iot.control", "iot.delete"],
  };
  const authorization = makeAuthorization(ownerA);

  await assert.rejects(authorization.canViewDevice(actor, device), {
    code: "IOT_NOT_FOUND",
  });
  await assert.rejects(authorization.canUpdateDevice(actor, device), {
    code: "IOT_NOT_FOUND",
  });
  await assert.rejects(authorization.canControlDevice(actor, device), {
    code: "IOT_NOT_FOUND",
  });
  await assert.rejects(authorization.canDeleteDevice(actor, device), {
    code: "IOT_NOT_FOUND",
  });
});

test("administrative ALL scope does not grant access to private condominium unit devices", async () => {
  const actor = {
    role: "ADMIN",
    organizationId: id(),
    permissions: ["iot.read", "iot.update", "iot.control", "iot.delete"],
    scope: { mode: "ALL", condominiumIds: [] },
  };
  const device = {
    _id: id(),
    scopeType: "CONDOMINIUM_UNIT",
    organizationId: actor.organizationId,
    condominiumId: id(),
    unitId: id(),
  };
  const authorization = makeAuthorization({
    _id: id(),
    organizationId: actor.organizationId,
    propertyDetails: [
      { addressId: device.condominiumId, unitId: device.unitId },
    ],
  });

  await assert.rejects(authorization.canViewDevice(actor, device), {
    code: "IOT_NOT_FOUND",
  });
});

test("verified Owner can access only their personal residence without Organization", async () => {
  const ownerId = id();
  const residenceId = id();
  const owner = {
    _id: ownerId,
    role: "OWNER",
    status: "active",
    emailVerified: true,
    propertyDetails: [
      {
        _id: residenceId,
        contextType: "PERSONAL_RESIDENCE",
        status_property: "active",
      },
    ],
  };
  const actor = { role: "OWNER", account: owner, permissions: ["iot.read"] };
  const authorization = new IoTAuthorizationService();
  const ownDevice = { scopeType: "PERSONAL_RESIDENCE", ownerId, residenceId };
  const otherDevice = {
    scopeType: "PERSONAL_RESIDENCE",
    ownerId: id(),
    residenceId: id(),
  };

  assert.equal(await authorization.canViewDevice(actor, ownDevice), true);
  await assert.rejects(authorization.canViewDevice(actor, otherDevice), {
    code: "IOT_NOT_FOUND",
  });
});

test("Owner without organization can create in a managed unit only through the exact ownership relation", async () => {
  const ownerId = id();
  const condoId = id();
  const organizationId = id();
  const unitId = id();
  const owner = {
    _id: ownerId,
    role: "OWNER",
    status: "active",
    emailVerified: true,
    organizationId: null,
    propertyDetails: [
      {
        _id: id(),
        addressId: condoId,
        unitId,
        contextType: "CONDOMINIUM_UNIT",
        status_property: "active",
      },
      {
        _id: id(),
        contextType: "PERSONAL_RESIDENCE",
        status_property: "active",
      },
    ],
  };
  const authorization = new IoTAuthorizationService({
    OwnerModel: { findOne: () => query(owner) },
    CondominiumModel: {
      findOne: () =>
        query({
          _id: condoId,
          organizationId,
          units: [{ _id: unitId, status: "active" }],
        }),
    },
    OrganizationModel: {
      findOne: () => query({ _id: organizationId, status: "active" }),
    },
  });
  const actor = {
    role: "OWNER",
    contextType: "PERSONAL_OWNER",
    account: owner,
    permissions: ["iot.create"],
  };

  const context = await authorization.canCreateDevice(actor, {
    scopeType: "CONDOMINIUM_UNIT",
    condominiumId: condoId,
    unitId,
  });
  assert.equal(String(context.organizationId), String(organizationId));
  assert.equal(String(context.unitId), String(unitId));
});
