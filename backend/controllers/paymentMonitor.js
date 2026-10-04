"use strict";

const Condominium = require("../models/condominio");
const Owner = require("../models/owners");
const Invoice = require("../models/invoice");
const { paymentMonitorPipeline } = require("../service/paymentMonitorQuery");
const apiResponse = require("../service/apiResponse");
const { canAccessCondominium } = require("../service/authorization");
const { hasPaymentAccess, isOwnerPaymentRole, buildTransactionFilters } = require("./payment")._helpers;

function scopedCondominiums(req) {
  return req.auth.scope?.mode === "ALL"
    ? {}
    : { _id: { $in: req.auth.scope?.condominiumIds || [] } };
}

module.exports = {
  invoices: async function (req, res) {
    if (!hasPaymentAccess(req)) {
      return apiResponse.failure(res, 403, { message: "No autorizado" }, "FORBIDDEN");
    }
    const { filters, error } = buildTransactionFilters(req);
    if (error) {
      return apiResponse.failure(res, 400, { message: error }, "VALIDATION_ERROR");
    }
    if (req.query.condominiumId && !canAccessCondominium(req.auth, req.query.condominiumId)) {
      return apiResponse.failure(res, 403, { message: "Propiedad fuera del alcance autorizado" }, "FORBIDDEN");
    }
    const page = Math.max(Math.floor(Number(req.query.page) || 1), 1);
    const limit = Math.min(Math.max(Math.floor(Number(req.query.limit) || 20), 1), 500);
    try {
      const [result] = await Invoice.aggregate(paymentMonitorPipeline(req, filters, page, limit));
      return apiResponse.success(res, 200, {
        page, limit, docs: result?.docs || [], total: result?.count?.[0]?.total || 0,
      }, "PAYMENT_MONITOR_INVOICES_LISTED");
    } catch (error) {
      return apiResponse.failure(res, 500, { message: "No se pudieron cargar las facturas del monitor" }, "MONITOR_ERROR");
    }
  },

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
