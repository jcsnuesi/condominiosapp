"use strict";

// Bound public registration and verification work without retaining unbounded IP entries.
function createRegistrationRateLimit({ windowMs = 15 * 60 * 1000, limit = 20, now = Date.now } = {}) {
  const attempts = new Map();
  return function registrationRateLimit(req, res, next) {
    const time = now();
    for (const [key, value] of attempts) {
      if (value.until <= time) attempts.delete(key);
    }
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const entry = attempts.get(key) || { count: 0, until: time + windowMs };
    if (entry.count >= limit || (!attempts.has(key) && attempts.size >= 10000)) {
      res.set("Retry-After", String(Math.ceil((entry.until - time) / 1000)));
      return res.status(429).send({ status: "error", code: "REGISTRATION_RATE_LIMITED", message: "Demasiados intentos. Espera unos minutos antes de intentar nuevamente." });
    }
    entry.count += 1;
    attempts.set(key, entry);
    next();
  };
}
module.exports = createRegistrationRateLimit();
module.exports.createRegistrationRateLimit = createRegistrationRateLimit;
