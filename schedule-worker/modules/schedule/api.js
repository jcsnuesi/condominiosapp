"use strict";
const express = require("express");
const path = require("node:path");
const { authenticated } = require("../../middleware/auth");
const { requirePermission } = require("../../middleware/organizationAuth");
const response = require("../../service/apiResponse");
const {
  Schedule,
  ScheduleTask,
  Record,
  Vendor,
} = require("./infrastructure/models");
const access = require("./application/access");
const rules = require("./domain/rules");
const schedules = require("./application/service");
const maintenance = require("../maintenance/service");
const evidence = require("../maintenance/evidence");
const notifications = require("./application/notifications");
const router = express.Router();
const enabled = (req, res, next) =>
  process.env.SCHEDULE_MODULE_ENABLED === "false"
    ? response.failure(
        res,
        503,
        { message: "Schedule module disabled" },
        "SCHEDULE_DISABLED"
      )
    : next();
function handler(fn) {
  return async (req, res) => {
    try {
      response.success(
        res,
        req.method === "POST" && req.path === "/schedules" ? 201 : 200,
        await fn(req, res),
        "SCHEDULE_OK"
      );
    } catch (error) {
      const status =
        error.statusCode ||
        (error.name === "ValidationError" ||
        error.name === "CastError" ||
        error instanceof SyntaxError
          ? 400
          : error.code === 11000
          ? 409
          : 500);
      response.failure(
        res,
        status,
        {
          message: status === 500 ? "Schedule operation failed" : error.message,
        },
        "SCHEDULE_FAILED"
      );
    }
  };
}
function route(method, url, permission, fn) {
  router[method](
    url,
    enabled,
    authenticated,
    requirePermission(permission),
    handler(fn)
  );
}
async function list(req, Model, catalog = false) {
  const page = Math.max(1, Math.min(100000, parseInt(req.query.page, 10) || 1)),
    limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
  const filter = catalog
    ? maintenance.catalogScope(req.auth)
    : access.scope(req.auth);
  if (!catalog) {
    const locations = await access.contexts(req.auth);
    filter.$or = locations.length
      ? locations.map((c) => ({
          condominiumId: c.condominiumId || null,
          unitId: c.unitId || null,
          residenceId: c.residenceId || null,
        }))
      : [{ _id: null }];
  }
  if (req.query.status && Model === ScheduleTask) {
    if (![...rules.OPEN, ...rules.CLOSED].includes(req.query.status))
      rules.fail("Invalid status");
    filter.status = req.query.status;
  }
  for (const key of [
    "condominiumId",
    "unitId",
    "residenceId",
    "assignedUserId",
    "scheduleId",
    "providerId",
  ])
    if (req.query[key]) {
      const value = access.validId(req.query[key]);
      // Add filters with $and so they can never replace the authorization scope.
      (filter.$and ||= []).push({ [key]: value });
    }
  if (req.query.from || req.query.to) {
    const field =
      Model === Record
        ? "performedAt"
        : Model === Schedule
        ? "nextRunAt"
        : "dueDate";
    filter[field] = {
      ...(req.query.from ? { $gte: rules.date(req.query.from, "from") } : {}),
      ...(req.query.to ? { $lte: rules.date(req.query.to, "to") } : {}),
    };
  }
  const [docs, total] = await Promise.all([
    Model.find(filter)
      .sort(Model === Record ? { performedAt: -1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Model.countDocuments(filter),
  ]);
  return { docs, total, page, limit };
}
route("get", "/schedules/contexts", "schedules.read", (req) =>
  access.contexts(req.auth)
);
route("get", "/schedules/responsibles", "schedules.read", (req) =>
  access.recipients(req.auth, req.query)
);
route("get", "/schedules/documents", "schedules.read", async (req) => {
  if (!req.auth.permissions.includes("documents.read"))
    rules.fail("Document permission required", 403);
  const context = await access.location(req.auth, req.query);
  if (!context.condominiumId || !req.auth.organizationId) return [];
  return require("../../models/docs")
    .find({
      organizationId: req.auth.organizationId,
      condoId: context.condominiumId,
      status: "Active",
    })
    .select("title")
    .limit(100)
    .lean();
});
route("get", "/schedules", "schedules.read", (req) => list(req, Schedule));
route("post", "/schedules", "schedules.create", (req) =>
  schedules.create(req.auth, req.body)
);
route("get", "/schedules/:id", "schedules.read", (req) =>
  access.load(Schedule, req.auth, req.params.id)
);
route("patch", "/schedules/:id", "schedules.update", (req) =>
  schedules.update(req.auth, req.params.id, req.body)
);
route("post", "/schedules/:id/pause", "schedules.update", (req) =>
  schedules.active(req.auth, req.params.id, false)
);
route("post", "/schedules/:id/resume", "schedules.update", (req) =>
  schedules.active(req.auth, req.params.id, true)
);
route("get", "/tasks", "maintenance.read", (req) => {
  if (req.query.source !== "schedule")
    rules.fail("source=schedule is required");
  return list(req, ScheduleTask);
});
route("get", "/tasks/:id", "maintenance.read", (req) =>
  access.load(ScheduleTask, req.auth, req.params.id)
);
route("patch", "/tasks/:id/status", "maintenance.update", (req) =>
  maintenance.status(req.auth, req.params.id, req.body.status)
);
route("post", "/tasks/:id/reschedule", "maintenance.update", (req) =>
  maintenance.reschedule(req.auth, req.params.id, req.body.dueDate)
);
router.post(
  "/tasks/:id/complete",
  enabled,
  authenticated,
  requirePermission("maintenance.update"),
  (req, res, next) => {
    evidence.upload(req, res, (error) =>
      error
        ? response.failure(
            res,
            400,
            {
              message:
                "Invalid evidence upload (maximum five files, 10 MB each)",
            },
            "EVIDENCE_INVALID"
          )
        : next()
    );
  },
  handler(async (req) => {
    // Check task access before persisting uploads. Clean staged files on failed or repeated closures.
    await access.load(ScheduleTask, req.auth, req.params.id);
    const files = await evidence.store(req.files);
    let committed = [];
    try {
      const body = {
        ...req.body,
        documentIds:
          typeof req.body.documentIds === "string"
            ? JSON.parse(req.body.documentIds)
            : req.body.documentIds,
      };
      const result = await maintenance.closeTask(
        req.auth,
        req.params.id,
        body,
        files
      );
      committed = result.evidence || [];
      return result;
    } finally {
      await evidence.remove(
        files.filter(
          (f) => !committed.some((c) => c.storedFilename === f.storedFilename)
        )
      );
    }
  })
);
route("get", "/maintenance/history", "maintenance.read", (req) =>
  list(req, Record)
);
route("get", "/maintenance/history/:id", "maintenance.read", (req) =>
  access.load(Record, req.auth, req.params.id)
);
route("get", "/maintenance/vendors", "vendors.read", (req) =>
  list(req, Vendor, true)
);
route("post", "/maintenance/vendors", "vendors.create", (req) =>
  maintenance.saveVendor(req.auth, req.body)
);
route("patch", "/maintenance/vendors/:id", "vendors.update", (req) =>
  maintenance.saveVendor(req.auth, req.body, req.params.id)
);
route("post", "/schedules/notices/:id/read", "maintenance.read", (req) =>
  notifications.read(req.auth, req.params.id)
);
router.get(
  "/maintenance/history/:id/evidence/:fileId",
  enabled,
  authenticated,
  requirePermission("maintenance.read"),
  async (req, res) => {
    try {
      const record = await access.load(Record, req.auth, req.params.id);
      const file = record.evidence.id(access.validId(req.params.fileId));
      if (
        !file ||
        !/^[a-f0-9-]{36}\.(pdf|jpg|png|webp)$/.test(file.storedFilename)
      )
        rules.fail("Evidence not found", 404);
      res.set("X-Content-Type-Options", "nosniff");
      res.type(file.mimetype);
      res.download(
        path.join(evidence.directory, file.storedFilename),
        file.filename,
        (error) => {
          if (error && !res.headersSent)
            response.failure(
              res,
              404,
              { message: "Evidence not found" },
              "EVIDENCE_NOT_FOUND"
            );
        }
      );
    } catch (error) {
      response.failure(
        res,
        error.statusCode || 500,
        { message: error.statusCode ? error.message : "Download failed" },
        "EVIDENCE_FAILED"
      );
    }
  }
);
module.exports = router;
