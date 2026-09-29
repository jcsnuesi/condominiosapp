"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  evaluatePermissions,
  hasPermission,
  canAccessCondominium,
} = require("../service/authorization");
const { requirePermission } = require("../middleware/organizationAuth");

test("permission evaluation unions policies and allows while deny wins", () => {
  const result = evaluatePermissions(
    ["owners.read", "owners.update"],
    ["owners.create", "owners.read"],
    ["owners.update"]
  );
  assert.deepEqual(result.sort(), ["owners.create", "owners.read"]);
});

test("permission evaluation defaults to no access", () => {
  assert.deepEqual(evaluatePermissions([], [], []), []);
  assert.equal(hasPermission({ permissions: [] }, "owners.read"), false);
});

test("ALL scope accepts every condominium", () => {
  assert.equal(canAccessCondominium({ scope: { mode: "ALL", condominiumIds: [] } }, "condo-2"), true);
});

test("SELECTED scope only accepts explicitly assigned condominiums", () => {
  const context = { scope: { mode: "SELECTED", condominiumIds: ["condo-1"] } };
  assert.equal(canAccessCondominium(context, "condo-1"), true);
  assert.equal(canAccessCondominium(context, "condo-2"), false);
});

test("permission middleware rejects a forged condominium outside scope", () => {
  const middleware = requirePermission("owners.update", {
    getCondominiumId: (req) => req.params.condoId,
  });
  const req = {
    params: { condoId: "condo-2" },
    auth: {
      permissions: ["owners.update"],
      scope: { mode: "SELECTED", condominiumIds: ["condo-1"] },
    },
  };
  let responseStatus;
  const res = {
    status(status) { responseStatus = status; return this; },
    send(body) { return body; },
  };
  middleware(req, res, () => assert.fail("next should not be called"));
  assert.equal(responseStatus, 403);
});

test("organization-wide operations require ALL scope", () => {
  const middleware = requirePermission("condominiums.create", { organizationWide: true });
  const req = {
    auth: {
      permissions: ["condominiums.create"],
      scope: { mode: "SELECTED", condominiumIds: ["condo-1"] },
    },
  };
  let responseStatus;
  const res = {
    status(status) { responseStatus = status; return this; },
    send(body) { return body; },
  };
  middleware(req, res, () => assert.fail("next should not be called"));
  assert.equal(responseStatus, 403);
});

test("organization-wide operations accept an ALL scope expressed with mode", () => {
  const middleware = requirePermission("condominiums.create", { organizationWide: true });
  const req = {
    auth: {
      permissions: ["condominiums.create"],
      scope: { mode: "ALL", condominiumIds: [] },
    },
  };
  const res = {
    status() { return this; },
    send(body) { return body; },
  };
  let nextCalled = false;

  middleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});
