"use strict";

const {
  canAccessCondominium,
  hasPermission,
} = require("../service/authorization");

const ROUTE_MODULES = [
  [/^\/(?:api\/)?payments(?:\/|$)/i, "finance"],
  [
    /staffs-admin|create-staff-admin|update-staff-admin|delete-staff-admin/i,
    "users",
  ],
  [/condominio|condominium|propert/i, "condominiums"],
  [/owner|partner|family/i, "owners"],
  [/staff|personnel/i, "staff"],
  [/reserve|booking|guest/i, "bookings"],
  [/docs|document/i, "documents"],
  [/inquir/i, "inquiries"],
  [/\bstr\b|rental|ical/i, "str"],
  [/invoice|payment|cxc|finance/i, "finance"],
  [/notification|communication|whatsapp/i, "communications"],
  [/\/iot\//i, "iot"],
  [/dashboard|card|start|home/i, "dashboard"],
];

const METHOD_ACTION = Object.freeze({
  GET: "read",
  POST: "create",
  PUT: "update",
  PATCH: "update",
  DELETE: "delete",
});
const SELF_SERVICE_PATHS = [
  /^\/auth\/me(?:\/password)?$/,
  /^\/update-password$/,
  /^\/verify-password-staff$/,
];

function enforceAdministrativePermission(req, res, next) {
  const role = String(req.auth?.role || "").toUpperCase();
  if (
    !["STAFF_ADMIN", "STAFF"].includes(role) ||
    SELF_SERVICE_PATHS.some((pattern) => pattern.test(req.path))
  ) {
    return next();
  }
  const moduleMatch = ROUTE_MODULES.find(([pattern]) => pattern.test(req.path));
  const isBankUpdate = req.method === "POST" && /^\/(?:api\/)?payments\/(?:receipts\/[^/]+\/(?:confirm|retry)|statements\/[^/]+\/(?:commit|retry))$/.test(req.path);
  const action = isBankUpdate ? "update" : METHOD_ACTION[req.method];
  if (!moduleMatch || !action) {
    return res.status(403).send({
      status: "forbidden",
      code: "AUTH_PERMISSION_MAPPING_MISSING",
      message: "This administrative route has no delegated permission mapping",
    });
  }
  const routePath = req.path || "";
  const permission =
    moduleMatch[1] === "iot" && /\/commands\/?$/i.test(routePath)
      ? "iot.control"
      : moduleMatch[1] === "iot" &&
        /\/(history|events|acknowledge)\/?$/i.test(routePath)
      ? "iot.history"
      : `${moduleMatch[1]}.${action}`;
  if (!hasPermission(req.auth, permission)) {
    return res.status(403).send({
      status: "forbidden",
      code: "AUTH_PERMISSION_DENIED",
      message: `Missing permission: ${permission}`,
    });
  }
  const condominiumId =
    req.body?.condominiumId ||
    req.body?.condoId ||
    req.body?.condo_id ||
    req.body?.addressId ||
    req.params?.condoId ||
    req.query?.condominiumId ||
    req.query?.condoId;
  if (condominiumId && !canAccessCondominium(req.auth, condominiumId)) {
    return res.status(403).send({
      status: "forbidden",
      code: "AUTH_RESOURCE_SCOPE_DENIED",
      message: "The condominium is outside the assigned scope",
    });
  }
  next();
}

function requirePermission(permission, options = {}) {
  return function permissionMiddleware(req, res, next) {
    if (!req.auth || !hasPermission(req.auth, permission)) {
      return res.status(403).send({
        status: "forbidden",
        code: "AUTH_PERMISSION_DENIED",
        message: `Missing permission: ${permission}`,
      });
    }

    const condominiumId = options.getCondominiumId?.(req);
    if (condominiumId && !canAccessCondominium(req.auth, condominiumId)) {
      return res.status(403).send({
        status: "forbidden",
        code: "AUTH_RESOURCE_SCOPE_DENIED",
        message: "The condominium is outside the assigned scope",
      });
    }

    const scopeMode = req.auth.scope.mode || req.auth.scope.type;
    if (options.organizationWide && scopeMode !== "ALL") {
      return res.status(403).send({
        status: "forbidden",
        code: "AUTH_ORGANIZATION_SCOPE_REQUIRED",
        message: "This operation requires organization-wide scope",
      });
    }
    next();
  };
}

function requireOwnerAdmin(req, res, next) {
  if (!req.auth?.isOwnerAdmin) {
    return res.status(403).send({
      status: "forbidden",
      code: "AUTH_OWNER_ADMIN_REQUIRED",
      message: "Only the organization owner administrator can manage access",
    });
  }
  next();
}

function tenantFilter(req, filter = {}) {
  if (!req.auth?.organizationId)
    throw new Error("Missing organization context");
  return { ...filter, organizationId: req.auth.organizationId };
}

module.exports = {
  requirePermission,
  requireOwnerAdmin,
  tenantFilter,
  enforceAdministrativePermission,
};
