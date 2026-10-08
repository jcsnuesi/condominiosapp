"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

async function syncDirectory(directory) {
  // Windows supports the simulator; Linux durability needs directory fsync.
  if (process.platform === "win32") return;
  const handle = await fs.open(directory, "r");
  try { await handle.sync(); } finally { await handle.close(); }
}
async function writeDurable(file, value) {
  const handle = await fs.open(file, "wx", 0o600);
  try { await handle.writeFile(JSON.stringify(value)); await handle.sync(); }
  finally { await handle.close(); }
  await syncDirectory(path.dirname(file));
}
async function replaceDurable(file, value) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  await writeDurable(temporary, value);
  try { await fs.rename(temporary, file); await syncDirectory(path.dirname(file)); }
  finally { await fs.unlink(temporary).catch((error) => { if (error.code !== "ENOENT") throw error; }); }
}
module.exports = { syncDirectory, writeDurable, replaceDurable };
