"use strict";

const Condominium = require("../models/condominio");
const Owner = require("../models/owners");
const apiResponse = require("../service/apiResponse");
const { canAccessCondominium } = require("../service/authorization");
const { hasPaymentAccess, isOwnerPaymentRole } = require("./payment")._helpers;

function scopedCondominiums(req) {
  return req.auth.scope?.mode === "ALL"
    ? {}
    : { _id: { $in: req.auth.scope?.condominiumIds || [] } };
}

module.exports = {
  options: async function (req, res) {
    if (!hasPaymentAccess(req)) {
      return apiResponse.failure(res, 403, { message: "No autorizado" }, "FORBIDDEN");
    }
    try {
      const organizationId = req.auth.organizationId;
      const owners = await Owner.find({
        organizationId,
        ...(isOwnerPaymentRole(req) ? { _id: req.user.sub } : {}),
      }).select("propertyDetails").lean();
      const assignments = owners.flatMap((owner) => owner.propertyDetails || [])
        .filter((property) => property.addressId && property.status_property !== "inactive");
      const condominiums = await Condominium.find({
        organizationId,
        ...scopedCondominiums(req),
        ...(isOwnerPaymentRole(req)
          ? { _id: { $in: assignments.map((property) => property.addressId)
            .filter((id) => canAccessCondominium(req.auth, id)) } }
          : {}),
      }).select("alias").sort({ alias: 1 }).lean();
      return apiResponse.success(res, 200, condominiums.map((condominium) => ({
        value: String(condominium._id),
        label: condominium.alias,
        units: [...new Set(assignments
          .filter((property) => String(property.addressId) === String(condominium._id))
          .map((property) => property.condominium_unit).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
      })), "PAYMENT_MONITOR_OPTIONS");
    } catch (error) {
      return apiResponse.failure(res, 500, { message: "No se pudieron cargar las propiedades" }, "MONITOR_ERROR");
    }
  },

};
