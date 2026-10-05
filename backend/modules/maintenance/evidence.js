"use strict";
const fs = require("node:fs/promises"); const path = require("node:path"); const crypto = require("node:crypto");
const multer = require("multer"); const { Record } = require("../schedule/infrastructure/models"); const { fail } = require("../schedule/domain/rules");
const directory = path.resolve(__dirname, "../../uploads/schedule-evidence");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 5, fields: 15, fieldSize: 20000 } }).array("evidence", 5);
function fileType(buffer) {
  if (buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) return ["application/pdf", ".pdf"];
  if (buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return ["image/png", ".png"];
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return ["image/jpeg", ".jpg"];
  if (buffer.subarray(0,4).toString() === "RIFF" && buffer.subarray(8,12).toString() === "WEBP") return ["image/webp", ".webp"];
  fail("Evidence must be a PDF, JPEG, PNG or WebP file");
}
async function store(files = []) {
  const validated = files.map(f => { const [mimetype, ext] = fileType(f.buffer); if (mimetype !== f.mimetype) fail("Evidence content does not match its MIME type"); return { file: f, mimetype, ext }; });
  const result = []; await fs.mkdir(directory, { recursive: true });
  // The API may run as root while the isolated worker uses the image's node UID.
  // Ownership of this private directory lets that worker remove orphaned files.
  if (process.getuid?.() === 0) await fs.chown(directory, 1000, 1000);
  try {
    for (const { file, mimetype, ext } of validated) {
      const storedFilename = `${crypto.randomUUID()}${ext}`;
      await fs.writeFile(path.join(directory, storedFilename), file.buffer, { flag: "wx" });
      result.push({ filename: path.basename(file.originalname).replace(/[\x00-\x1f]/g, "").slice(0, 200), storedFilename, mimetype, size: file.size });
    }
    return result;
  } catch (error) { await remove(result); throw error; }
}
async function remove(files) { await Promise.all(files.map(f => fs.unlink(path.join(directory, f.storedFilename)).catch(() => {}))); }
async function cleanup(now = new Date()) {
  const names = await fs.readdir(directory).catch(() => []);
  for (const name of names) {
    if (!/^[a-f0-9-]{36}\.(pdf|jpg|png|webp)$/.test(name)) continue;
    const stat = await fs.stat(path.join(directory, name)).catch(() => null);
    if (!stat || now - stat.mtime < 86400000) continue;
    if (!await Record.exists({ "evidence.storedFilename": name })) await fs.unlink(path.join(directory, name)).catch(() => {});
  }
}
module.exports = { upload, fileType, directory, store, remove, cleanup };
