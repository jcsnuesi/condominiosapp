"use strict";

function defaultCode(statusCode, isSuccess) {
  if (isSuccess) {
    if (statusCode === 201) return "CREATED";
    if (statusCode === 204) return "NO_CONTENT";
    return "REQUEST_OK";
  }

  if (statusCode === 400) return "BAD_REQUEST";
  if (statusCode === 401) return "UNAUTHORIZED";
  if (statusCode === 403) return "FORBIDDEN";
  if (statusCode === 404) return "NOT_FOUND";
  if (statusCode === 409) return "CONFLICT";
  if (statusCode >= 500) return "INTERNAL_ERROR";
  return "REQUEST_ERROR";
}

function mergeExtraIntoData(data, extra) {
  if (!extra || Object.keys(extra).length === 0) {
    return data;
  }

  if (data === null || data === undefined) {
    return extra;
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    return { ...data, ...extra };
  }

  return { value: data, ...extra };
}

function normalizeLegacyBody(body, statusCode) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "success") &&
    Object.prototype.hasOwnProperty.call(body, "data") &&
    Object.prototype.hasOwnProperty.call(body, "error") &&
    Object.prototype.hasOwnProperty.call(body, "code")
  ) {
    return body;
  }

  if (typeof body.status !== "string") {
    return body;
  }

  const legacyStatus = body.status.toLowerCase();
  const isSuccess = legacyStatus === "success";

  const { status, message, data, error, code, ...rest } = body;

  if (isSuccess) {
    const normalizedData = mergeExtraIntoData(
      data !== undefined ? data : message !== undefined ? { message } : null,
      rest
    );

    return {
      success: true,
      data: normalizedData,
      error: null,
      code: code || defaultCode(statusCode, true),
    };
  }

  const normalizedError = {
    ...(typeof error === "object" && error !== null ? error : {}),
    ...(typeof error === "string" ? { detail: error } : {}),
    ...(message ? { message } : {}),
    ...rest,
  };

  return {
    success: false,
    data: null,
    error: Object.keys(normalizedError).length ? normalizedError : null,
    code: code || defaultCode(statusCode, false),
  };
}

module.exports = function responseContract(req, res, next) {
  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  res.send = function patchedSend(body) {
    return originalSend(normalizeLegacyBody(body, res.statusCode || 200));
  };

  res.json = function patchedJson(body) {
    return originalJson(normalizeLegacyBody(body, res.statusCode || 200));
  };

  next();
};

module.exports._normalizeLegacyBody = normalizeLegacyBody;
