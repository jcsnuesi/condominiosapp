"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const accessController = require("../controllers/access");
const accessRouter = require("../routes/access");

function responseRecorder() {
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

test("administrative user status rejects invalid subjects before database access", async () => {
  const response = responseRecorder();

  await accessController.updateAdministrativeUserStatus(
    {
      params: { subjectModel: "Admin", subjectId: "invalid" },
      body: { status: "active" },
    },
    response
  );

  assert.equal(response.statusCode, 400);
});

test("administrative user permanent delete rejects invalid subjects before database access", async () => {
  const response = responseRecorder();

  await accessController.deleteAdministrativeUser(
    { params: { subjectModel: "Admin", subjectId: "invalid" } },
    response
  );

  assert.equal(response.statusCode, 400);
});

test("administrative user mutation routes require owner-admin authorization", () => {
  const protectedPaths = new Map(
    accessRouter.stack
      .filter((layer) => layer.route)
      .map((layer) => [layer.route.path, layer.route.stack.map((item) => item.name)])
  );

  for (const path of [
    "/organization-users/:subjectModel/:subjectId/status",
    "/organization-users/:subjectModel/:subjectId",
  ]) {
    assert.ok(protectedPaths.has(path));
    assert.ok(protectedPaths.get(path).length >= 3);
    assert.ok(protectedPaths.get(path).includes("requireOwnerAdmin"));
  }
});
