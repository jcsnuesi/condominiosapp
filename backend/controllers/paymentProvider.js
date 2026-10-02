"use strict";

const mongoose = require("mongoose");
const PaymentProvider = require("../models/paymentProvider");
const apiResponse = require("../service/apiResponse");
const { hasPaymentAccess, isPrivilegedPaymentRole } = require("./payment")._helpers;

const defaults = [
  { name: "AZUL", code: "AZUL" },
  { name: "CARDNET", code: "CARDNET" },
  { name: "Toke", code: "TOKE" },
  { name: "Transferencia", code: "TRANSFERENCIA" },
].map((provider) => ({ ...provider, builtIn: true }));

function normalizeName(value) {
  return typeof value === "string" ? value.normalize("NFKC").trim().replace(/\s+/g, " ") : "";
}

module.exports = {
  list: async (req, res) => {
    if (!hasPaymentAccess(req) || !req.auth?.organizationId) {
      return apiResponse.failure(res, 403, { message: "No autorizado" }, "FORBIDDEN");
    }
    try {
      const providers = await PaymentProvider.find({ organizationId: req.auth.organizationId })
        .select("name code").sort({ name: 1 }).lean();
      return apiResponse.success(res, 200, [...defaults, ...providers.map((provider) => ({ ...provider, builtIn: false }))], "PAYMENT_PROVIDERS_LISTED");
    } catch (error) {
      return apiResponse.failure(res, 500, { message: "No se pudieron cargar los proveedores" }, "PROVIDERS_ERROR");
    }
  },
  create: async (req, res) => {
    if (!isPrivilegedPaymentRole(req) || !req.auth?.organizationId) {
      return apiResponse.failure(res, 403, { message: "No autorizado para administrar proveedores" }, "FORBIDDEN");
    }
    const name = normalizeName(req.body?.name);
    const code = name.toUpperCase();
    if (!name || code.length > 80 || /[\p{Cc}\p{Cf}]/u.test(name)) {
      return apiResponse.failure(res, 400, { message: "Ingrese un nombre de 1 a 80 caracteres" }, "VALIDATION_ERROR");
    }
    if (defaults.some((provider) => provider.code === code)) {
      return apiResponse.failure(res, 409, { message: "El proveedor ya existe" }, "PROVIDER_EXISTS");
    }
    try {
      const provider = await PaymentProvider.create({ organizationId: req.auth.organizationId, name, code });
      return apiResponse.success(res, 201, { _id: provider._id, name, code, builtIn: false }, "PAYMENT_PROVIDER_CREATED");
    } catch (error) {
      return apiResponse.failure(res, error.code === 11000 ? 409 : 500,
        { message: error.code === 11000 ? "El proveedor ya existe" : "No se pudo crear el proveedor" }, "PROVIDER_CREATE_FAILED");
    }
  },
  remove: async (req, res) => {
    if (!isPrivilegedPaymentRole(req) || !req.auth?.organizationId) {
      return apiResponse.failure(res, 403, { message: "No autorizado para administrar proveedores" }, "FORBIDDEN");
    }
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      return apiResponse.failure(res, 400, { message: "Proveedor inválido" }, "VALIDATION_ERROR");
    }
    try {
      const provider = await PaymentProvider.findOneAndDelete({ _id: req.params.id, organizationId: req.auth.organizationId });
      if (!provider) return apiResponse.failure(res, 404, { message: "Proveedor no encontrado" }, "NOT_FOUND");
      // Transactions retain their provider code for historical reporting.
      return apiResponse.success(res, 200, { _id: provider._id }, "PAYMENT_PROVIDER_DELETED");
    } catch (error) {
      return apiResponse.failure(res, 500, { message: "No se pudo eliminar el proveedor" }, "PROVIDER_DELETE_FAILED");
    }
  },
};
