"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  _parseIcsText,
  _parseIcalDate,
  _buildReserveConflictQuery,
} = require("../service/icalSync");

test("parseIcalDate supports all-day and UTC datetime formats", () => {
  const allDay = _parseIcalDate("20260603");
  const utc = _parseIcalDate("20260603T153000Z");

  assert.equal(allDay instanceof Date, true);
  assert.equal(utc instanceof Date, true);
  assert.equal(Number.isNaN(allDay.getTime()), false);
  assert.equal(Number.isNaN(utc.getTime()), false);
});

test("parseIcsText extracts VEVENT entries with uid/start/end", () => {
  const sampleIcs = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "UID:test-event-1",
    "SUMMARY:Guest Booking",
    "DTSTART:20260610T150000Z",
    "DTEND:20260612T110000Z",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  const events = _parseIcsText(sampleIcs);
  assert.equal(events.length, 1);
  assert.equal(events[0].uid, "test-event-1");
  assert.equal(events[0].summary, "Guest Booking");
  assert.equal(events[0].status, "confirmed");
  assert.equal(events[0].start instanceof Date, true);
  assert.equal(events[0].end instanceof Date, true);
});

test("parseIcsText reads STR Airbnb A-101 fixture", () => {
  const fixturePath = path.join(
    __dirname,
    "../../frontend/src/assets/str/test-airbnb-unit-a-101.ics"
  );
  const fixture = fs.readFileSync(fixturePath, "utf8");
  const events = _parseIcsText(fixture);

  assert.equal(events.length, 4);
  assert.deepEqual(
    events.map((event) => ({
      uid: event.uid,
      summary: event.summary,
      status: event.status,
      checkIn: event.start.toISOString(),
      checkOut: event.end.toISOString(),
    })),
    [
      {
        uid: "test-airbnb-a101-20260710-20260714@condominiosapp.local",
        summary: "Airbnb - Maria Castillo",
        status: "confirmed",
        checkIn: "2026-07-10T00:00:00.000Z",
        checkOut: "2026-07-14T00:00:00.000Z",
      },
      {
        uid: "test-airbnb-a101-20260718-20260721@condominiosapp.local",
        summary: "Airbnb - Luis Fernandez",
        status: "confirmed",
        checkIn: "2026-07-18T00:00:00.000Z",
        checkOut: "2026-07-21T00:00:00.000Z",
      },
      {
        uid: "test-airbnb-a101-20260725-20260728@condominiosapp.local",
        summary: "Airbnb - Cancelled hold",
        status: "cancelled",
        checkIn: "2026-07-25T00:00:00.000Z",
        checkOut: "2026-07-28T00:00:00.000Z",
      },
      {
        uid: "test-airbnb-a101-20260802-20260807@condominiosapp.local",
        summary: "Airbnb - John Miller",
        status: "confirmed",
        checkIn: "2026-08-02T19:00:00.000Z",
        checkOut: "2026-08-07T15:00:00.000Z",
      },
    ]
  );
});

test("buildReserveConflictQuery creates overlap query for active internal bookings", () => {
  const query = _buildReserveConflictQuery(
    "condo-1",
    "A-101",
    new Date("2026-06-10T15:00:00.000Z"),
    new Date("2026-06-12T11:00:00.000Z")
  );

  assert.deepEqual(query.condoId, "condo-1");
  assert.deepEqual(query.apartmentUnit, "A-101");
  assert.deepEqual(query.status, { $in: ["Reserved", "Guest"] });
  assert.equal(Object.prototype.hasOwnProperty.call(query, "checkIn"), true);
  assert.equal(Object.prototype.hasOwnProperty.call(query, "checkOut"), true);
});
