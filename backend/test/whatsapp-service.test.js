"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizePhoneNumber,
  buildTextMessagePayload,
  buildPaymentPortalLink,
  buildPaymentReminderMessage,
  sendWhatsappText,
} = require("../service/whatsappService");

test("normalizePhoneNumber prepares Dominican local numbers for WhatsApp", () => {
  assert.equal(normalizePhoneNumber("(809) 555-1212"), "18095551212");
  assert.equal(normalizePhoneNumber("+1 829 555 1212"), "18295551212");
  assert.equal(normalizePhoneNumber(""), "");
});

test("buildTextMessagePayload creates WhatsApp Cloud API text payload", () => {
  const payload = buildTextMessagePayload("18095551212", "Hola");

  assert.equal(payload.messaging_product, "whatsapp");
  assert.equal(payload.to, "18095551212");
  assert.equal(payload.type, "text");
  assert.equal(payload.text.body, "Hola");
  assert.equal(payload.text.preview_url, true);
});

test("buildPaymentPortalLink appends invoiceId to configured portal", () => {
  const originalPortal = process.env.PAYMENT_PORTAL_URL;
  process.env.PAYMENT_PORTAL_URL = "https://app.example.test/payments";

  assert.equal(
    buildPaymentPortalLink("invoice-1"),
    "https://app.example.test/payments?invoiceId=invoice-1"
  );

  if (originalPortal === undefined) {
    delete process.env.PAYMENT_PORTAL_URL;
  } else {
    process.env.PAYMENT_PORTAL_URL = originalPortal;
  }
});

test("buildPaymentReminderMessage formats reminder and confirmation messages", () => {
  const invoice = {
    _id: "invoice-1",
    invoice_number: "1001",
    amount: 2500,
    dueDate: new Date("2026-06-20T00:00:00.000Z"),
    ownerId: { name: "Ana", lastname: "Perez" },
    condominiumId: { alias: "Torre Central" },
  };

  const reminder = buildPaymentReminderMessage(invoice, {
    paymentLink: "https://pay.example.test/invoice-1",
  });
  assert.match(reminder, /Ana Perez/);
  assert.match(reminder, /Factura: 1001/);
  assert.match(reminder, /DOP 2,500.00/);
  assert.match(reminder, /https:\/\/pay\.example\.test\/invoice-1/);

  const confirmation = buildPaymentReminderMessage(invoice, {
    type: "payment_confirmation",
  });
  assert.match(confirmation, /confirmamos el pago/);
  assert.match(confirmation, /1001/);
});

test("sendWhatsappText returns mock result by default without network", async () => {
  const result = await sendWhatsappText("8095551212", "Mensaje de prueba", {
    config: { mode: "mock" },
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, "mock");
  assert.equal(result.payload.to, "18095551212");
});
