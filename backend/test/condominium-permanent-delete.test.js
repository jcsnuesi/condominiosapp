"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const condominiumController = require("../controllers/condominio");
const condominiumRouter = require("../routes/condominio");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Invoice = require("../models/invoice");

function findRoute(path, method) {
  return condominiumRouter.stack.find(
    (layer) => layer.route?.path === path && layer.route?.methods?.[method]
  );
}

function mockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
}

test("permanent condominium deletion routes are protected", () => {
  const impactRoute = findRoute(
    "/condominiums/:id/permanent-delete-impact",
    "get"
  );
  const deleteRoute = findRoute("/condominiums/:id/permanent", "delete");

  assert.ok(impactRoute);
  assert.ok(deleteRoute);
  assert.equal(impactRoute.route.stack.length, 4);
  assert.equal(deleteRoute.route.stack.length, 4);
});

test("permanent deletion rejects invalid condominium identifiers before database access", async () => {
  const response = mockResponse();

  await condominiumController.PermanentDelete(
    {
      params: { id: "invalid-id" },
      body: { password: "secret" },
      auth: { role: "ADMIN" },
    },
    response
  );

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.status, "error");
});

test("historical relationship fields exist for unlinked units and invoices", () => {
  const ownerDetails = Owner.schema.path("propertyDetails").schema;
  const familyDetails = Family.schema.path("propertyDetails").schema;

  assert.ok(ownerDetails.path("formerCondominiumId"));
  assert.ok(ownerDetails.path("formerCondominiumAlias"));
  assert.ok(familyDetails.path("formerCondominiumId"));
  assert.ok(familyDetails.path("formerCondominiumAlias"));
  assert.ok(Invoice.schema.path("condominiumSnapshot.alias"));
  assert.ok(Invoice.schema.path("condominiumSnapshot.deletedAt"));
});
