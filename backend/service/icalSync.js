"use strict";

const RentalChannel = require("../models/rentalChannel");
const ExternalReservation = require("../models/externalReservation");
const Reserve = require("../models/reserves");

function unfoldIcalLines(icsText) {
  const rawLines = String(icsText || "").split(/\r?\n/);
  const unfolded = [];

  for (const line of rawLines) {
    if (!line) {
      continue;
    }

    if ((line.startsWith(" ") || line.startsWith("\t")) && unfolded.length) {
      unfolded[unfolded.length - 1] += line.slice(1);
      continue;
    }

    unfolded.push(line);
  }

  return unfolded;
}

function parseIcalDate(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (/^\d{8}$/.test(normalized)) {
    const year = Number(normalized.slice(0, 4));
    const month = Number(normalized.slice(4, 6)) - 1;
    const day = Number(normalized.slice(6, 8));
    return new Date(Date.UTC(year, month, day, 0, 0, 0));
  }

  if (/^\d{8}T\d{6}Z$/.test(normalized)) {
    const year = Number(normalized.slice(0, 4));
    const month = Number(normalized.slice(4, 6)) - 1;
    const day = Number(normalized.slice(6, 8));
    const hour = Number(normalized.slice(9, 11));
    const minute = Number(normalized.slice(11, 13));
    const second = Number(normalized.slice(13, 15));
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

  if (/^\d{8}T\d{6}$/.test(normalized)) {
    const year = Number(normalized.slice(0, 4));
    const month = Number(normalized.slice(4, 6)) - 1;
    const day = Number(normalized.slice(6, 8));
    const hour = Number(normalized.slice(9, 11));
    const minute = Number(normalized.slice(11, 13));
    const second = Number(normalized.slice(13, 15));
    return new Date(year, month, day, hour, minute, second);
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseIcsText(icsText) {
  const lines = unfoldIcalLines(icsText);
  const events = [];
  let current = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }

    if (line === "END:VEVENT") {
      if (current && current.uid && current.start && current.end) {
        events.push(current);
      }
      current = null;
      continue;
    }

    if (!current) {
      continue;
    }

    const separator = line.indexOf(":");
    if (separator <= 0) {
      continue;
    }

    const rawKey = line.slice(0, separator);
    const value = line.slice(separator + 1).trim();
    const key = rawKey.split(";")[0].toUpperCase();

    if (key === "UID") {
      current.uid = value;
    } else if (key === "SUMMARY") {
      current.summary = value;
    } else if (key === "DTSTART") {
      current.start = parseIcalDate(value);
    } else if (key === "DTEND") {
      current.end = parseIcalDate(value);
    } else if (key === "STATUS") {
      current.status = String(value || "").toLowerCase();
    }
  }

  return events;
}

function buildReserveConflictQuery(condoId, apartmentUnit, checkIn, checkOut) {
  return {
    condoId,
    apartmentUnit,
    status: { $in: ["Reserved", "Guest"] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
}

function mapIcalStatus(rawStatus) {
  if (rawStatus === "cancelled") {
    return "cancelled";
  }
  if (rawStatus === "tentative") {
    return "tentative";
  }
  return "confirmed";
}

async function syncChannel(channel) {
  const startedAt = new Date();
  const result = {
    channelId: String(channel._id),
    fetched: 0,
    upserted: 0,
    conflicts: 0,
    errors: 0,
  };

  try {
    const response = await fetch(channel.calendarUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch iCal: ${response.status}`);
    }

    const icsText = await response.text();
    const events = parseIcsText(icsText);
    result.fetched = events.length;

    for (const event of events) {
      const checkIn = event.start;
      const checkOut = event.end;
      if (!checkIn || !checkOut) {
        result.errors += 1;
        continue;
      }

      const conflictQuery = buildReserveConflictQuery(
        channel.condoId,
        channel.metadata?.apartmentUnit,
        checkIn,
        checkOut
      );
      conflictQuery.organizationId = channel.organizationId;

      const hasConflict = Boolean(await Reserve.findOne(conflictQuery).lean());
      if (hasConflict) {
        result.conflicts += 1;
      }

      await ExternalReservation.findOneAndUpdate(
        {
          organizationId: channel.organizationId,
          rentalChannelId: channel._id,
          externalEventId: event.uid,
        },
        {
          organizationId: channel.organizationId,
          rentalChannelId: channel._id,
          condoId: channel.condoId,
          apartmentUnit: channel.metadata?.apartmentUnit || "",
          externalEventId: event.uid,
          bookingName: event.summary || "External booking",
          checkIn,
          checkOut,
          sourceStatus: mapIcalStatus(event.status),
          conflictStatus: hasConflict ? "potential" : "none",
          rawPayload: event,
          lastSeenAt: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      result.upserted += 1;
    }

    channel.lastSyncedAt = new Date();
    channel.lastSyncStatus = result.errors > 0 ? "warning" : "ok";
    channel.lastSyncError = "";
    await channel.save();
  } catch (error) {
    channel.lastSyncedAt = startedAt;
    channel.lastSyncStatus = "error";
    channel.lastSyncError = error.message;
    await channel.save();
    throw error;
  }

  return result;
}

async function syncAllActiveChannels() {
  const channels = await RentalChannel.find({ status: "active" });
  const summary = {
    channels: channels.length,
    synced: 0,
    failed: 0,
    conflicts: 0,
    upserted: 0,
  };

  for (const channel of channels) {
    try {
      if (!await require("./saasCommercial").automationAllowed(channel.organizationId, "str")) continue;
      const result = await syncChannel(channel);
      summary.synced += 1;
      summary.conflicts += result.conflicts;
      summary.upserted += result.upserted;
    } catch (error) {
      summary.failed += 1;
    }
  }

  return summary;
}

module.exports = {
  syncChannel,
  syncAllActiveChannels,
  _parseIcsText: parseIcsText,
  _parseIcalDate: parseIcalDate,
  _buildReserveConflictQuery: buildReserveConflictQuery,
};
