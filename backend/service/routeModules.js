const ROUTE_MODULES = [
  [/^\/(?:api\/)?(?:cameras|camera-recordings)(?:\/|$)/i, "cameras"],
  [/^\/(?:api\/)?(?:vehicle-authorizations|vehicle-access-events)(?:\/|$)/i, "vehicles"],
  [/^\/(?:api\/)?gates(?:\/|$)/i, "gates"],
  [/^\/(?:api\/)?iot(?:\/|$)/i, "iot"],
  [/^\/(?:api\/)?calls\/settings(?:\/|$)/i, "condominiums"],
  [/^\/(?:api\/)?maintenance\/vendors(?:\/|$)/i, "vendors"],
  [/^\/(?:api\/)?schedules\/notices(?:\/|$)/i, "maintenance"],
  [/^\/(?:api\/)?schedules(?:\/|$)/i, "schedules"],
  [/^\/(?:api\/)?(?:tasks|maintenance)(?:\/|$)/i, "maintenance"],
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

module.exports = ROUTE_MODULES;
