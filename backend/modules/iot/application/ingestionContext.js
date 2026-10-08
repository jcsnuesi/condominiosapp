"use strict";
const Organization = require("../../../models/organization");
const Condominium = require("../../../models/condominio");
const Owner = require("../../../models/owners");

async function contextIsActive(context, session) {
  if (context.scopeType === "PERSONAL_RESIDENCE") {
    const owner = await Owner.findOne({ _id: context.ownerId, status: "active", emailVerified: true }).select("propertyDetails").session(session).lean();
    return Boolean(owner?.propertyDetails?.some((item) => String(item._id) === String(context.residenceId) &&
      item.contextType === "PERSONAL_RESIDENCE" && !item.addressId &&
      String(item.status_property || "active").toLowerCase() !== "inactive"));
  }
  const organization = await Organization.findOne({ _id: context.organizationId, status: "active" }).select("_id").session(session).lean();
  const condo = await Condominium.findOne({ _id: context.condominiumId, organizationId: context.organizationId, status: "active" }).select("units").session(session).lean();
  if (!organization || !condo) return false;
  return context.scopeType === "COMMON_AREA" || (context.scopeType === "CONDOMINIUM_UNIT" &&
    Boolean(condo.units?.some((item) => String(item._id) === String(context.unitId) && String(item.status || "active").toLowerCase() === "active")));
}

module.exports = { contextIsActive };
