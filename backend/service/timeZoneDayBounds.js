"use strict";

const DEFAULT_CONDOMINIUM_TIME_ZONE = "America/Santo_Domingo";

function getDateTimeParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  return formatter.formatToParts(date).reduce((parts, part) => {
    if (part.type !== "literal") {
      parts[part.type] = Number(part.value);
    }
    return parts;
  }, {});
}

function zonedDateTimeToUtc(dateParts, timeZone) {
  const targetTimestamp = Date.UTC(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    dateParts.hour || 0,
    dateParts.minute || 0,
    dateParts.second || 0
  );
  let candidateTimestamp = targetTimestamp;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const actual = getDateTimeParts(new Date(candidateTimestamp), timeZone);
    const actualTimestamp = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second
    );
    const correction = targetTimestamp - actualTimestamp;

    candidateTimestamp += correction;
    if (correction === 0) {
      break;
    }
  }

  return new Date(candidateTimestamp);
}

function addCalendarDay({ year, month, day }) {
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1));
  return {
    year: nextDay.getUTCFullYear(),
    month: nextDay.getUTCMonth() + 1,
    day: nextDay.getUTCDate(),
  };
}

function getTimeZoneDayBounds(
  now = new Date(),
  timeZone = process.env.CONDOMINIUM_TIME_ZONE ||
    DEFAULT_CONDOMINIUM_TIME_ZONE
) {
  const currentDate = getDateTimeParts(now, timeZone);
  const nextDate = addCalendarDay(currentDate);
  const startOfDay = {
    year: currentDate.year,
    month: currentDate.month,
    day: currentDate.day,
    hour: 0,
    minute: 0,
    second: 0,
  };

  return {
    start: zonedDateTimeToUtc(startOfDay, timeZone),
    end: zonedDateTimeToUtc(nextDate, timeZone),
    timeZone,
  };
}

module.exports = {
  DEFAULT_CONDOMINIUM_TIME_ZONE,
  getTimeZoneDayBounds,
};
