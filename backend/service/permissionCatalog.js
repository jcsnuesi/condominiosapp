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
  iot: ["read", "create", "update", "delete", "control", "history"],
  schedules: ["read", "create", "update"],
  maintenance: ["read", "update"],
  vendors: ["read", "create", "update"],
  cameras: ["read", "manage", "live"],
  "cameras.recordings": ["read"],
  vehicles: ["read", "manage"],
  gates: ["control"],
});

// These domains require explicit grants; extending the catalog must not
// silently expand existing operations or read-only policies.
const EXPLICIT_PERMISSIONS = Object.freeze([
  "cameras.read", "cameras.manage", "cameras.live",
  "cameras.recordings.read", "vehicles.read", "vehicles.manage", "gates.control",
]);

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
    permissions: PERMISSIONS.filter((permission) => !EXPLICIT_PERMISSIONS.includes(permission)),
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
    permissions: PERMISSIONS.filter((permission) =>
      permission.endsWith(".read") && !EXPLICIT_PERMISSIONS.includes(permission)
    ),
  },
]);

function isValidPermission(permission) {
  return PERMISSIONS.includes(String(permission || "").toLowerCase());
}

module.exports = {
  MODULE_ACTIONS,
  PERMISSIONS,
  EXPLICIT_PERMISSIONS,
  STANDARD_POLICIES,
  isValidPermission,
};
