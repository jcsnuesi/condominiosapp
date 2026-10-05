"use strict";

const Organization = require("../models/organization");
const AccessGrant = require("../models/accessGrant");
const Admin = require("../models/admin");
const StaffAdmin = require("../models/staff_admin");
const Staff = require("../models/staff");
const Owner = require("../models/owners");
const Family = require("../models/family");
const { PERMISSIONS } = require("./permissionCatalog");
const {
  activeFamilyCondominiumIds,
  activeOwnerCondominiumIds,
} = require("./residentPropertyAccess");

const ACCOUNT_MODELS = Object.freeze({
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
    "schedules.read", "schedules.create", "schedules.update",
    "maintenance.read", "maintenance.update",
    "vendors.read", "vendors.create", "vendors.update",
    "dashboard.read",
    "condominiums.read",
    "bookings.read",
    "bookings.create",
    "bookings.update",
    "documents.read",
    "documents.create",
    "inquiries.read",
    "inquiries.create",
    "inquiries.update",
    "finance.read",
    "str.read",
    "str.update",
    "iot.read",
    "iot.create",
    "iot.update",
    "iot.delete",
    "iot.control",
    "iot.history",
  ],
  FAMILY: [
    "dashboard.read",
    "condominiums.read",
    "bookings.read",
    "bookings.create",
    "documents.read",
    "inquiries.read",
    "inquiries.create",
  ],
});

function unique(values) {
  return [
    ...new Set(
      (values || []).filter(Boolean).map((value) => String(value).toLowerCase())
    ),
  ];
}

function evaluatePermissions(policyPermissions, allow = [], deny = []) {
  const denied = new Set(unique(deny));
  return unique([...(policyPermissions || []), ...allow]).filter(
    (permission) => !denied.has(permission)
  );
}

function canAccessCondominium(context, condominiumId) {
  if (!context || !condominiumId) return false;
  if (context.scope.mode === "ALL") return true;
  return context.scope.condominiumIds
    .map(String)
    .includes(String(condominiumId));
}

function hasPermission(context, permission) {
  return Boolean(
    context?.permissions?.includes(String(permission || "").toLowerCase())
  );
}

function publicAccessContext(context) {
  if (!context) return null;
  return {
    organization: context.organization
      ? {
          id: context.organization._id,
          name: context.organization.name,
          status: context.organization.status,
        }
      : null,
    isOwnerAdmin: Boolean(context.isOwnerAdmin),
    onboardingRequired: Boolean(context.isOwnerAdmin && context.organization?.registrationSource === "SELF_SERVICE" && !context.organization?.onboardingCompletedAt),
    permissions: context.permissions,
    scope: context.scope,
  };
}

function buildPersonalOwnerAccessContext(account) {
  if (
    String(account?.role || "").toUpperCase() !== "OWNER" ||
    String(account?.status || "active").toLowerCase() !== "active" ||
    account?.emailVerified !== true
  ) {
    return null;
  }

  const residenceIds = (account.propertyDetails || [])
    .filter(
      (residence) =>
        residence?.contextType === "PERSONAL_RESIDENCE" &&
        !residence.addressId &&
        String(residence.status_property || "active").toLowerCase() !==
          "inactive"
    )
    .map((residence) => String(residence._id || ""))
    .filter(Boolean);

  if (residenceIds.length === 0) return null;

  return {
    account,
    role: "OWNER",
    contextType: "PERSONAL_OWNER",
    organization: null,
    organizationId: null,
    isOwnerAdmin: false,
    permissions: [
      "schedules.read", "schedules.create", "schedules.update",
      "maintenance.read", "maintenance.update",
      "vendors.read", "vendors.create", "vendors.update",
      "iot.read",
      "iot.create",
      "iot.update",
      "iot.delete",
      "iot.control",
      "iot.history",
    ],
    scope: { mode: "PERSONAL", condominiumIds: [], residenceIds },
  };
}

async function resolveAccessContext(userPayload) {
  const role = String(userPayload?.role || "").toUpperCase();
  const AccountModel = ACCOUNT_MODELS[role];
  if (!AccountModel || !userPayload?.sub) return null;

  const account = await AccountModel.findById(userPayload.sub).lean();
  if (!account || String(account.status || "active").toLowerCase() !== "active")
    return null;

  const organizationId =
    account.organizationId ||
    (role === "OWNER" ? null : userPayload.organizationId);
  if (!organizationId && role === "OWNER") {
    return buildPersonalOwnerAccessContext(account);
  }
  if (!organizationId) return null;
  const organization = await Organization.findOne({
    _id: organizationId,
    status: "active",
  }).lean();
  if (!organization) return null;

  if (role === "OWNER" || role === "FAMILY") {
    const propertyScope =
      role === "OWNER"
        ? activeOwnerCondominiumIds(account)
        : await activeFamilyCondominiumIds(account);
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

  const isOwnerAdmin =
    role === "ADMIN" &&
    String(organization.ownerAdminId) === String(account._id);
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
  })
    .populate({
      path: "policyIds",
      match: { status: "active" },
      select: "permissions",
    })
    .lean();

  const policyPermissions = (grant?.policyIds || []).flatMap(
    (policy) => policy.permissions || []
  );
  return {
    account,
    role,
    organization,
    organizationId: organization._id,
    isOwnerAdmin: false,
    permissions: evaluatePermissions(
      policyPermissions,
      grant?.overrides?.allow,
      grant?.overrides?.deny
    ),
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
  buildPersonalOwnerAccessContext,
  resolveAccessContext,
};
