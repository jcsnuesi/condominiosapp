"use strict";

const jwt = require("jsonwebtoken");
const { getUnixTime, addDays, addHours } = require("date-fns");

const algorithm = "HS256";
const localDevSecret = "condominiosapp-local-dev-jwt-secret";

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production.");
  }

  return localDevSecret;
}

function sign(payload) {
  return jwt.sign(payload, getJwtSecret(), { algorithm });
}

exports.createToken = function (user, options = {}) {
  const rememberMe = Boolean(options.rememberMe);
  const expirationDate = rememberMe
    ? addDays(new Date(), 30)
    : addHours(new Date(), 12);

  var payload = {
    sub: user._id,
    email: user.email,
    role: user.role,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(expirationDate),
    createdBy: user.createdBy || null,
    organizationId: user.organizationId || null,
  };

  return sign(payload);
};

exports.resolveSessionExpiration = function (options = {}) {
  const rememberMe = Boolean(options.rememberMe);
  const expirationDate = rememberMe
    ? addDays(new Date(), 30)
    : addHours(new Date(), 12);

  return {
    rememberMe,
    expiresAt: expirationDate.toISOString(),
    expiresInSeconds: Math.max(
      0,
      getUnixTime(expirationDate) - getUnixTime(new Date())
    ),
  };
};

exports.ownerRegisterToken = function (user) {
  var payload = {
    sub: user.id,
    condominioId: user.condominioId,
    role: user.role,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(addDays(new Date(), 7)),
    createdBy: user.createdBy || null,
    organizationId: user.organizationId || null,
  };

  return sign(payload);
};

exports.emailVerification = function (info) {
  var payload = {
    id: info.id,
    uid: info.uid,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(addDays(new Date(), 30)),
  };

  return sign(payload);
};

exports.guestVerification = function (info) {
  var payload = {
    id: info._id,
    fullname: info.fullname,
    email: info.notificationType,
    phone: info.phone,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(addHours(new Date(), 24)),
  };

  return sign(payload);
};

exports.getJwtSecret = getJwtSecret;
exports.algorithm = algorithm;
