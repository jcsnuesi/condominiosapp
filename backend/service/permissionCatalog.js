"use strict";

const MODULE_ACTIONS = Object.freeze({
  dashboard: ["read"],
  users: ["read", "create", "update", "delete"],
  condominiums: ["read", "create", "update", "delete"],
  owners: ["read", "create", "update", "delete"],
  staff: ["read", "create", "update", "delete"],
  bookings: ["read", "create", "update", "delete"],
  documents: ["read", "create", "update", "delete"],
  inquiries: ["read", "create", "update", "delete"],
  str: ["read", "create", "update", "delete"],
  finance: ["read", "create", "update", "delete"],
  communications: ["read", "create", "update", "delete"],
});

const PERMISSIONS = Object.freeze(
  Object.entries(MODULE_ACTIONS).flatMap(([moduleName, actions]) =>
    actions.map((action) => `${moduleName}.${action}`)
  )
);

const STANDARD_POLICIES = Object.freeze([
  {
    key: "OPERATIONS_ADMIN",
    name: "Administrador operativo",
    description: "Gestion completa de los modulos operativos.",
    permissions: PERMISSIONS,
  },
  {
    key: "FINANCE",
    name: "Finanzas",
    description: "Consulta general y gestion financiera.",
    permissions: [
      "dashboard.read",
      "condominiums.read",
      "owners.read",
      "finance.read",
      "finance.create",
      "finance.update",
      "finance.delete",
      "communications.read",
      "communications.create",
    ],
  },
  {
    key: "READ_ONLY",
    name: "Solo lectura",
    description: "Consulta de los modulos disponibles sin mutaciones.",
    permissions: PERMISSIONS.filter((permission) => permission.endsWith(".read")),
  },
]);

function isValidPermission(permission) {
  return PERMISSIONS.includes(String(permission || "").toLowerCase());
}

module.exports = { MODULE_ACTIONS, PERMISSIONS, STANDARD_POLICIES, isValidPermission };
