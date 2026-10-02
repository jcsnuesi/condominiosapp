"use strict";

const mongoose = require("mongoose");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Condominium = require("../models/condominio");

function asString(value) {
  return value === null || value === undefined ? "" : String(value);
}

function propertyCondominiumId(property) {
  return property?.addressId?._id || property?.addressId;
}

function isOwnerPropertyActive(property, condominiumId) {
  return (
    asString(propertyCondominiumId(property)) === asString(condominiumId) &&
    String(property?.status_property || "active").toLowerCase() !==
      "inactive" &&
    String(property?.status || "active").toLowerCase() !== "inactive"
  );
}

function activeOwnerPropertyDetails(owner, condominiumId = null) {
  return (owner?.propertyDetails || []).filter((property) => {
    const id = propertyCondominiumId(property);
    return (
      id &&
      (!condominiumId || asString(id) === asString(condominiumId)) &&
      isOwnerPropertyActive(property, id)
    );
  });
}

function authorizedFamilyPropertyDetails(family) {
  return (family?.propertyDetails || []).filter((property) => {
    const familyStatus = String(
      property?.family_status || "authorized"
    ).toLowerCase();
    return propertyCondominiumId(property) && familyStatus === "authorized";
  });
}

function uniqueIds(values) {
  return [...new Set(values.filter(Boolean).map(asString))];
}

function activeOwnerCondominiumIds(owner) {
  return uniqueIds(
    activeOwnerPropertyDetails(owner).map((property) =>
      propertyCondominiumId(property)
    )
  );
}

async function activeFamilyCondominiumIds(family) {
  const familyIds = new Set(
    uniqueIds(
      authorizedFamilyPropertyDetails(family).map((property) =>
        propertyCondominiumId(property)
      )
    )
  );

  if (!family?.createdBy || familyIds.size === 0) {
    return [];
  }

  const owner = await Owner.findOne({
    _id: family.createdBy,
    organizationId: family.organizationId,
    status: "active",
  })
    .select("propertyDetails")
    .lean();

  return activeOwnerCondominiumIds(owner).filter((id) => familyIds.has(id));
}

async function isOwnerActiveInCondominium(
  ownerId,
  condominiumId,
  organizationId
) {
  if (
    !mongoose.Types.ObjectId.isValid(ownerId) ||
    !mongoose.Types.ObjectId.isValid(condominiumId)
  ) {
    return false;
  }

  const owner = await Owner.findOne({
    _id: ownerId,
    organizationId,
    status: "active",
    "propertyDetails.addressId": condominiumId,
  })
    .select("propertyDetails")
    .lean();

  return activeOwnerPropertyDetails(owner, condominiumId).length > 0;
}

function groupCondominiumOwners(ownerEntries, condominiumId) {
  const grouped = new Map();

  for (const entry of ownerEntries || []) {
    const owner = entry?.ownerId;
    const ownerId = owner?._id || owner;
    if (!ownerId || typeof owner !== "object") {
      continue;
    }

    const key = asString(ownerId);
    const propertyDetails = (owner.propertyDetails || []).filter(
      (property) =>
        asString(propertyCondominiumId(property)) === asString(condominiumId)
    );
    const hasInactiveAssociation =
      String(entry.status || "active").toLowerCase() === "inactive" ||
      propertyDetails.some(
        (property) =>
          String(property.status_property || "active").toLowerCase() ===
            "inactive" ||
          String(property.status || "active").toLowerCase() === "inactive"
      );

    const current = grouped.get(key);
    if (!current) {
      grouped.set(key, {
        ...entry,
        ownerId: {
          ...owner,
          propertyDetails,
        },
        status: hasInactiveAssociation ? "inactive" : "active",
      });
      continue;
    }

    if (hasInactiveAssociation) {
      current.status = "inactive";
    }
  }

  return [...grouped.values()];
}

