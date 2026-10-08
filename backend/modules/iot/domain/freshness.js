"use strict";

function reportedTimestamp(metadata, now = new Date()) {
  const times = Object.values(metadata || {}).map((field) => field?.timestamp)
    .filter((value) => typeof value === "number" && Number.isFinite(value) && value > 0)
    .map((value) => value * 1000).filter((value) => value <= now.getTime());
  return times.length ? new Date(Math.max(...times)) : null;
}

function connectivityAt(lastReportedAt, now = new Date(), maxAgeMs = 300000) {
  if (!lastReportedAt) return "UNKNOWN";
  const timestamp = new Date(lastReportedAt).getTime();
  if (!Number.isFinite(timestamp) || timestamp > now.getTime()) return "UNKNOWN";
  return now.getTime() - timestamp <= maxAgeMs ? "ONLINE" : "OFFLINE";
}

module.exports = { reportedTimestamp, connectivityAt };
