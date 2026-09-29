"use strict";

const https = require("https");

function getWhatsAppConfig() {
  return {
    mode: String(process.env.WHATSAPP_MODE || "mock").toLowerCase(),
    apiVersion: process.env.WHATSAPP_API_VERSION || "v19.0",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    timeoutMs: Number(process.env.WHATSAPP_TIMEOUT_MS || 10000),
  };
}

function normalizePhoneNumber(phone, defaultCountryCode = "1") {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.length === 10) {
    return `${defaultCountryCode}${digits}`;
  }

  return digits;
}

function buildTextMessagePayload(to, body) {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: {
      preview_url: true,
      body,
    },
  };
}

function buildPaymentPortalLink(invoiceId) {
  const baseUrl = String(
    process.env.PAYMENT_PORTAL_URL || process.env.FRONTEND_URL || ""
  ).trim();

  if (!baseUrl) {
    return "";
  }

  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}invoiceId=${encodeURIComponent(invoiceId)}`;
}

function formatMoney(amount, currency = "DOP") {
  const numeric = Number(amount || 0);
  return `${currency} ${numeric.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function buildPaymentReminderMessage(invoice, options = {}) {
  const owner = invoice?.ownerId || {};
  const condo = invoice?.condominiumId || {};
  const type = String(options.type || "payment_reminder").toLowerCase();
  const invoiceNumber = invoice?.invoice_number || String(invoice?._id || "");
  const amount = formatMoney(invoice?.amount, options.currency || "DOP");
  const dueDate = invoice?.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString("es-DO")
    : "pendiente";
  const portalLink =
    options.paymentLink || buildPaymentPortalLink(String(invoice?._id || ""));
  const ownerName = `${owner?.name || ""} ${owner?.lastname || ""}`.trim();
  const condoName = condo?.alias || "su condominio";
  const note = String(options.note || "").trim();

  if (type === "payment_confirmation") {
    return [
      `Hola ${ownerName || "propietario"}, confirmamos el pago de la factura ${invoiceNumber} por ${amount}.`,
      `Condominio: ${condoName}.`,
      note ? `Nota: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Hola ${ownerName || "propietario"}, tienes una factura pendiente en ${condoName}.`,
    `Factura: ${invoiceNumber}`,
    `Monto: ${amount}`,
    `Fecha limite: ${dueDate}`,
    portalLink ? `Pagar o revisar: ${portalLink}` : "",
    note ? `Nota: ${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizePayload(data) {
  if (typeof data === "string") {
    return JSON.parse(data);
  }

  return data;
}

function postWhatsAppMessage(payload, config = getWhatsAppConfig()) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(
      {
        host: "graph.facebook.com",
        path: `/${config.apiVersion}/${config.phoneNumberId}/messages`,
        method: "POST",
        timeout: config.timeoutMs,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let responseBody = "";
        res.on("data", (chunk) => {
          responseBody += chunk;
        });
        res.on("end", () => {
          let parsed = responseBody;
          try {
            parsed = responseBody ? JSON.parse(responseBody) : {};
          } catch (error) {
            parsed = { raw: responseBody };
          }

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ ok: true, statusCode: res.statusCode, data: parsed });
            return;
          }

          reject(
            new Error(
              `WhatsApp API responded ${res.statusCode}: ${responseBody}`
            )
          );
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("WhatsApp API request timed out"));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function sendWhatsappMessage(data, options = {}) {
  const config = options.config || getWhatsAppConfig();
  const payload = normalizePayload(data);

  if (config.mode !== "live") {
    return {
      ok: true,
      mode: "mock",
      providerMessageId: `mock-${Date.now()}`,
      payload,
    };
  }

  if (!config.phoneNumberId || !config.accessToken) {
    throw new Error(
      "WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN are required in live mode"
    );
  }

  const result = await postWhatsAppMessage(payload, config);
  const providerMessageId = result?.data?.messages?.[0]?.id || null;

  return {
    ok: true,
    mode: "live",
    providerMessageId,
    response: result.data,
  };
}

async function sendWhatsappText(to, body, options = {}) {
  const normalizedTo = normalizePhoneNumber(
    to,
    options.defaultCountryCode || "1"
  );

  if (!normalizedTo) {
    throw new Error("Recipient phone is required");
  }

  return sendWhatsappMessage(buildTextMessagePayload(normalizedTo, body), options);
}

module.exports = {
  getWhatsAppConfig,
  normalizePhoneNumber,
  buildTextMessagePayload,
  buildPaymentPortalLink,
  buildPaymentReminderMessage,
  sendWhatsappMessage,
  sendWhatsappText,
};
