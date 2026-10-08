"use strict";
const PlatformUser = require("../models/platformUser");
require("../models/platformPolicy");
const { PLATFORM_PERMISSIONS, platformScopeAllows } = require("./platformPermissions");

async function resolvePlatformContext(payload) {
  const account = await PlatformUser.findById(payload.sub).populate({ path: "policyIds", match: { status: "active" }, select: "permissions" }).lean();
  if (!account || account.status !== "active" || account.role !== payload.role) return null;
  const isAdmin = account.role === "PLATFORM_ADMIN";
  return {
    account, role: account.role, contextType: "PLATFORM", isPlatform: true,
    organization: null, organizationId: null, isOwnerAdmin: false,
    permissions: isAdmin ? [...PLATFORM_PERMISSIONS] : [...new Set(account.policyIds.flatMap(p => p.permissions))],
    scope: isAdmin ? { mode: "ALL", organizationIds: [], ownerIds: [], condominiumIds: [] } : { ...account.scope, condominiumIds: [] },
  };
}

function requirePlatform(permission) {
  return (req, res, next) => {
    if (!req.auth?.isPlatform || !req.auth.permissions.includes(permission)) {
      return res.status(403).send({ status: "error", code: "PLATFORM_PERMISSION_DENIED", message: "No tienes permiso para esta operación" });
    }
    next();
  };
}

function requireTarget(req, type, id) {
  if (!platformScopeAllows(req.auth.scope, type, id)) {
    throw Object.assign(new Error("La cuenta está fuera de tu alcance"), { statusCode: 403 });
  }
}
module.exports = { resolvePlatformContext, requirePlatform, requireTarget };
