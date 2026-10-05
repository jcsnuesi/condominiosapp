"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const { Record } = require("../schedule/infrastructure/models");
const directory = path.resolve(__dirname, "../../uploads/schedule-evidence");

async function cleanup(now = new Date()) {
  const names = await fs.readdir(directory).catch(() => []);
  for (const name of names) {
    if (!/^[a-f0-9-]{36}\.(pdf|jpg|png|webp)$/.test(name)) continue;
    const stat = await fs.stat(path.join(directory, name)).catch(() => null);
    if (!stat || now - stat.mtime < 86400000) continue;
    if (!await Record.exists({ "evidence.storedFilename": name })) await fs.unlink(path.join(directory, name)).catch(() => {});
  }
}
module.exports = { directory, cleanup };
