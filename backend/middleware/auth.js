"use strict";

const jwt = require("jsonwebtoken");
const { getUnixTime } = require("date-fns");
const { getJwtSecret, algorithm } = require("../service/jwt");
const { resolveAccessContext } = require("../service/authorization");
const { enforceAdministrativePermission } = require("./organizationAuth");

function extractToken(value) {
  if (!value) {
    return null;
  }

  return value.replace(/^Bearer\s+/i, "").replace(/['"]+/g, "");
}

function verifyToken(token) {
  const payload = jwt.verify(token, getJwtSecret(), {
    algorithms: [algorithm],
  });

  if (["SUPERUSER", "SUPERADMIN"].includes(String(payload.role || "").toUpperCase())) {
    throw new Error("Retired account role");
  }

  if (payload.exp <= getUnixTime(new Date())) {
    throw new Error("Token expired");
  }

  return payload;
}

function invalidTokenResponse(res, error) {
  const message =
    error &&
    (error.message === "Token expired" || error.name === "TokenExpiredError")
      ? "El token ha expirado."
      : "El token no es valido.";

  return res.status(401).send({ message });
}

function isPersonalOwnerRouteAllowed(req) {
  const routePath = `${req.baseUrl || ""}${req.path || ""}`.replace(
    /^\/api(?=\/)/,
    ""
  );
  return (
    /^\/schedules(?:\/|$)/.test(routePath) ||
    /^\/tasks(?:\/|$)/.test(routePath) ||
    /^\/maintenance(?:\/|$)/.test(routePath) ||
    routePath === "/notifications/inbox" ||
    routePath === "/calls/session" ||
    routePath.startsWith("/iot/") ||
    routePath === "/auth/me" ||
    routePath === "/auth/me/password" ||
    routePath === "/update-password"
  );
}

module.exports.authenticated = async function (req, res, next) {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(403).send({
      message: "You don't have the corresponding authentication.",
    });
  }

  try {
    var payload = verifyToken(token);
  } catch (error) {
    return invalidTokenResponse(res, error);
  }

  //Adjuntar usuario identificado a la request

  req.user = payload;

  try {
    req.auth = await resolveAccessContext(payload);
  } catch (error) {
    return res.status(500).send({
      status: "error",
      code: "AUTH_CONTEXT_ERROR",
      message: "The access context could not be resolved",
    });
  }

  if (!req.auth) {
    return res.status(403).send({
      status: "forbidden",
      code: "AUTH_CONTEXT_MISSING",
      message: "The account has no active organization access",
    });
  }

  // Compatibility helpers receive the verified context, never client input.
  if (
    req.auth.contextType === "PERSONAL_OWNER" &&
    !isPersonalOwnerRouteAllowed(req)
  ) {
    return res.status(403).send({
      status: "forbidden",
      code: "PERSONAL_CONTEXT_ROUTE_DENIED",
      message: "This route is unavailable in a personal owner context",
    });
  }

  req.user.organizationId = req.auth.organizationId;
  req.user.accessScope = req.auth.scope;

  //Pasar a la accion

  enforceAdministrativePermission(req, res, next);
};

exports.isPersonalOwnerRouteAllowed = isPersonalOwnerRouteAllowed;

exports.emailOwnerRegistration = function (req, res, next) {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(403).send({
      message: "You don't have the corresponding authentication.",
    });
  }

  try {
    var payload = verifyToken(token);
  } catch (error) {
    return invalidTokenResponse(res, error);
  }

  //Adjuntar usuario identificado a la request

  req.ownerTokenDecoded = payload;

  next();
};

exports.emailToken = function (req, res, next) {
  const token = extractToken(req.params.id);

  if (!token) {
    return res.status(403).send({
      message: "You don't have the corresponding authentication.",
    });
  }

  try {
    var payload = verifyToken(token);
  } catch (error) {
    return invalidTokenResponse(res, error);
  }

  //Adjuntar usuario identificado a la request

  req.emailTokensVelidation = payload;

  next();
};

exports.guestToken = function (req, res, next) {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(403).send({
      message: "You don't have the corresponding authentication.",
    });
  }

  try {
    var payload = verifyToken(token);
  } catch (error) {
    return invalidTokenResponse(res, error);
  }

  //Adjuntar usuario identificado a la request

  req.user = payload;

  //Pasar a la accion

  next();
};
