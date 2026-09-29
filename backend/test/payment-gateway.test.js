"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeProvider,
  isSupportedProvider,
  mapExternalStatus,
  getProviderConfig,
  buildGatewayPayload,
  normalizeGatewayResponse,
  createCharge,
  verifyWebhookSignature,
  normalizeWebhookPayload,
} = require("../service/paymentGateway");

test("normalizeProvider and isSupportedProvider validate provider names", () => {
  assert.equal(normalizeProvider(" azul "), "AZUL");
  assert.equal(normalizeProvider("cardnet"), "CARDNET");
  assert.equal(isSupportedProvider("AZUL"), true);
  assert.equal(isSupportedProvider("stripe"), false);
});

test("mapExternalStatus maps gateway events to internal status", () => {
  assert.equal(mapExternalStatus("approved"), "succeeded");
  assert.equal(mapExternalStatus("pending"), "processing");
  assert.equal(mapExternalStatus("voided"), "cancelled");
  assert.equal(mapExternalStatus("error"), "failed");
});

test("verifyWebhookSignature compares signatures safely", () => {
  assert.equal(verifyWebhookSignature("secret-1", "secret-1"), true);
  assert.equal(verifyWebhookSignature("secret-1", "secret-2"), false);
  assert.equal(verifyWebhookSignature("", "secret-2"), false);
});

test("normalizeWebhookPayload returns normalized fields", () => {
  const payload = normalizeWebhookPayload({
    provider: "azul",
    providerTransactionId: "abc-123",
    providerReference: "ref-7",
    status: "approved",
    extra: true,
  });

  assert.equal(payload.provider, "AZUL");
  assert.equal(payload.providerTransactionId, "abc-123");
  assert.equal(payload.providerReference, "ref-7");
  assert.equal(payload.status, "succeeded");
  assert.equal(payload.raw.extra, true);
});

test("getProviderConfig reads provider specific payment settings", () => {
  const originalUrl = process.env.AZUL_PAYMENT_URL;
  const originalKey = process.env.AZUL_API_KEY;
  const originalMerchant = process.env.AZUL_MERCHANT_ID;

  process.env.AZUL_PAYMENT_URL = "https://payments.example.test/azul";
  process.env.AZUL_API_KEY = "azul-key";
  process.env.AZUL_MERCHANT_ID = "merchant-1";

  const config = getProviderConfig("azul");
  assert.equal(config.provider, "AZUL");
  assert.equal(config.url, "https://payments.example.test/azul");
  assert.equal(config.apiKey, "azul-key");
  assert.equal(config.merchantId, "merchant-1");

  if (originalUrl === undefined) {
    delete process.env.AZUL_PAYMENT_URL;
  } else {
    process.env.AZUL_PAYMENT_URL = originalUrl;
  }
  if (originalKey === undefined) {
    delete process.env.AZUL_API_KEY;
  } else {
    process.env.AZUL_API_KEY = originalKey;
  }
  if (originalMerchant === undefined) {
    delete process.env.AZUL_MERCHANT_ID;
  } else {
    process.env.AZUL_MERCHANT_ID = originalMerchant;
  }
});

test("buildGatewayPayload preserves the controller service contract", () => {
  const payload = buildGatewayPayload(
    {
      amount: 1500,
      currency: "dop",
      idempotencyKey: "idem-1",
      invoiceId: "invoice-1",
      ownerId: "owner-1",
    },
    {
      merchantId: "merchant-1",
      terminalId: "terminal-1",
    }
  );

  assert.equal(payload.amount, 1500);
  assert.equal(payload.currency, "DOP");
  assert.equal(payload.idempotencyKey, "idem-1");
  assert.equal(payload.invoiceId, "invoice-1");
  assert.equal(payload.ownerId, "owner-1");
  assert.equal(payload.merchantId, "merchant-1");
  assert.equal(payload.terminalId, "terminal-1");
});

test("normalizeGatewayResponse maps real provider style payloads", () => {
  const normalized = normalizeGatewayResponse(
    "CARDNET",
    {
      data: {
        TransactionId: "tx-77",
        AuthorizationCode: "auth-77",
        ResponseCode: "approved",
        Message: "approved",
      },
    },
    "idem-77"
  );

  assert.equal(normalized.provider, "CARDNET");
  assert.equal(normalized.providerTransactionId, "tx-77");
  assert.equal(normalized.providerReference, "auth-77");
  assert.equal(normalized.status, "succeeded");
  assert.equal(normalized.ok, true);
});

test("createCharge posts to configured gateway in live mode", async () => {
  const originalMode = process.env.PAYMENT_GATEWAY_MODE;
  const originalUrl = process.env.CARDNET_PAYMENT_URL;
  const originalKey = process.env.CARDNET_API_KEY;

  process.env.PAYMENT_GATEWAY_MODE = "live";
  process.env.CARDNET_PAYMENT_URL = "https://payments.example.test/cardnet";
  process.env.CARDNET_API_KEY = "cardnet-key";

  const calls = [];
  const result = await createCharge(
    {
      provider: "CARDNET",
      amount: 2500,
      currency: "DOP",
      idempotencyKey: "idem-live-1",
      invoiceId: "invoice-live-1",
      ownerId: "owner-live-1",
    },
    {
      fetch: async (url, options) => {
        calls.push({ url, options });
        return {
          ok: true,
          statusText: "OK",
          text: async () =>
            JSON.stringify({
              transactionId: "cardnet-tx-1",
              reference: "cardnet-ref-1",
              status: "approved",
            }),
        };
      },
    }
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://payments.example.test/cardnet");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.headers.Authorization, "Bearer cardnet-key");
  assert.equal(calls[0].options.headers["Idempotency-Key"], "idem-live-1");
  assert.equal(result.providerTransactionId, "cardnet-tx-1");
  assert.equal(result.status, "succeeded");

  if (originalMode === undefined) {
    delete process.env.PAYMENT_GATEWAY_MODE;
  } else {
    process.env.PAYMENT_GATEWAY_MODE = originalMode;
  }
  if (originalUrl === undefined) {
    delete process.env.CARDNET_PAYMENT_URL;
  } else {
    process.env.CARDNET_PAYMENT_URL = originalUrl;
  }
  if (originalKey === undefined) {
    delete process.env.CARDNET_API_KEY;
  } else {
    process.env.CARDNET_API_KEY = originalKey;
  }
});
