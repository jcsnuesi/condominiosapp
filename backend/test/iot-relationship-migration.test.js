"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const {
  buildCondominiumUnitPlan,
  normalizeUnitLabel,
} = require("../service/iotRelationshipMigration");

const id = () => new mongoose.Types.ObjectId();

test("unit migration creates stable units and links active and inactive owner associations", () => {
  const condominiumId = id();
  const ownerId = id();
  const condominium = {
    _id: condominiumId,
    availableUnits: ["A-101", "B-201"],
    units: [],
  };
  const owners = [
    {
      _id: ownerId,
      propertyDetails: [
        {
          addressId: condominiumId,
          condominium_unit: "A-101",
          status_property: "active",
        },
        {
          addressId: condominiumId,
          condominium_unit: "C-301",
          status_property: "inactive",
        },
      ],
    },
  ];

  const plan = buildCondominiumUnitPlan(condominium, owners);
  const assigned = plan.units.find((unit) => unit.normalizedLabel === "a-101");
  const available = plan.units.find((unit) => unit.normalizedLabel === "b-201");
  const linkedOwner = plan.ownerUpdates[0].propertyDetails;

  assert.equal(plan.safeToApply, true);
  assert.equal(assigned.availability, "ASSIGNED");
  assert.equal(available.availability, "AVAILABLE");
  assert.ok(linkedOwner[0]._id);
  assert.equal(String(linkedOwner[0].unitId), String(assigned._id));
  assert.equal(linkedOwner[0].contextType, "CONDOMINIUM_UNIT");
  assert.equal(linkedOwner[1].contextType, "CONDOMINIUM_UNIT");
});

test("unit migration blocks duplicate active owners instead of granting shared access", () => {
  const condominiumId = id();
  const plan = buildCondominiumUnitPlan(
    { _id: condominiumId, availableUnits: [], units: [] },
    [
      {
        _id: id(),
        propertyDetails: [
          { addressId: condominiumId, condominium_unit: "A-101" },
        ],
      },
      {
        _id: id(),
        propertyDetails: [
          { addressId: condominiumId, condominium_unit: "a-101" },
        ],
      },
    ]
  );

  assert.equal(plan.safeToApply, false);
  assert.equal(plan.issues[0].code, "MULTIPLE_ACTIVE_OWNERS");
});

test("unit labels use stable Unicode and whitespace normalization", () => {
  assert.equal(normalizeUnitLabel("  Ａ-101   "), "a-101");
});
