"use strict";

const mongoose = require("mongoose");
const Condominium = require("../models/condominio");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Staff = require("../models/staff");
const {
  activeFamilyCondominiumIds,
  activeOwnerCondominiumIds,
  activeOwnerPropertyDetails,
  authorizedFamilyPropertyDetails,
} = require("./residentPropertyAccess");

const ADMIN_ROLES = new Set(["ADMIN", "STAFF_ADMIN", "STAFF"]);
const RESIDENT_ROLES = new Set(["OWNER", "FAMILY"]);

function normalizeRole(role) {
  return String(role || "")
    .toUpperCase()
    .replace(/^ROLE_/, "");
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function asString(value) {
  return value === null || value === undefined ? "" : String(value);
}

function roleToModel(role) {
  return {
    ADMIN: "Admin",
    STAFF_ADMIN: "Staff_Admin",
    STAFF: "Staff",
    OWNER: "Owner",
    FAMILY: "Family",
  }[normalizeRole(role)] || null;
}

function isAdminRole(role) {
  return ADMIN_ROLES.has(normalizeRole(role));
}

function isResidentRole(role) {
  return RESIDENT_ROLES.has(normalizeRole(role));
}

function hasSelectedAccessScope(user) {
  return (user?.accessScope?.mode || user?.accessScope?.type) === "SELECTED";
}

function creatorIdsForUser(user) {
  return [...new Set([asString(user?.sub), asString(user?.createdBy)].filter(Boolean))];
}

function isAggregateIdentifierForUser(user, identifier) {
  return creatorIdsForUser(user).includes(asString(identifier));
}

function boundedPagination(page, limit, maxLimit = 100) {
  return {
    page: Math.max(1, Number.parseInt(page, 10) || 1),
    limit: Math.min(maxLimit, Math.max(1, Number.parseInt(limit, 10) || 10)),
  };
}

async function getAccessibleCondominiumIds(user) {
  const role = normalizeRole(user?.role);
  if (!user?.sub || !role) return [];

  if (role === "ADMIN") {
    const filter = user.organizationId
      ? { organizationId: user.organizationId }
      : { createdBy: user.sub };
    if (hasSelectedAccessScope(user)) {
      filter._id = { $in: user.accessScope.condominiumIds || [] };
    }
    const rows = await Condominium.find(filter).select("_id").lean();
    return rows.map((row) => asString(row._id));
  }

  if (role === "STAFF") {
    const staff = await Staff.findById(user.sub).select("condo_id createdBy organizationId").lean();
    if (hasSelectedAccessScope(user)) {
      return (user.accessScope.condominiumIds || []).map(asString);
    }
    if (staff?.condo_id) return [asString(staff.condo_id)];
    const ownerId = staff?.createdBy || user.createdBy;
    const rows = ownerId
      ? await Condominium.find({ createdBy: ownerId }).select("_id").lean()
      : [];
    return rows.map((row) => asString(row._id));
  }

  if (role === "STAFF_ADMIN") {
    if (hasSelectedAccessScope(user)) {
      return (user.accessScope.condominiumIds || []).map(asString);
    }
    if (user.organizationId) {
      const rows = await Condominium.find({ organizationId: user.organizationId }).select("_id").lean();
      return rows.map((row) => asString(row._id));
    }
    const rows = user.createdBy
      ? await Condominium.find({ createdBy: user.createdBy }).select("_id").lean()
      : [];
    return rows.map((row) => asString(row._id));
  }

  if (role === "OWNER") {
    const owner = await Owner.findById(user.sub).select("propertyDetails").lean();
    return activeOwnerCondominiumIds(owner);
  }

  if (role === "FAMILY") {
    const family = await Family.findById(user.sub)
      .select("propertyDetails createdBy organizationId")
      .lean();
    return activeFamilyCondominiumIds(family);
  }

  return [];
}

async function canAccessCondominium(user, condominiumId) {
  if (!isValidObjectId(condominiumId)) return false;
  const accessibleIds = await getAccessibleCondominiumIds(user);
  return accessibleIds.includes(asString(condominiumId));
}

async function getResidentPropertyDetails(user) {
  const role = normalizeRole(user?.role);
  const Model = role === "OWNER" ? Owner : role === "FAMILY" ? Family : null;
  if (!Model || !user?.sub) return [];
  const record = await Model.findById(user.sub)
    .select("propertyDetails createdBy organizationId")
    .lean();

  if (role === "OWNER") {
    return activeOwnerPropertyDetails(record);
  }

  const accessibleIds = new Set(await activeFamilyCondominiumIds(record));
  return authorizedFamilyPropertyDetails(record).filter((property) =>
    accessibleIds.has(asString(property.addressId))
  );
}

async function getResidentUnits(user) {
  return (await getResidentPropertyDetails(user))
    .map((item) => item.condominium_unit || item.unit)
    .filter(Boolean);
}

async function canUseUnitInCondominium(user, condominiumId, unit) {
  return (await getResidentPropertyDetails(user)).some(
    (item) =>
      asString(item.addressId) === asString(condominiumId) &&
      String(item.condominium_unit || item.unit || "") === String(unit || "")
  );
}

async function buildNotificationFilter(user, condominiumIds) {
  const filter = {
    ...(user?.organizationId ? { organizationId: user.organizationId } : {}),
    condominiumId: { $in: condominiumIds },
    isActive: true,
    isDeleted: false,
    publishedAt: { $lte: new Date() },
    $and: [{ $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] }],
  };
  if (isAdminRole(user?.role)) return filter;

  const role = normalizeRole(user?.role);
  const units = await getResidentUnits(user);
  filter.$and.push({
    $or: [
      { targetAudience: "all" },
      ...(role === "OWNER" ? [{ targetAudience: "owners" }] : []),
      ...(role === "FAMILY" ? [{ targetAudience: "family" }] : []),
      { targetAudience: "specific", specificRecipients: user.sub },
      ...(units.length ? [{ targetAudience: "units", targetUnits: { $in: units } }] : []),
    ],
  });
  return filter;
}

