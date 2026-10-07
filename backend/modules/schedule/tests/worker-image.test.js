"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { isBuiltin } = require("node:module");
const backend = path.resolve(__dirname, "../../..");

for (const filename of ["Dockerfile.schedule-worker", "../schedule-worker/Dockerfile"]) {
test(`${filename} contains the worker and migration dependency closure without backend HTTP dependencies`, () => {
  const dockerfile = fs.readFileSync(path.join(backend, filename), "utf8");
  const copied = new Set([...dockerfile.matchAll(/^COPY (.+) /gm)].flatMap(match => match[1].split(" ").map(name => name.replace(/^backend\//, ""))));
  const manifest = require("../worker-runtime/package.json");
  const lock = require("../worker-runtime/package-lock.json");
  const visited = new Set();
  const dependencies = new Set();
  function visit(relative) {
    if (visited.has(relative)) return;
    visited.add(relative);
    assert.ok(copied.has(relative), `Image is missing ${relative}`);
    const source = fs.readFileSync(path.join(backend, relative), "utf8");
    for (const [, name] of source.matchAll(/require\(["']([^"']+)["']\)/g)) {
      if (isBuiltin(name)) continue;
      if (!name.startsWith(".")) { dependencies.add(name); continue; }
      const next = path.posix.normalize(path.posix.join(path.posix.dirname(relative), name));
      visit(next.endsWith(".js") ? next : `${next}.js`);
    }
  }
  visit("modules/schedule/worker.js");
  visit("scripts/migrateSchedule.js");
  assert.deepEqual([...dependencies].sort(), Object.keys(manifest.dependencies).sort());
  assert.deepEqual(lock.packages[""].dependencies, manifest.dependencies);
  for (const [name, version] of Object.entries(manifest.dependencies)) {
    assert.equal(lock.packages[`node_modules/${name}`].version, version);
  }
  assert.ok(!copied.has("."), "Must not copy the whole backend");
  assert.ok(!visited.has("app.js"));
  assert.ok(!visited.has("modules/schedule/api.js"));
  assert.ok(!dependencies.has("express"));
  assert.ok(!dependencies.has("multer"));
});
}