async function setOwnerCondominiumStatus({
  condominiumId,
  ownerId,
  organizationId,
  status,
}) {
  const normalizedStatus = String(status || "").toLowerCase();
  if (!["active", "inactive"].includes(normalizedStatus)) {
    const error = new Error("Invalid owner condominium status");
    error.statusCode = 400;
    throw error;
  }

  if (
    !mongoose.Types.ObjectId.isValid(condominiumId) ||
    !mongoose.Types.ObjectId.isValid(ownerId)
  ) {
    const error = new Error("Invalid owner or condominium identifier");
    error.statusCode = 400;
    throw error;
  }

  const condoObjectId = new mongoose.Types.ObjectId(condominiumId);
  const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
  const session = await mongoose.startSession();
  let condominiumUpdated;

  try {
    await session.withTransaction(async () => {
      const ownerUpdated = await Owner.findOneAndUpdate(
        {
          _id: ownerObjectId,
          organizationId,
          "propertyDetails.addressId": condoObjectId,
        },
        {
          $set: {
            "propertyDetails.$[property].status_property": normalizedStatus,
          },
          $unset: { "propertyDetails.$[property].status": "" },
        },
        {
          arrayFilters: [{ "property.addressId": condoObjectId }],
          new: true,
          session,
        }
      );

      if (!ownerUpdated) {
        const error = new Error("Owner is not assigned to this condominium");
        error.statusCode = 404;
        throw error;
      }

      condominiumUpdated = await Condominium.findOneAndUpdate(
        {
          _id: condoObjectId,
          organizationId,
          $expr: {
            $anyElementTrue: {
              $map: {
                input: { $ifNull: ["$units_ownerId", []] },
                as: "ownerEntry",
                in: {
                  $or: [
                    { $eq: ["$$ownerEntry", ownerObjectId] },
                    { $eq: ["$$ownerEntry.ownerId", ownerObjectId] },
                  ],
                },
              },
            },
          },
        },
        [
          {
            $set: {
              units_ownerId: {
                $map: {
                  input: { $ifNull: ["$units_ownerId", []] },
                  as: "ownerEntry",
                  in: {
                    $cond: [
                      {
                        $or: [
                          { $eq: ["$$ownerEntry", ownerObjectId] },
                          { $eq: ["$$ownerEntry.ownerId", ownerObjectId] },
                        ],
                      },
                      { ownerId: ownerObjectId, status: normalizedStatus },
                      "$$ownerEntry",
                    ],
                  },
                },
              },
            },
          },
        ],
        { new: true, session }
      );

      if (!condominiumUpdated) {
        const error = new Error("Condominium or assigned owner not found");
        error.statusCode = 404;
        throw error;
      }

      if (normalizedStatus === "inactive") {
        const ownerUnits = (ownerUpdated.propertyDetails || []).filter(
          (property) =>
            String(propertyCondominiumId(property)) === String(condoObjectId) &&
            property.contextType === "CONDOMINIUM_UNIT" &&
            property.unitId
        );
        const ownerUnitIds = ownerUnits.map((property) => property.unitId);
        if (ownerUnitIds.length) {
          const otherOwners = await Owner.find({
            _id: { $ne: ownerObjectId },
            organizationId,
            status: "active",
            propertyDetails: {
              $elemMatch: {
                addressId: condoObjectId,
                unitId: { $in: ownerUnitIds },
                status_property: { $ne: "inactive" },
              },
            },
          })
            .select("propertyDetails")
            .session(session)
            .lean();
          const retainedUnitIds = new Set(
            otherOwners.flatMap((owner) =>
              (owner.propertyDetails || [])
                .filter(
                  (property) =>
                    String(propertyCondominiumId(property)) ===
                      String(condoObjectId) &&
                    String(
                      property.status_property || "active"
                    ).toLowerCase() !== "inactive"
                )
                .map((property) => String(property.unitId))
            )
          );
          const releasableUnits = ownerUnits.filter(
            (property) => !retainedUnitIds.has(String(property.unitId))
          );
          if (releasableUnits.length) {
            const released = await Condominium.updateOne(
              { _id: condoObjectId, organizationId },
              {
                $addToSet: {
                  availableUnits: {
                    $each: releasableUnits.map(
                      (property) => property.condominium_unit
                    ),
                  },
                },
                $set: { "units.$[unit].availability": "AVAILABLE" },
              },
              {
                session,
                arrayFilters: [
                  {
                    "unit._id": {
                      $in: releasableUnits.map((property) => property.unitId),
                    },
                  },
                ],
              }
            );
            if (released.matchedCount !== 1) {
              const error = new Error(
                "Inactive owner units could not be released"
              );
              error.statusCode = 409;
              throw error;
            }
          }
        }

        await Family.updateMany(
          {
            organizationId,
            createdBy: ownerObjectId,
            "propertyDetails.addressId": condoObjectId,
          },
          {
            $set: {
              "propertyDetails.$[property].family_status": "unauthorized",
            },
          },
          {
            arrayFilters: [{ "property.addressId": condoObjectId }],
            session,
          }
        );
      }
    });

    return condominiumUpdated;
  } finally {
    await session.endSession();
  }
}

module.exports = {
  activeFamilyCondominiumIds,
  activeOwnerCondominiumIds,
  activeOwnerPropertyDetails,
  authorizedFamilyPropertyDetails,
  groupCondominiumOwners,
  isOwnerActiveInCondominium,
  isOwnerPropertyActive,
  propertyCondominiumId,
  setOwnerCondominiumStatus,
};
