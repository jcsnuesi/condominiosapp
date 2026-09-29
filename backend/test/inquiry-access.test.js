"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const mongoose = require("mongoose");
const Condominium = require("../models/condominio");
const {
  boundedPagination,
  buildInquiryFilter,
  canAccessCondominium,
  isAggregateIdentifierForUser,
  isValidObjectId,
  roleToModel,
} = require("../service/inquiryAccess");
const { resolveSafeNotificationPath } = require("../service/notificationFileAccess");

function objectId() {
  return new mongoose.Types.ObjectId();
}

function queryResult(value) {
  return {
    select() {
      return this;
    },
    lean: async () => value,
  };
}

test("invalid Mongo identifiers are rejected before querying", () => {
  assert.equal(isValidObjectId("not-an-object-id"), false);
  assert.equal(isValidObjectId(objectId()), true);
});

test("pagination is bounded and receives safe defaults", () => {
  assert.deepEqual(boundedPagination("0", "5000"), { page: 1, limit: 100 });
  assert.deepEqual(boundedPagination("abc", "-2"), { page: 1, limit: 1 });
  assert.deepEqual(boundedPagination("3", "25"), { page: 3, limit: 25 });
});

test("response model is derived from the authenticated role", () => {
  assert.equal(roleToModel("ROLE_STAFF_ADMIN"), "Staff_Admin");
  assert.equal(roleToModel("OWNER"), "Owner");
  assert.equal(roleToModel("unknown"), null);
});

test("aggregate identifiers only accept the authenticated account hierarchy", () => {
  const adminId = objectId();
  const creatorId = objectId();

  assert.equal(
    isAggregateIdentifierForUser(
      { sub: adminId, createdBy: creatorId },
      adminId
    ),
    true
  );
  assert.equal(
    isAggregateIdentifierForUser(
      { sub: adminId, createdBy: creatorId },
      creatorId
    ),
    true
  );
  assert.equal(
    isAggregateIdentifierForUser(
      { sub: adminId, createdBy: creatorId },
      objectId()
    ),
    false
  );
});

test("admin inquiry filters contain only condominiums owned by that tenant", async (t) => {
  const adminId = objectId();
  const ownCondo = objectId();
  const foreignCondo = objectId();
  const originalFind = Condominium.find;
  Condominium.find = (filter) => {
    assert.equal(String(filter.createdBy), String(adminId));
    return queryResult([{ _id: ownCondo }]);
  };
  t.after(() => {
    Condominium.find = originalFind;
  });

  const scoped = await buildInquiryFilter(
    { sub: adminId, role: "ADMIN" },
    adminId
  );
  assert.deepEqual(scoped.condominiumIds, [String(ownCondo)]);
  assert.equal(await canAccessCondominium({ sub: adminId, role: "ADMIN" }, foreignCondo), false);
});

test("cross-tenant condominium identifiers are forbidden", async (t) => {
  const adminId = objectId();
  const ownCondo = objectId();
  const foreignCondo = objectId();
  const originalFind = Condominium.find;
  Condominium.find = () => queryResult([{ _id: ownCondo }]);
  t.after(() => {
    Condominium.find = originalFind;
  });

  const scoped = await buildInquiryFilter(
    { sub: adminId, role: "ADMIN" },
    foreignCondo
  );
  assert.equal(scoped.error, "forbidden");
});

test("admin aggregate inquiry request returns an empty filter when no condominiums exist", async (t) => {
  const adminId = objectId();
  const organizationId = objectId();
  const originalFind = Condominium.find;
  Condominium.find = (filter) => {
    assert.equal(String(filter.organizationId), String(organizationId));
    return queryResult([]);
  };
  t.after(() => {
    Condominium.find = originalFind;
  });

  const scoped = await buildInquiryFilter(
    {
      sub: adminId,
      role: "ADMIN",
      organizationId,
      accessScope: { mode: "ALL", condominiumIds: [] },
    },
    adminId
  );

  assert.equal(scoped.error, undefined);
  assert.deepEqual(scoped.condominiumIds, []);
  assert.deepEqual(scoped.filter.condominiumId.$in, []);
});

test("delegated admin inquiry scope uses scope.mode", async (t) => {
  const adminId = objectId();
  const organizationId = objectId();
  const selectedCondominiumId = objectId();
  const originalFind = Condominium.find;
  Condominium.find = (filter) => {
    assert.equal(String(filter.organizationId), String(organizationId));
    assert.deepEqual(filter._id.$in, [selectedCondominiumId]);
    return queryResult([{ _id: selectedCondominiumId }]);
  };
  t.after(() => {
    Condominium.find = originalFind;
  });

  const scoped = await buildInquiryFilter(
    {
      sub: adminId,
      role: "ADMIN",
      organizationId,
      accessScope: {
        mode: "SELECTED",
        condominiumIds: [selectedCondominiumId],
      },
    },
    adminId
  );

  assert.deepEqual(scoped.condominiumIds, [String(selectedCondominiumId)]);
});

test("notification attachment paths cannot traverse their upload directory", () => {
  const base = path.resolve("uploads", "notifications");
  assert.equal(resolveSafeNotificationPath(base, "../app.js"), null);
  assert.equal(resolveSafeNotificationPath(base, "..\\app.js"), null);
  assert.equal(
    resolveSafeNotificationPath(base, "notification-123.pdf"),
    path.join(base, "notification-123.pdf")
  );
});

test("legacy mutating and listing routes include authentication middleware", () => {
  const router = require("../routes/inquiry");
  const protectedPaths = new Set([
    "/get-notifications",
    "/get-notifications-by-id/:id",
    "/update-notification/:id",
    "/delete-notification/:id",
    "/delete-attachment",
    "/deactivate-notification/:id",
    "/activate-notification/:id",
  ]);
  const routes = router.stack
    .filter((layer) => layer.route && protectedPaths.has(layer.route.path));

  assert.equal(routes.length, protectedPaths.size);
  for (const layer of routes) {
    assert.ok(
      layer.route.stack.length >= 2,
      `${layer.route.path} must authenticate requests`
    );
  }
});
