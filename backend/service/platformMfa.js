"use strict";
const crypto = require("node:crypto");
const { enabled } = require("./saasCommercial");
const User = require("../models/platformUser");
const err = (message, code = "PLATFORM_MFA_REQUIRED", statusCode = 403) => Object.assign(new Error(message), { code, statusCode });
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32(bytes) {
  let value = 0, bits = 0, result = "";
  for (const byte of bytes) { value = (value << 8) | byte; bits += 8; while (bits >= 5) { bits -= 5; result += alphabet[(value >>> bits) & 31]; } }
  if (bits) result += alphabet[(value << (5 - bits)) & 31];
  return result;
}
function decode32(secret) {
  let value = 0, bits = 0; const bytes = [];
  for (const char of secret.replace(/=+$/, "")) { const index = alphabet.indexOf(char); if (index < 0) throw err("Secreto MFA inválido"); value = (value << 5) | index; bits += 5; if (bits >= 8) { bits -= 8; bytes.push((value >>> bits) & 255); } }
  return Buffer.from(bytes);
}
function totp(secret, counter) {
  const buffer = Buffer.alloc(8); buffer.writeBigUInt64BE(BigInt(counter));
  const digest = crypto.createHmac("sha1", decode32(secret)).update(buffer).digest();
  const offset = digest[digest.length - 1] & 15;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6, "0");
}
function verifyTotp(secret, code, now = Date.now(), previousCounter = -1) {
  if (!/^\d{6}$/.test(String(code))) return null;
  const current = Math.floor(now / 30000);
  for (const counter of [current, current - 1, current + 1]) {
    if (counter > previousCounter && crypto.timingSafeEqual(Buffer.from(totp(secret, counter)), Buffer.from(String(code)))) return counter;
  }
  return null;
}
function encryptionKey() {
  const raw = process.env.PLATFORM_MFA_KEY || "";
  if (!/^[a-fA-F0-9]{64}$/.test(raw)) throw err("Configura PLATFORM_MFA_KEY", "PLATFORM_MFA_UNAVAILABLE", 503);
  return Buffer.from(raw, "hex");
}
function encrypt(secret) {
  const iv = crypto.randomBytes(12); const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64");
}
function decrypt(value) {
  const bytes = Buffer.from(value, "base64"); const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), bytes.subarray(0, 12));
  decipher.setAuthTag(bytes.subarray(12, 28)); return Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString("utf8");
}
const hashRecovery = code => crypto.createHash("sha256").update(String(code).trim().toUpperCase()).digest("hex");
async function authenticate(userId, code) {
  const user = await User.findById(userId).select("+mfaSecret +mfaRecoveryHashes").lean();
  if (!user?.mfaEnabled) throw err("Configura MFA antes de continuar");
  if (user.mfaLockedUntil && new Date(user.mfaLockedUntil) > new Date()) throw err("Espera cinco minutos antes de intentar nuevamente", "PLATFORM_MFA_LOCKED", 429);
  const counter = verifyTotp(decrypt(user.mfaSecret), code, Date.now(), user.mfaCounter ?? -1);
  let result;
  if (counter !== null) result = await User.updateOne({ _id: userId, $or: [{ mfaCounter: { $lt: counter } }, { mfaCounter: { $exists: false } }] }, { $set: { mfaCounter: counter, mfaAttempts: 0, mfaLockedUntil: null } });
  else if (/^[A-Fa-f0-9]{16}$/.test(String(code))) result = await User.updateOne({ _id: userId, mfaRecoveryHashes: hashRecovery(code) }, { $pull: { mfaRecoveryHashes: hashRecovery(code) }, $inc: { sessionVersion: 1 }, $set: { mfaAttempts: 0, mfaLockedUntil: null } });
  if (!result?.modifiedCount) {
    const failed = await User.findByIdAndUpdate(userId, { $inc: { mfaAttempts: 1 } }, { returnDocument: "after" }).lean();
    if (failed?.mfaAttempts >= 5) await User.updateOne({ _id: userId }, { $set: { mfaLockedUntil: new Date(Date.now() + 300000), mfaAttempts: 0 } });
    throw err("Código MFA inválido o ya utilizado", "PLATFORM_MFA_INVALID", 401);
  }
  return User.findById(userId).lean();
}
function requireRecentMfa(req, res, next) {
  if (enabled("PLATFORM_MFA_ENABLED") && (!req.user.mfaAt || Date.now() / 1000 - req.user.mfaAt > 600)) return res.status(403).send({ code: "PLATFORM_MFA_STEP_UP", message: "Verifica MFA en Seguridad antes de esta acción" });
  next();
}
module.exports = { base32, totp, verifyTotp, encrypt, decrypt, hashRecovery, authenticate, requireRecentMfa, err };
