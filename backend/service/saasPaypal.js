"use strict";
const { enabled, fail } = require("./saasCommercial");
const environment = () => process.env.SAAS_PAYPAL_ENV === "live" ? "live" : "sandbox";
function config() {
  if (!enabled("SAAS_PAYPAL_ENABLED")) fail("PayPal todavía no está habilitado", 503);
  const clientId = process.env.SAAS_PAYPAL_CLIENT_ID, secret = process.env.SAAS_PAYPAL_SECRET;
  if (!clientId || !secret || !process.env.SAAS_PAYPAL_WEBHOOK_ID) fail("Completa la configuración de PayPal", 503);
  return { clientId, secret, base: environment() === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com" };
}
async function request(path, { method = "GET", body, key } = {}) {
  const cfg = config();
  const tokenResponse = await fetch(`${cfg.base}/v1/oauth2/token`, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${cfg.clientId}:${cfg.secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials", signal: AbortSignal.timeout(15000) });
  if (!tokenResponse.ok) fail("No se pudo autenticar con PayPal", 502);
  const token = await tokenResponse.json();
  const response = await fetch(`${cfg.base}${path}`, { method, headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json", ...(key ? { "PayPal-Request-Id": key } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000) });
  if (!response.ok) fail("PayPal no pudo completar la operación; vuelve a intentarlo", 502);
  return response.status === 204 ? {} : response.json();
}
function moneyMinor(value) {
  if (!/^\d+(?:\.\d{1,2})?$/.test(String(value))) fail("Importe PayPal inválido");
  const [whole, fraction = ""] = String(value).split(".");
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(amount)) fail("Importe PayPal inválido");
  return amount;
}
async function verifyWebhook(headers, event) {
  const names = ["paypal-auth-algo", "paypal-cert-url", "paypal-transmission-id", "paypal-transmission-sig", "paypal-transmission-time"];
  if (names.some(name => !headers[name] || typeof headers[name] !== "string")) fail("Firma PayPal requerida", 400);
  const result = await request("/v1/notifications/verify-webhook-signature", { method: "POST", body: {
    auth_algo: headers[names[0]], cert_url: headers[names[1]], transmission_id: headers[names[2]], transmission_sig: headers[names[3]], transmission_time: headers[names[4]], webhook_id: process.env.SAAS_PAYPAL_WEBHOOK_ID, webhook_event: event,
  } });
  if (result.verification_status !== "SUCCESS") fail("Firma PayPal inválida", 400);
}
const cancel = id => request(`/v1/billing/subscriptions/${encodeURIComponent(id)}/cancel`, { method: "POST", body: { reason: "Cancelación solicitada en Comunard" } });
module.exports = { environment, config, request, verifyWebhook, moneyMinor, cancel };
