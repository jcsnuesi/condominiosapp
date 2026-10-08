"use strict";
const router = require("express").Router();
const { authenticated } = require("../middleware/auth");
const { requirePlatform } = require("../service/platformAuthorization");
const c = require("../controllers/platform");
const access = require("../controllers/access");
router.use("/platform", authenticated);
const route = (method, path, permission, ...handlers) => router[method](`/platform${path}`, requirePlatform(permission), ...handlers);
route("get", "/kpis", "platform.kpis.read", c.kpis);
route("get", "/accounts", "platform.accounts.read", c.accounts);
route("get", "/scope-accounts", "platform.supervisors.manage", c.accounts);
route("get", "/supervisor-policies", "platform.supervisors.manage", c.listPolicies);
route("get", "/membership-plans", "platform.memberships.manage", c.listPlans);
route("patch", "/accounts/:subjectType/:subjectId", "platform.accounts.update", c.updateAccount);
route("put", "/memberships/:subjectType/:subjectId", "platform.memberships.manage", c.saveMembership);
route("get", "/policies", "platform.policies.read", c.listPolicies);
route("post", "/policies", "platform.policies.manage", c.savePolicy);
route("put", "/policies/:id", "platform.policies.manage", c.savePolicy);
route("get", "/supervisors", "platform.supervisors.read", c.listUsers);
route("post", "/supervisors", "platform.supervisors.manage", c.saveUser);
route("put", "/supervisors/:id", "platform.supervisors.manage", c.saveUser);
route("get", "/plans", "platform.memberships.read", c.listPlans);
route("post", "/plans", "platform.memberships.manage", c.savePlan);
route("put", "/plans/:id", "platform.memberships.manage", c.savePlan);
route("get", "/audit", "platform.audit.read", c.audits);
for (const [method, path, handler] of [
  ["get", "/catalog", access.catalog], ["get", "/policies", access.listPolicies],
  ["post", "/policies", access.createPolicy], ["put", "/policies/:id", access.updatePolicy],
  ["delete", "/policies/:id", access.archivePolicy], ["get", "/users", access.listAdministrativeUsers],
  ["put", "/grants/:subjectModel/:subjectId", access.upsertGrant],
  ["get", "/condominiums", async (req, res) => res.send({ status: "success", message: await require("../models/condominio").find({ organizationId: req.auth.organizationId }).select("_id alias").lean() })],
]) route(method, `/organizations/:organizationId/access${path}`, method === "get" ? "platform.access.read" : "platform.access.manage", c.organizationContext, handler);
module.exports = router;