async function resolveRequestedCondominiumIds(user, identifier) {
  if (!isValidObjectId(identifier)) return null;
  const accessibleIds = await getAccessibleCondominiumIds(user);
  const requested = asString(identifier);

  if (accessibleIds.includes(requested)) return [requested];
  if (creatorIdsForUser(user).includes(requested)) return accessibleIds;
  return [];
}

async function buildInquiryFilter(user, identifier) {
  const condominiumIds = await resolveRequestedCondominiumIds(user, identifier);
  if (condominiumIds === null) return { error: "invalid-id" };
  const isAuthorizedAggregateRequest = isAggregateIdentifierForUser(
    user,
    identifier
  );
  if (!condominiumIds.length && !isAuthorizedAggregateRequest) {
    return { error: "forbidden" };
  }

  const filter = {
    ...(user?.organizationId ? { organizationId: user.organizationId } : {}),
    condominiumId: { $in: condominiumIds },
    isActive: true,
  };
  if (isResidentRole(user?.role)) {
    filter.createdBy = { $in: creatorIdsForUser(user) };
  }
  return { filter, condominiumIds };
}

async function canAccessInquiry(user, inquiry) {
  if (
    !inquiry ||
    (user?.organizationId && asString(inquiry.organizationId) !== asString(user.organizationId)) ||
    !(await canAccessCondominium(user, inquiry.condominiumId))
  ) {
    return false;
  }
  if (isAdminRole(user?.role)) return true;
  return creatorIdsForUser(user).includes(asString(inquiry.createdBy));
}

module.exports = {
  asString,
  boundedPagination,
  buildInquiryFilter,
  buildNotificationFilter,
  canAccessCondominium,
  canAccessInquiry,
  canUseUnitInCondominium,
  creatorIdsForUser,
  getAccessibleCondominiumIds,
  getResidentUnits,
  isAdminRole,
  isAggregateIdentifierForUser,
  isResidentRole,
  isValidObjectId,
  normalizeRole,
  resolveRequestedCondominiumIds,
  roleToModel,
};
