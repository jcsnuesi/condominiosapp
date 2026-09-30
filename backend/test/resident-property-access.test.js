"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const {
  activeOwnerCondominiumIds,
  activeOwnerPropertyDetails,
  groupCondominiumOwners,
  isOwnerPropertyActive,
} = require("../service/residentPropertyAccess");

function objectId() {
  return new mongoose.Types.ObjectId();
}

test("owner access is evaluated per condominium", () => {
  const activeCondo = objectId();
  const inactiveCondo = objectId();
  const owner = {
    propertyDetails: [
      {
        addressId: activeCondo,
        condominium_unit: "A-1",
        status_property: "active",
      },
      {
        addressId: inactiveCondo,
        condominium_unit: "B-2",
        status_property: "inactive",
      },
    ],
  };

  assert.deepEqual(activeOwnerCondominiumIds(owner), [String(activeCondo)]);
  assert.equal(isOwnerPropertyActive(owner.propertyDetails[0], activeCondo), true);
  assert.equal(isOwnerPropertyActive(owner.propertyDetails[1], inactiveCondo), false);
  assert.equal(activeOwnerPropertyDetails(owner, inactiveCondo).length, 0);
});

test("legacy inactive property status remains blocked", () => {
  const condominiumId = objectId();
  assert.equal(
    isOwnerPropertyActive(
      { addressId: condominiumId, status: "inactive" },
      condominiumId
    ),
    false
  );
});

test("resident rows are grouped once per owner with all condominium units", () => {
  const condominiumId = objectId();
  const otherCondominiumId = objectId();
  const ownerId = objectId();
  const owner = {
    _id: ownerId,
    name: "Mario",
    propertyDetails: [
      { addressId: { _id: condominiumId }, condominium_unit: "A-1" },
      { addressId: { _id: condominiumId }, condominium_unit: "A-2" },
      { addressId: { _id: otherCondominiumId }, condominium_unit: "B-1" },
    ],
  };

  const grouped = groupCondominiumOwners(
    [
      { ownerId: owner, status: "active" },
      { ownerId: owner, status: "active" },
    ],
    condominiumId
  );

  assert.equal(grouped.length, 1);
  assert.deepEqual(
    grouped[0].ownerId.propertyDetails.map((property) => property.condominium_unit),
    ["A-1", "A-2"]
  );
  assert.equal(grouped[0].status, "active");
});

test("an inactive condominium association controls the grouped row only there", () => {
  const condominiumId = objectId();
  const ownerId = objectId();
  const owner = {
    _id: ownerId,
    propertyDetails: [
      {
        addressId: condominiumId,
        condominium_unit: "A-1",
        status_property: "inactive",
      },
    ],
  };

  const grouped = groupCondominiumOwners(
    [{ ownerId: owner, status: "inactive" }],
    condominiumId
  );

  assert.equal(grouped.length, 1);
  assert.equal(grouped[0].status, "inactive");
});
