"use strict";

const Condominium = require("../models/condominio");
const Organization = require("../models/organization");
const Owner = require("../models/owners");
const { canAccessCondominium, hasPermission } = require("./authorization");

function forbidden(code = "IOT_FORBIDDEN") {
  const error = new Error("Not authorized to access this IoT resource");
  error.statusCode = 403;
  error.code = code;
  return error;
}

function notFound() {
  const error = new Error("IoT resource not found");
  error.statusCode = 404;
  error.code = "IOT_NOT_FOUND";
  return error;
}

function idEquals(left, right) {
  return Boolean(left && right && String(left) === String(right));
}

function activeOwnerUnitAssociations(owner, condominiumId, unitId) {
  return (owner?.propertyDetails || []).filter(
    (property) =>
      (property.contextType || "CONDOMINIUM_UNIT") === "CONDOMINIUM_UNIT" &&
      idEquals(property.addressId?._id || property.addressId, condominiumId) &&
      idEquals(property.unitId, unitId) &&
      String(property.status_property || "active").toLowerCase() !==
        "inactive" &&
      String(property.status || "active").toLowerCase() !== "inactive"
  );
}

function activePersonalResidences(owner) {
  return (owner?.propertyDetails || []).filter(
    (residence) =>
      residence.contextType === "PERSONAL_RESIDENCE" &&
      !residence.addressId &&
      String(residence.status_property || "active").toLowerCase() !== "inactive"
  );
}

class IoTAuthorizationService {
  constructor({
    CondominiumModel = Condominium,
    OrganizationModel = Organization,
    OwnerModel = Owner,
  } = {}) {
    this.CondominiumModel = CondominiumModel;
    this.OrganizationModel = OrganizationModel;
    this.OwnerModel = OwnerModel;
  }

  has(actor, permission) {
    return hasPermission(actor, permission);
  }

  async canCreateDevice(actor, scope, permission = "iot.create") {
    if (!actor || !this.has(actor, permission))
      throw forbidden("IOT_PERMISSION_DENIED");

    if (scope.scopeType === "PERSONAL_RESIDENCE") {
      if (actor.role !== "OWNER") {
        throw forbidden("IOT_PERSONAL_CONTEXT_REQUIRED");
      }
      const residence = activePersonalResidences(actor.account).find((item) =>
        idEquals(item._id, scope.residenceId)
      );
      if (!residence) throw notFound();
      return {
        scopeType: "PERSONAL_RESIDENCE",
        ownerId: actor.account._id,
        residenceId: residence._id,
      };
    }

    if (scope.scopeType === "CONDOMINIUM_UNIT") {
      if (actor.role !== "OWNER")
        throw forbidden("IOT_PRIVATE_UNIT_OWNER_REQUIRED");
      const condominium = await this.CondominiumModel.findOne({
        _id: scope.condominiumId,
        status: "active",
      })
        .select("organizationId units")
        .lean();
      const unit = condominium?.units?.find(
        (item) =>
          idEquals(item._id, scope.unitId) &&
          String(item.status || "active").toLowerCase() === "active"
      );
      if (!unit) throw notFound();
      const organization = await this.OrganizationModel.findOne({
        _id: condominium.organizationId,
        status: "active",
      })
        .select("_id")
        .lean();
      if (!organization) throw notFound();
      const owner = await this.OwnerModel.findOne({
        _id: actor.account._id,
        status: "active",
      })
        .select("organizationId propertyDetails")
        .lean();
      const associations = activeOwnerUnitAssociations(
        owner,
        condominium._id,
        unit._id
      );
      if (associations.length !== 1) throw notFound();
      if (
        owner.organizationId &&
        !idEquals(owner.organizationId, condominium.organizationId)
      ) {
        throw forbidden("IOT_TENANT_MISMATCH");
      }
      return {
        scopeType: "CONDOMINIUM_UNIT",
        organizationId: condominium.organizationId,
        condominiumId: condominium._id,
        unitId: unit._id,
      };
    }

    if (scope.scopeType === "COMMON_AREA") {
      return this.resolveCommonArea(actor, scope.condominiumId, permission);
    }

    throw forbidden("IOT_SCOPE_INVALID");
  }

