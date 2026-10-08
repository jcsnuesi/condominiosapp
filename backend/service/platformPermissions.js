"use strict";

const PLATFORM_PERMISSIONS = Object.freeze([
  "platform.kpis.read", "platform.accounts.read", "platform.accounts.update",
  "platform.memberships.read", "platform.memberships.manage",
  "platform.policies.read", "platform.policies.manage",
  "platform.supervisors.read", "platform.supervisors.manage",
  "platform.access.read", "platform.access.manage", "platform.audit.read",
  "platform.billing.read", "platform.billing.manage", "platform.support.read", "platform.support.manage",
  "platform.communications.read", "platform.communications.manage", "platform.operations.read", "platform.operations.manage",
  "platform.data.read", "platform.data.manage",
]);

function platformScopeAllows(scope, type, id) {
  if (!scope || !["ORGANIZATION", "PERSONAL_OWNER"].includes(type)) return false;
  return scope.mode === "ALL" || (scope[type === "ORGANIZATION" ? "organizationIds" : "ownerIds"] || []).map(String).includes(String(id));
}

function assertDelegation(actor, permissions, scope) {
  if (permissions.some(p => !PLATFORM_PERMISSIONS.includes(p) || !actor.permissions.includes(p))) {
    throw Object.assign(new Error("No puedes delegar permisos que no tienes"), { statusCode: 403 });
  }
  if (!["ALL", "SELECTED"].includes(scope?.mode) || !Array.isArray(scope.organizationIds) || !Array.isArray(scope.ownerIds)) {
    throw Object.assign(new Error("Alcance inválido"), { statusCode: 400 });
  }
  if (actor.scope.mode !== "ALL" && (scope.mode === "ALL" ||
      scope.organizationIds.some(id => !platformScopeAllows(actor.scope, "ORGANIZATION", id)) ||
      scope.ownerIds.some(id => !platformScopeAllows(actor.scope, "PERSONAL_OWNER", id)))) {
    throw Object.assign(new Error("No puedes ampliar tu alcance al delegar"), { statusCode: 403 });
  }
}

module.exports = { PLATFORM_PERMISSIONS, platformScopeAllows, assertDelegation };
