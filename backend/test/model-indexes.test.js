"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const Reserve = require("../models/reserves");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Property = require("../models/property");
const Condominium = require("../models/condominio");
const RentalChannel = require("../models/rentalChannel");
const ExternalReservation = require("../models/externalReservation");
const GuestAccess = require("../models/guestAccess");
const AmenityReservation = require("../models/amenityReservation");
const RentalStay = require("../models/rentalStay");
const PaymentTransaction = require("../models/paymentTransaction");
const CommunicationLog = require("../models/communicationLog");
const Inquiry = require("../models/inquiry");

function hasNamedIndex(model, name, keys) {
  return model.schema.indexes().some(([indexKeys, options]) => {
    return (
      options &&
      options.name === name &&
      JSON.stringify(indexKeys) === JSON.stringify(keys)
    );
  });
}

test("reserve model has indexes for availability, expiration and guest cleanup", () => {
  assert.equal(
    hasNamedIndex(Reserve, "reserve_availability_lookup", {
      condoId: 1,
      areaToReserve: 1,
      checkIn: 1,
      checkOut: 1,
    }),
    true
  );
  assert.equal(
    hasNamedIndex(Reserve, "reserve_expiration_lookup", {
      condoId: 1,
      status: 1,
      checkOut: 1,
    }),
    true
  );
  assert.equal(
    hasNamedIndex(Reserve, "reserve_guest_cleanup_lookup", {
      status: 1,
      createdAt: 1,
    }),
    true
  );
});

test("owner and family models have relationship lookup indexes", () => {
  assert.equal(
    hasNamedIndex(Owner, "owner_created_by_status_lookup", {
      createdBy: 1,
      status: 1,
    }),
    true
  );
  assert.equal(
    hasNamedIndex(Family, "family_created_by_status_lookup", {
      createdBy: 1,
      status: 1,
    }),
    true
  );
});

test("inquiry model has a condominium status count index", () => {
  assert.equal(
    hasNamedIndex(Inquiry, "inquiry_condo_active_status_lookup", {
      condominiumId: 1,
      isActive: 1,
      status: 1,
    }),
    true
  );
});

test("property and condominium models have frequent query indexes", () => {
  assert.equal(
    hasNamedIndex(Property, "property_owner_lookup", { ownerId: 1 }),
    true
  );
  assert.equal(
    hasNamedIndex(Condominium, "condominium_created_by_status_lookup", {
      createdBy: 1,
      status: 1,
    }),
    true
  );
});

test("phase 3 STR models have compatibility and conflict indexes", () => {
  assert.equal(
    hasNamedIndex(RentalChannel, "rental_channel_owner_status_lookup", {
      condoId: 1,
      ownerId: 1,
      status: 1,
    }),
    true
  );
  assert.equal(
    hasNamedIndex(ExternalReservation, "external_reservation_event_unique", {
      rentalChannelId: 1,
      externalEventId: 1,
    }),
    true
  );
  assert.equal(
    hasNamedIndex(ExternalReservation, "external_reservation_conflict_lookup", {
      condoId: 1,
      conflictStatus: 1,
      checkIn: 1,
    }),
    true
  );
});

test("phase 3 separated domain models have operational indexes", () => {
  assert.equal(
    hasNamedIndex(GuestAccess, "guest_access_lookup", {
      condoId: 1,
      apartmentUnit: 1,
      status: 1,
      validFrom: 1,
    }),
    true
  );
  assert.equal(
    hasNamedIndex(
      AmenityReservation,
      "amenity_reservation_availability_lookup",
      {
        condoId: 1,
        amenityName: 1,
        checkIn: 1,
        checkOut: 1,
      }
    ),
    true
  );
  assert.equal(
    hasNamedIndex(RentalStay, "rental_stay_owner_status_lookup", {
      ownerId: 1,
      sourceType: 1,
      status: 1,
    }),
    true
  );
});

test("phase 4 payment transaction model has idempotency and reconciliation indexes", () => {
  assert.equal(
    hasNamedIndex(
      PaymentTransaction,
      "payment_tx_provider_idempotency_unique",
      {
        provider: 1,
        idempotencyKey: 1,
      }
    ),
    true
  );
  assert.equal(
    hasNamedIndex(PaymentTransaction, "payment_tx_condo_status_lookup", {
      condominiumId: 1,
      status: 1,
      attemptedAt: -1,
    }),
    true
  );
  assert.equal(
    hasNamedIndex(PaymentTransaction, "payment_tx_invoice_status_lookup", {
      invoiceId: 1,
      status: 1,
    }),
    true
  );
});

test("phase 4 communication log model has reminder lookup indexes", () => {
  assert.equal(
    hasNamedIndex(CommunicationLog, "communication_invoice_channel_type_lookup", {
      invoiceId: 1,
      channel: 1,
      type: 1,
      sentAt: -1,
    }),
    true
  );
  assert.equal(
    hasNamedIndex(CommunicationLog, "communication_condo_channel_type_lookup", {
      condominiumId: 1,
      channel: 1,
      type: 1,
      sentAt: -1,
    }),
    true
  );
});