  async resolveCommonArea(actor, condominiumId, permission) {
    if (!actor || !["ADMIN", "STAFF_ADMIN", "STAFF"].includes(actor.role)) {
      throw forbidden("IOT_COMMON_AREA_ADMIN_REQUIRED");
    }
    if (!this.has(actor, permission)) throw forbidden("IOT_PERMISSION_DENIED");

    const condominium = await this.CondominiumModel.findOne({
      _id: condominiumId,
      status: "active",
      organizationId: actor.organizationId,
    })
      .select("organizationId")
      .lean();
    if (!condominium || !canAccessCondominium(actor, condominium._id))
      throw notFound();

    const organization = await this.OrganizationModel.findOne({
      _id: condominium.organizationId,
      status: "active",
    })
      .select("_id")
      .lean();
    if (!organization) throw notFound();

    return {
      scopeType: "COMMON_AREA",
      organizationId: condominium.organizationId,
      condominiumId: condominium._id,
    };
  }

  async canViewDevice(actor, device) {
    return this.assertDevicePermission(actor, device, "iot.read");
  }

  async canControlDevice(actor, device) {
    return this.assertDevicePermission(actor, device, "iot.control");
  }

  async canUpdateDevice(actor, device) {
    return this.assertDevicePermission(actor, device, "iot.update");
  }

  async canDeleteDevice(actor, device) {
    return this.assertDevicePermission(actor, device, "iot.delete");
  }

  async canViewHistory(actor, device) {
    return this.assertDevicePermission(actor, device, "iot.history");
  }

  async assertDevicePermission(actor, device, permission) {
    if (!actor || !device || !this.has(actor, permission))
      throw forbidden("IOT_PERMISSION_DENIED");

    if (device.scopeType === "PERSONAL_RESIDENCE") {
      if (actor.role !== "OWNER") throw notFound();
      const residence = activePersonalResidences(actor.account).find((item) =>
        idEquals(item._id, device.residenceId)
      );
      if (!residence || !idEquals(device.ownerId, actor.account._id))
        throw notFound();
      return true;
    }

    if (device.scopeType === "CONDOMINIUM_UNIT") {
      if (actor.role !== "OWNER") throw notFound();
      const condominium = await this.CondominiumModel.findOne({
        _id: device.condominiumId,
        organizationId: device.organizationId,
        status: "active",
      })
        .select("_id units")
        .lean();
      const organization = await this.OrganizationModel.findOne({
        _id: device.organizationId,
        status: "active",
      })
        .select("_id")
        .lean();
      if (!condominium || !organization) throw notFound();
      const unit = condominium.units?.find(
        (item) => idEquals(item._id, device.unitId) &&
          String(item.status || "active").toLowerCase() === "active"
      );
      if (!unit) throw notFound();
      const owner = await this.OwnerModel.findOne({
        _id: actor.account._id,
        status: "active",
      })
        .select("organizationId propertyDetails")
        .lean();
      const associations = activeOwnerUnitAssociations(
        owner,
        device.condominiumId,
        device.unitId
      );
      if (associations.length !== 1) throw notFound();
      if (
        owner.organizationId &&
        !idEquals(owner.organizationId, device.organizationId)
      ) {
        throw notFound();
      }
      return true;
    }

    if (device.scopeType === "COMMON_AREA") {
      await this.resolveCommonArea(actor, device.condominiumId, permission);
      if (!idEquals(device.organizationId, actor.organizationId))
        throw notFound();
      return true;
    }

    throw notFound();
  }
}

module.exports = {
  IoTAuthorizationService,
  activeOwnerUnitAssociations,
  activePersonalResidences,
  forbidden,
  notFound,
};
