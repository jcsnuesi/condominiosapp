"use strict";

const Organization = require("../models/organization");
const AccessGrant = require("../models/accessGrant");
const Admin = require("../models/admin");
const StaffAdmin = require("../models/staff_admin");
const Staff = require("../models/staff");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Superuser = require("../models/super_user");
const { PERMISSIONS } = require("./permissionCatalog");

const ACCOUNT_MODELS = Object.freeze({
  SUPERUSER: Superuser,
  ADMIN: Admin,
  STAFF_ADMIN: StaffAdmin,
  STAFF: Staff,
  OWNER: Owner,
  FAMILY: Family,
});

const SUBJECT_MODELS = Object.freeze({
  ADMIN: "Admin",
  STAFF_ADMIN: "Staff_Admin",
  STAFF: "Staff",
});

const SELF_SERVICE_PERMISSIONS = Object.freeze({
  OWNER: [
    "dashboard.read", "condominiums.read", "bookings.read", "bookings.create",
    "bookings.update", "documents.read", "documents.create", "inquiries.read",
    "inquiries.create", "inquiries.update", "finance.read", "str.read", "str.update",
  ],
  FAMILY: [
    "dashboard.read", "condominiums.read", "bookings.read", "bookings.create",
    "documents.read", "inquiries.read", "inquiries.create",
  ],
});

function unique(values) {
  return [...new Set((values || []).filter(Boolean).map((value) => String(value).toLowerCase()))];
}

function evaluatePermissions(policyPermissions, allow = [], deny = []) {
  const denied = new Set(unique(deny));
  return unique([...(policyPermissions || []), ...allow]).filter((permission) => !denied.has(permission));
}

function canAccessCondominium(context, condominiumId) {
  if (!context || !condominiumId) return false;
  if (context.scope.mode === "ALL") return true;
  return context.scope.condominiumIds.map(String).includes(String(condominiumId));
}

function hasPermission(context, permission) {
  return Boolean(context?.permissions?.includes(String(permission || "").toLowerCase()));
}

function publicAccessContext(context) {
  if (!context) return null;
  return {
    organization: context.organization
      ? { id: context.organization._id, name: context.organization.name, status: context.organization.status }
      : null,
    isOwnerAdmin: Boolean(context.isOwnerAdmin),
    permissions: context.permissions,
    scope: context.scope,
  };
}

async function resolveAccessContext(userPayload) {
  const role = String(userPayload?.role || "").toUpperCase();
  const AccountModel = ACCOUNT_MODELS[role];
  if (!AccountModel || !userPayload?.sub) return null;

  const account = await AccountModel.findById(userPayload.sub).lean();
  if (!account || String(account.status || "active").toLowerCase() !== "active") return null;

  if (role === "SUPERUSER") {
    return {
      account,
      role,
      organization: null,
      organizationId: null,
      isOwnerAdmin: false,
      permissions: [],
      scope: { mode: "ALL", condominiumIds: [] },
    };
  }

  const organizationId = account.organizationId || userPayload.organizationId;
  if (!organizationId) return null;
  const organization = await Organization.findOne({ _id: organizationId, status: "active" }).lean();
  if (!organization) return null;

  const propertyScope = unique((account.propertyDetails || []).map((property) => property.addressId));
  if (role === "OWNER" || role === "FAMILY") {
    return {
      account,
      role,
      organization,
      organizationId: organization._id,
      isOwnerAdmin: false,
      permissions: SELF_SERVICE_PERMISSIONS[role],
      scope: { mode: "SELECTED", condominiumIds: propertyScope },
    };
  }

  const isOwnerAdmin = role === "ADMIN" && String(organization.ownerAdminId) === String(account._id);
  if (isOwnerAdmin) {
    return {
      account,
      role,
      organization,
      organizationId: organization._id,
      isOwnerAdmin: true,
      permissions: [...PERMISSIONS],
      scope: { mode: "ALL", condominiumIds: [] },
    };
  }

  const grant = await AccessGrant.findOne({
    organizationId: organization._id,
    subjectModel: SUBJECT_MODELS[role],
    subjectId: account._id,
  }).populate({ path: "policyIds", match: { status: "active" }, select: "permissions" }).lean();

  const policyPermissions = (grant?.policyIds || []).flatMap((policy) => policy.permissions || []);
  return {
    account,
    role,
    organization,
    organizationId: organization._id,
    isOwnerAdmin: false,
    permissions: evaluatePermissions(policyPermissions, grant?.overrides?.allow, grant?.overrides?.deny),
    scope: grant?.scope || { mode: "SELECTED", condominiumIds: [] },
    grant: grant || null,
  };
}

module.exports = {
  ACCOUNT_MODELS,
  SUBJECT_MODELS,
  evaluatePermissions,
  canAccessCondominium,
  hasPermission,
  publicAccessContext,
  resolveAccessContext,
};
