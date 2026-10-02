"use strict";

const mongoose = require("mongoose");
const Condominium = require("../models/condominio");
const Owner = require("../models/owners");

function normalizeUnitLabel(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function isActiveAssociation(property) {
  return (
    String(property?.status_property || "active").toLowerCase() !==
      "inactive" &&
    String(property?.status || "active").toLowerCase() !== "inactive"
  );
}

function buildCondominiumUnitPlan(condominium, owners) {
  const condominiumId = String(condominium._id);
  const issues = [];
  const labels = new Map();
  const existingUnits = new Map();
  const associationsByLabel = new Map();

  for (const unit of condominium.units || []) {
    const normalizedLabel =
      unit.normalizedLabel || normalizeUnitLabel(unit.label);
    if (!normalizedLabel || existingUnits.has(normalizedLabel)) {
      issues.push({
        code: "DUPLICATE_OR_EMPTY_EXISTING_UNIT",
        normalizedLabel,
      });
      continue;
    }
    existingUnits.set(normalizedLabel, unit);
  }

  for (const label of condominium.availableUnits || []) {
    const normalizedLabel = normalizeUnitLabel(label);
    if (!normalizedLabel) {
      issues.push({ code: "EMPTY_AVAILABLE_UNIT" });
      continue;
    }
    if (!labels.has(normalizedLabel))
      labels.set(normalizedLabel, String(label).trim());
  }

  for (const owner of owners || []) {
    for (const [propertyIndex, property] of (
      owner.propertyDetails || []
    ).entries()) {
      const propertyCondominiumId =
        property.addressId?._id || property.addressId;
      if (String(propertyCondominiumId || "") !== condominiumId) continue;
      const normalizedLabel = normalizeUnitLabel(property.condominium_unit);
      if (!normalizedLabel) {
        issues.push({
          code: "OWNER_ASSOCIATION_WITHOUT_UNIT",
          ownerId: String(owner._id),
        });
        continue;
      }
      if (!labels.has(normalizedLabel))
        labels.set(normalizedLabel, String(property.condominium_unit).trim());
      const associations = associationsByLabel.get(normalizedLabel) || [];
      associations.push({
        owner,
        propertyIndex,
        property,
        active: isActiveAssociation(property),
      });
      associationsByLabel.set(normalizedLabel, associations);
    }
  }

  for (const [normalizedLabel, unit] of existingUnits) {
    if (!labels.has(normalizedLabel)) labels.set(normalizedLabel, unit.label);
  }

  const units = [];
  const unitIdByLabel = new Map();
  for (const [normalizedLabel, label] of labels) {
    const existing = existingUnits.get(normalizedLabel);
    const associations = associationsByLabel.get(normalizedLabel) || [];
    const activeAssociations = associations.filter(
      (association) => association.active
    );
    if (activeAssociations.length > 1) {
      issues.push({
        code: "MULTIPLE_ACTIVE_OWNERS",
        normalizedLabel,
        count: activeAssociations.length,
      });
    }
    if (
      existing?.availability === "ASSIGNED" &&
      activeAssociations.length === 0
    ) {
      issues.push({
        code: "ASSIGNED_UNIT_WITHOUT_ACTIVE_OWNER",
        normalizedLabel,
      });
    }
    const unitId = existing?._id || new mongoose.Types.ObjectId();
    unitIdByLabel.set(normalizedLabel, unitId);
    units.push({
      _id: unitId,
      label: existing?.label || label,
      normalizedLabel,
      status: existing?.status || "active",
      availability: activeAssociations.length ? "ASSIGNED" : "AVAILABLE",
    });
  }

  const ownerUpdates = [];
  for (const owner of owners || []) {
    let changed = false;
    const propertyDetails = (owner.propertyDetails || []).map((property) => {
      const propertyCondominiumId =
        property.addressId?._id || property.addressId;
      if (String(propertyCondominiumId || "") !== condominiumId)
        return property;
      const normalizedLabel = normalizeUnitLabel(property.condominium_unit);
      const unitId = unitIdByLabel.get(normalizedLabel);
      if (!unitId) return property;
      changed = true;
      return {
        ...property,
        _id: property._id || new mongoose.Types.ObjectId(),
        contextType: "CONDOMINIUM_UNIT",
        unitId,
      };
    });
    if (changed) ownerUpdates.push({ ownerId: owner._id, propertyDetails });
  }

  return {
    condominiumId: condominium._id,
    safeToApply: issues.length === 0,
    issues,
    units,
    availableUnits: units
      .filter(
        (unit) => unit.availability === "AVAILABLE" && unit.status === "active"
      )
      .map((unit) => unit.label),
    ownerUpdates,
  };
}

async function runIoTRelationshipMigration({
  apply = false,
  models = {},
  mongooseInstance = mongoose,
} = {}) {
  const CondominiumModel = models.Condominium || Condominium;
  const OwnerModel = models.Owner || Owner;
  const condominiums = await CondominiumModel.find({}).lean();
  const plans = [];

  for (const condominium of condominiums) {
    const owners = await OwnerModel.find({
      "propertyDetails.addressId": condominium._id,
    }).lean();
    plans.push(buildCondominiumUnitPlan(condominium, owners));
  }

  const summary = {
    dryRun: !apply,
    condominiums: plans.length,
    safe: plans.filter((plan) => plan.safeToApply).length,
    blocked: plans.filter((plan) => !plan.safeToApply).length,
    units: plans.reduce((total, plan) => total + plan.units.length, 0),
    associations: plans.reduce(
      (total, plan) => total + plan.ownerUpdates.length,
      0
    ),
    issues: plans.flatMap((plan) =>
      plan.issues.map((issue) => ({
        condominiumId: plan.condominiumId,
        ...issue,
      }))
    ),
  };

  if (!apply) return summary;

  for (const plan of plans) {
    if (!plan.safeToApply) continue;
    const session = await mongooseInstance.startSession();
    try {
      await session.withTransaction(async () => {
        const result = await CondominiumModel.updateOne(
          { _id: plan.condominiumId },
          { $set: { units: plan.units, availableUnits: plan.availableUnits } },
          { session, runValidators: true }
        );
        if (result.matchedCount !== 1)
          throw new Error(
            "Condominium changed during IoT relationship migration"
          );
        for (const ownerUpdate of plan.ownerUpdates) {
          const ownerResult = await OwnerModel.updateOne(
            { _id: ownerUpdate.ownerId },
            { $set: { propertyDetails: ownerUpdate.propertyDetails } },
            { session, runValidators: true }
          );
          if (ownerResult.matchedCount !== 1)
            throw new Error("Owner changed during IoT relationship migration");
        }
      });
      summary.applied = (summary.applied || 0) + 1;
    } finally {
      await session.endSession();
    }
  }

  summary.dryRun = false;
  return summary;
}

module.exports = {
  normalizeUnitLabel,
  buildCondominiumUnitPlan,
  runIoTRelationshipMigration,
};
