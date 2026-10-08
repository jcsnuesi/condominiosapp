"use strict";
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const User = require("../models/platformUser");
const mfa = require("../service/platformMfa");
const jwt = require("../service/jwt");
const audit = async (req, action, session, targetId = req.user.sub) => require("../models/platformAudit").create([{ actorId: req.user.sub, action, targetType: "PLATFORM_USER", targetId, ip: req.ip }], { session });
const handle = fn => async (req, res) => { try { if (!req.auth?.isPlatform) throw mfa.err("Acceso de plataforma requerido"); await fn(req, res); } catch (e) { res.status(e.statusCode || 500).send({ code: e.code || "PLATFORM_SECURITY_ERROR", message: e.statusCode ? e.message : "No se pudo completar la verificación" }); } };
const tokenResult = (user, recoveryCodes) => ({ token: jwt.createToken(user, { mfaAt: Math.floor(Date.now() / 1000) }), recoveryCodes, session: jwt.resolveSessionExpiration({ platform: true }) });
exports.status = handle(async (req, res) => res.send({ data: { enabled: req.auth.account.mfaEnabled, required: require("../service/saasCommercial").enabled("PLATFORM_MFA_ENABLED") } }));
exports.setup = handle(async (req, res) => {
  if (req.auth.account.mfaEnabled) throw mfa.err("MFA ya está configurado");
  const secret = mfa.base32(crypto.randomBytes(20));
  await User.updateOne({ _id: req.user.sub, mfaEnabled: { $ne: true } }, { $set: { mfaPendingSecret: mfa.encrypt(secret), mfaPendingUntil: new Date(Date.now() + 600000) } });
  res.send({ data: { secret, uri: `otpauth://totp/Comunard:${encodeURIComponent(req.auth.account.email)}?secret=${secret}&issuer=Comunard&algorithm=SHA1&digits=6&period=30` } });
});
exports.enroll = handle(async (req, res) => {
  const user = await User.findById(req.user.sub).select("+mfaPendingSecret").lean();
  if (user.mfaEnabled || !user.mfaPendingSecret || !user.mfaPendingUntil || new Date(user.mfaPendingUntil) <= new Date()) throw mfa.err("Vuelve a iniciar la configuración MFA");
  if (user.mfaLockedUntil && new Date(user.mfaLockedUntil) > new Date()) throw mfa.err("Espera cinco minutos", "PLATFORM_MFA_LOCKED", 429);
  const counter = mfa.verifyTotp(mfa.decrypt(user.mfaPendingSecret), req.body.code);
  if (counter === null) {
    const failed = await User.findByIdAndUpdate(user._id, { $inc: { mfaAttempts: 1 } }, { returnDocument: "after" }).lean();
    if (failed.mfaAttempts >= 5) await User.updateOne({ _id: user._id }, { $set: { mfaLockedUntil: new Date(Date.now() + 300000), mfaAttempts: 0 } });
    throw mfa.err("Código inválido", "PLATFORM_MFA_INVALID", 401);
  }
  const codes = Array.from({ length: 10 }, () => crypto.randomBytes(8).toString("hex").toUpperCase());
  let saved;
  await mongoose.connection.transaction(async session => {
    saved = await User.findOneAndUpdate({ _id: user._id, mfaEnabled: { $ne: true }, mfaPendingSecret: user.mfaPendingSecret }, { $set: { mfaSecret: user.mfaPendingSecret, mfaEnabled: true, mfaCounter: counter, mfaRecoveryHashes: codes.map(mfa.hashRecovery), mfaAttempts: 0, mfaLockedUntil: null }, $inc: { sessionVersion: 1 }, $unset: { mfaPendingSecret: "", mfaPendingUntil: "" } }, { session, returnDocument: "after" }).lean();
    if (!saved) throw mfa.err("La configuración cambió; inténtalo nuevamente");
    await audit(req, "platform.mfa.enroll", session);
  });
  res.send({ data: tokenResult(saved, codes) });
});
exports.challenge = handle(async (req, res) => {
  const saved = await mfa.authenticate(req.user.sub, req.body.code);
  await audit(req, "platform.mfa.verify");
  res.send({ data: tokenResult(saved) });
});
exports.revoke = handle(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isObjectIdOrHexString(id)) throw mfa.err("Identificador inválido");
  const user = await User.findById(id).populate("policyIds", "permissions").lean();
  if (!user || (id !== String(req.user.sub) && user.role !== "PLATFORM_SUPERVISOR")) throw mfa.err("No puedes modificar esta cuenta");
  if (id !== String(req.user.sub)) require("../service/platformPermissions").assertDelegation(req.auth, user.policyIds.flatMap(p => p.permissions), user.scope);
  await mongoose.connection.transaction(async session => { await User.updateOne({ _id: id }, { $inc: { sessionVersion: 1 } }, { session }); await audit(req, "platform.sessions.revoke", session, id); });
  res.send({ data: { revoked: true } });
});
