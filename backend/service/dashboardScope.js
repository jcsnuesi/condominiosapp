"use strict";

function normalizeIdentifier(value) {
  return value === null || value === undefined ? "" : String(value);
}

function canAccessDashboardIdentifier(user, identifier) {
  const requestedIdentifier = normalizeIdentifier(identifier);
  if (!requestedIdentifier || !user) {
    return false;
  }

  return [user.sub, user.ownerId, user.condominioId]
    .map(normalizeIdentifier)
    .filter(Boolean)
    .includes(requestedIdentifier);
}

module.exports = { canAccessDashboardIdentifier };
