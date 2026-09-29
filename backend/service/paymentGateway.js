"use strict";

const crypto = require("crypto");

const SUPPORTED_PROVIDERS = ["AZUL", "CARDNET"];
const DEFAULT_TIMEOUT_MS = 15000;

function normalizeProvider(provider) {
  return String(provider || "")
    .trim()
    .toUpperCase();
}

function isSupportedProvider(provider) {
  return SUPPORTED_PROVIDERS.includes(normalizeProvider(provider));
}

function mapExternalStatus(status) {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();

  if (
    ["approved", "paid", "completed", "succeeded", "success"].includes(
      normalized
    )
  ) {
    return "succeeded";
  }

  if (["processing", "pending", "authorized"].includes(normalized)) {
    return "processing";
  }

  if (["cancelled", "canceled", "voided"].includes(normalized)) {
    return "cancelled";
  }

  return "failed";
}

function getEnvValue(name, fallback = "") {
  return String(process.env[name] || fallback).trim();
}

function getProviderConfig(provider) {
  const normalized = normalizeProvider(provider);
  const prefix = normalized;

  return {
    provider: normalized,
    url:
      getEnvValue(`${prefix}_PAYMENT_URL`) ||
      getEnvValue(`${prefix}_API_URL`) ||
      getEnvValue(`PAYMENT_${prefix}_URL`),
    apiKey:
      getEnvValue(`${prefix}_API_KEY`) ||
      getEnvValue(`${prefix}_ACCESS_TOKEN`) ||
      getEnvValue(`PAYMENT_${prefix}_API_KEY`),
    merchantId:
      getEnvValue(`${prefix}_MERCHANT_ID`) ||
      getEnvValue(`PAYMENT_${prefix}_MERCHANT_ID`),
    terminalId:
      getEnvValue(`${prefix}_TERMINAL_ID`) ||
      getEnvValue(`PAYMENT_${prefix}_TERMINAL_ID`),
    username:
      getEnvValue(`${prefix}_USERNAME`) ||
      getEnvValue(`PAYMENT_${prefix}_USERNAME`),
    password:
      getEnvValue(`${prefix}_PASSWORD`) ||
      getEnvValue(`PAYMENT_${prefix}_PASSWORD`),
    timeoutMs: Number(getEnvValue(`${prefix}_TIMEOUT_MS`, DEFAULT_TIMEOUT_MS)),
  };
}

function buildGatewayPayload(input, config) {
  return {
    merchantId: config.merchantId,
    terminalId: config.terminalId,
    amount: Number(input.amount),
    currency: String(input.currency || "DOP").toUpperCase(),
    idempotencyKey: String(input.idempotencyKey || ""),
    invoiceId: String(input.invoiceId || ""),
    ownerId: String(input.ownerId || ""),
    description: input.description || "Condominium invoice payment",
    metadata: input.metadata || {},
  };
}

function buildGatewayHeaders(config) {
  const headers = {
    "Content-Type": "application/json",
    "Idempotency-Key": "",
  };

  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
    headers["X-API-Key"] = config.apiKey;
  }

  if (config.username && config.password) {
    const credentials = Buffer.from(
      `${config.username}:${config.password}`
    ).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }

  return headers;
}

function extractFirstString(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
}

function normalizeGatewayResponse(provider, payload, fallbackReference) {
  const response = payload || {};
  const data = response.data || response.result || response.payment || response;
  const status = mapExternalStatus(
    extractFirstString(data, [
      "status",
      "Status",
      "responseCode",
      "ResponseCode",
      "authorizationStatus",
      "eventType",
    ])
  );
  const providerTransactionId = extractFirstString(data, [
    "providerTransactionId",
    "transactionId",
    "TransactionId",
    "transaction_id",
    "orderId",
    "OrderId",
    "id",
  ]);
  const providerReference =
    extractFirstString(data, [
      "providerReference",
      "reference",
      "Reference",
      "authorizationCode",
      "AuthorizationCode",
      "authCode",
      "AuthCode",
    ]) || fallbackReference;

  return {
    ok: status === "succeeded" || status === "processing",
    status,
    provider: normalizeProvider(provider),
    providerTransactionId,
    providerReference,
    message:
      extractFirstString(data, ["message", "Message", "description"]) ||
      "Gateway response received",
    raw: response,
  };
}

async function postToGateway(input, config, fetchImpl) {
  if (!config.url) {
    throw new Error(`${config.provider} payment URL is not configured`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Number.isFinite(config.timeoutMs) ? config.timeoutMs : DEFAULT_TIMEOUT_MS
  );
  const payload = buildGatewayPayload(input, config);
  const headers = buildGatewayHeaders(config);
  headers["Idempotency-Key"] = payload.idempotencyKey;

  try {
    const response = await fetchImpl(config.url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const rawText = await response.text();
    let rawPayload = {};

    if (rawText) {
      try {
        rawPayload = JSON.parse(rawText);
      } catch (error) {
        rawPayload = { message: rawText };
      }
    }

    if (!response.ok) {
      const gatewayMessage =
        rawPayload?.message || rawPayload?.Message || response.statusText;
      throw new Error(
        `${config.provider} gateway rejected charge: ${gatewayMessage}`
      );
    }

    const normalized = normalizeGatewayResponse(
      config.provider,
      rawPayload,
      payload.idempotencyKey
    );

    if (!normalized.providerTransactionId) {
      normalized.providerTransactionId = `${config.provider}-${crypto
        .createHash("sha256")
        .update(`${payload.idempotencyKey}:${Date.now()}`)
        .digest("hex")
        .slice(0, 24)}`;
    }

    return normalized;
  } finally {
    clearTimeout(timeout);
  }
}

function createMockCharge(input, provider) {
  const providerTransactionId = `${provider}-${crypto.randomUUID()}`;
  const providerReference = `${provider}-REF-${Date.now()}`;

  return {
    ok: true,
    status: "succeeded",
    provider,
    providerTransactionId,
    providerReference,
    message: "Mock payment approved",
    raw: {
      mode: "mock",
      idempotencyKey: input.idempotencyKey,
      invoiceId: input.invoiceId,
      ownerId: input.ownerId,
    },
  };
}

async function createCharge(input, options = {}) {
  const provider = normalizeProvider(input.provider);
  if (!isSupportedProvider(provider)) {
    throw new Error("Unsupported payment provider");
  }

  const amount = Number(input.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const mode = String(process.env.PAYMENT_GATEWAY_MODE || "mock").toLowerCase();
  if (mode === "mock") {
    return createMockCharge(input, provider);
  }

  const fetchImpl = options.fetch || global.fetch;
  if (typeof fetchImpl !== "function") {
    throw new Error("Fetch API is required for live payment gateway mode");
  }

  return postToGateway(input, getProviderConfig(provider), fetchImpl);
}

function verifyWebhookSignature(signatureHeader, secret) {
  const received = String(signatureHeader || "");
  const expected = String(secret || "");

  if (!received || !expected) {
    return false;
  }

  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

function normalizeWebhookPayload(payload) {
  return {
    provider: normalizeProvider(payload?.provider),
    providerTransactionId: String(payload?.providerTransactionId || "").trim(),
    providerReference: String(payload?.providerReference || "").trim(),
    status: mapExternalStatus(payload?.status || payload?.eventType),
    raw: payload || {},
  };
}

module.exports = {
  SUPPORTED_PROVIDERS,
  normalizeProvider,
  isSupportedProvider,
  mapExternalStatus,
  getProviderConfig,
  buildGatewayPayload,
  normalizeGatewayResponse,
  createCharge,
  verifyWebhookSignature,
  normalizeWebhookPayload,
};
