"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const strController = require("../controllers/str");

const { toNotificationCreator, buildPreRegistrationSuggestion } =
  strController._helpers;

test("toNotificationCreator maps role variants used by auth", () => {
  assert.deepEqual(toNotificationCreator("ROLE_ADMIN"), {
    createdByModel: "Admin",
    createdByRole: "ADMIN",
  });

  assert.deepEqual(toNotificationCreator("ROLE_STAFF_ADMIN"), {
    createdByModel: "Staff_Admin",
    createdByRole: "STAFF_ADMIN",
  });

  assert.deepEqual(toNotificationCreator("ROLE_STAFF"), {
    createdByModel: "Staff",
    createdByRole: "STAFF",
  });

  assert.equal(toNotificationCreator("ROLE_OWNER"), null);
});

test("buildPreRegistrationSuggestion uses reservation defaults with overrides", () => {
  const reservation = {
    bookingName: "John Guest",
    checkIn: new Date("2026-07-02T15:00:00.000Z"),
    checkOut: new Date("2026-07-05T11:00:00.000Z"),
  };

  const fallbackSuggestion = buildPreRegistrationSuggestion(reservation, {});
  assert.equal(fallbackSuggestion.guestFullname, "John Guest");
  assert.equal(fallbackSuggestion.guestPhone, "PENDIENTE");
  assert.equal(fallbackSuggestion.status, "suggested");

  const customSuggestion = buildPreRegistrationSuggestion(reservation, {
    guestFullname: "  Jane Doe  ",
    guestPhone: "8090001111",
  });
  assert.equal(customSuggestion.guestFullname, "Jane Doe");
  assert.equal(customSuggestion.guestPhone, "8090001111");
  assert.deepEqual(customSuggestion.validFrom, reservation.checkIn);
  assert.deepEqual(customSuggestion.validUntil, reservation.checkOut);
});
