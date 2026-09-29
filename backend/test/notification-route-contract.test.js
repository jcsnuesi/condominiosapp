"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

test("notification detail routes cannot capture unrelated API endpoints", () => {
  const router = require("../routes/notification");
  const routePaths = router.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path);

  assert.equal(routePaths.includes("/:id"), false);
  assert.equal(routePaths.includes("/notifications/:id"), true);
});
