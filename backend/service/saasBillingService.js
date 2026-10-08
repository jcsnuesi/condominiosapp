"use strict";
const mongoose = require("mongoose");
const crypto = require("node:crypto");
const Subscription = require("../models/saasSubscription");
const Membership = require("../models/saasMembership");
const { Charge, Event } = require("../models/saasBilling");
const Plan = require("../models/saasPlan");
const commercial = require("./saasCommercial");
const paypal = require("./saasPaypal");
const DAY = 86400000;
function subscriptionContext(auth, actorId) {
  if (auth?.isOwnerAdmin) return { subjectType: "ORGANIZATION", subjectId: auth.organizationId, actorId };
  if (auth?.contextType === "PERSONAL_OWNER") return { subjectType: "PERSONAL_OWNER", subjectId: actorId, actorId };
  commercial.fail("Solo el titular puede gestionar su suscripción", 403);
}
async function publishPlan(id) {
  await requireLiveBackup();
  const plan = await Plan.findOne({ _id: id, kind: "PAID", status: "active" }).lean();
  if (!plan) commercial.fail("Selecciona un plan de pago activo");
  if (plan.paypalPlanId) { if (plan.paypalEnvironment !== paypal.environment()) commercial.fail("El plan pertenece a otro entorno PayPal", 409); return plan; }
  await commercial.defaultFree(plan.subjectType);
  const terms = commercial.snapshot(plan);
  const digest = crypto.createHash("sha256").update(JSON.stringify(terms)).digest("hex").slice(0, 20);
  const locked = await Plan.findOneAndUpdate({ _id: id, updatedAt: plan.updatedAt }, { $set: { publishing: true } }, { returnDocument: "after" }).lean();
  if (!locked) commercial.fail("El plan cambió; vuelve a intentarlo", 409);
  const product = await paypal.request("/v1/catalogs/products", { method: "POST", key: `product-${id}`, body: { name: plan.name, type: "SERVICE", category: "SOFTWARE" } });
  const remote = await paypal.request("/v1/billing/plans", { method: "POST", key: `plan-${digest}`, body: {
    product_id: product.id, name: plan.name, status: "ACTIVE", billing_cycles: [{ frequency: { interval_unit: "MONTH", interval_count: 1 }, tenure_type: "REGULAR", sequence: 1, total_cycles: 0, pricing_scheme: { fixed_price: { value: (plan.priceMinor / 100).toFixed(2), currency_code: "USD" } } }],
    payment_preferences: { auto_bill_outstanding: false, payment_failure_threshold: 1 },
  } });
  return Plan.findByIdAndUpdate(id, { $set: { paypalPlanId: remote.id, paypalEnvironment: paypal.environment(), publishing: false } }, { returnDocument: "after" }).lean();
}
async function createSubscription(context, planId, requestId) {
  paypal.config();
  await Subscription.init();
  await requireLiveBackup();
  if (!/^[A-Za-z0-9-]{16,64}$/.test(String(requestId))) commercial.fail("Indica una clave de contratación válida");
  const plan = await Plan.findOne({ _id: planId, subjectType: context.subjectType, kind: "PAID", status: "active", paypalEnvironment: paypal.environment(), paypalPlanId: { $type: "string" } }).lean();
  if (!plan) commercial.fail("Este plan no está publicado en PayPal");
  await commercial.defaultFree(context.subjectType);
  let key = crypto.createHash("sha256").update(`${context.subjectType}:${context.subjectId}:${requestId}`).digest("hex").slice(0, 36);
  let subscription = await Subscription.findOne({ requestKey: key }).lean();
  if (subscription && String(subscription.planId) !== String(planId)) commercial.fail("La solicitud corresponde a otro plan", 409);
  if (!subscription) {
    const pending = await Subscription.findOne({ subjectType: context.subjectType, subjectId: context.subjectId, open: true }).lean();
    if (pending) {
      if (pending.state !== "PENDING" || String(pending.planId) !== String(planId) || pending.environment !== paypal.environment()) commercial.fail("Ya hay una suscripción abierta; cancélala y espera al fin del período", 409);
      subscription = pending; key = pending.requestKey;
    } else {
      try { subscription = (await Subscription.create({ ...context, planId, terms: commercial.snapshot(plan), environment: paypal.environment(), requestKey: key })).toObject(); }
      catch (e) { if (e.code === 11000) commercial.fail("Ya hay una contratación abierta", 409); throw e; }
    }
  }
  if (!subscription.open) commercial.fail("Esta contratación ya terminó; inicia otra solicitud", 409);
  if (subscription.approvalUrl || subscription.providerId) return subscription;
  if (Date.now() - new Date(subscription.createdAt).getTime() > DAY) commercial.fail("La respuesta de contratación quedó pendiente; soporte debe conciliarla antes de repetirla", 409);
  const base = process.env.FRONTEND_BASE_URL || "https://condapp.hsantosnuesi.com";
  const remote = await paypal.request("/v1/billing/subscriptions", { method: "POST", key, body: {
    plan_id: plan.paypalPlanId, custom_id: String(subscription._id), application_context: { brand_name: "Comunard", user_action: "SUBSCRIBE_NOW", return_url: `${base.replace(/\/$/, "")}/#/subscription`, cancel_url: `${base.replace(/\/$/, "")}/#/subscription` },
  } });
  const approvalUrl = remote.links?.find(link => link.rel === "approve")?.href;
  if (!remote.id || !approvalUrl || !/^https:\/\/(?:www\.)?(?:sandbox\.)?paypal\.com\//.test(approvalUrl)) commercial.fail("Respuesta PayPal incompleta", 502);
  return Subscription.findByIdAndUpdate(subscription._id, { $set: { providerId: remote.id, approvalUrl } }, { returnDocument: "after" }).lean();
}
function nextMonth(date) {
  const next = new Date(date); const day = next.getUTCDate(); next.setUTCDate(1); next.setUTCMonth(next.getUTCMonth() + 1);
  const last = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate(); next.setUTCDate(Math.min(day, last)); return next;
}
async function audit(subscription, action, session, before, after) {
  await require("../models/platformAudit").create([{ actorId: subscription.actorId, targetType: subscription.subjectType, targetId: subscription.subjectId, action, before, after }], { session });
}
async function processWebhook(headers, event) {
  await paypal.verifyWebhook(headers, event);
  await Promise.all([Event.init(), Charge.init(), Subscription.init()]);
  return processVerifiedEvent(event);
}
async function processVerifiedEvent(event) {
  if (typeof event.id !== "string" || !event.event_type || !event.resource) commercial.fail("Evento inválido");
  if (await Event.exists({ providerId: event.id, environment: paypal.environment(), processedAt: { $ne: null } })) return;
  const resource = event.resource;
  const original = resource.sale_id && await Charge.findOne({ providerId: resource.sale_id, environment: paypal.environment(), kind: "PAYMENT" }).lean();
  const originalSubscription = original && await Subscription.findById(original.subscriptionId).lean();
  const originalSale = resource.sale_id && !original && !resource.billing_agreement_id ? await paypal.request(`/v1/payments/sale/${encodeURIComponent(resource.sale_id)}`) : null;
  const providerId = resource.billing_agreement_id || originalSubscription?.providerId || originalSale?.billing_agreement_id || (event.event_type.startsWith("BILLING.SUBSCRIPTION.") ? resource.id : null);
  if (!providerId) return;
  let subscription = await Subscription.findOne({ providerId, environment: paypal.environment() }).lean();
  const remote = await paypal.request(`/v1/billing/subscriptions/${encodeURIComponent(providerId)}`);
  // A verified event may beat the HTTP response that binds the new provider id.
  if (!subscription && mongoose.isObjectIdOrHexString(remote.custom_id)) {
    const pending = await Subscription.findOne({ _id: remote.custom_id, environment: paypal.environment(), providerId: null, state: "PENDING", open: true }).lean();
    const plan = pending && await Plan.findById(pending.planId).lean();
    if (pending && plan?.paypalPlanId === remote.plan_id) subscription = await Subscription.findOneAndUpdate({ _id: pending._id, providerId: null, open: true }, { $set: { providerId } }, { returnDocument: "after" }).lean();
  }
  if (!subscription) return; // Another product on the merchant account is not Comunard.
  if (remote.custom_id !== String(subscription._id)) commercial.fail("La suscripción no corresponde a esta cuenta", 409);
  const payment = event.event_type === "PAYMENT.SALE.COMPLETED";
  const refund = event.event_type === "PAYMENT.SALE.REFUNDED";
  const reversal = event.event_type === "PAYMENT.SALE.REVERSED";
  let amount;
  if (payment || refund || reversal) {
    if (resource.amount?.currency !== "USD") commercial.fail("Moneda inesperada", 409);
    amount = paypal.moneyMinor(resource.amount.total);
    if (payment && amount !== subscription.terms.priceMinor) commercial.fail("El cobro no coincide con el plan contratado", 409);
  }
  const occurredAt = new Date(resource.create_time || event.create_time);
  if (!Number.isFinite(occurredAt.getTime())) commercial.fail("Fecha del evento inválida");
  await mongoose.connection.transaction(async session => {
    if (await Event.exists({ providerId: event.id, environment: paypal.environment(), processedAt: { $ne: null } }).session(session)) return;
    await Event.updateOne({ providerId: event.id, environment: paypal.environment() }, { $set: { type: event.event_type, processedAt: new Date() } }, { session, upsert: true });
    const current = await Subscription.findById(subscription._id).session(session).lean();
    if (payment || refund || reversal) {
      const kind = payment ? "PAYMENT" : refund ? "REFUND" : "REVERSAL";
      await Charge.updateOne({ providerId: resource.id, environment: current.environment, kind }, { $setOnInsert: { subjectType: current.subjectType, subjectId: current.subjectId, subscriptionId: current._id, amountMinor: amount, currency: "USD", occurredAt } }, { upsert: true, session });
      // Derive the period from the actual sale date; late webhooks cannot extend it twice.
      const through = nextMonth(occurredAt);
      if (payment && current.open && !["FREE", "ERROR"].includes(current.state) && (!current.paidThrough || through > new Date(current.paidThrough))) {
        const cancelRequested = current.cancelRequested || ["CANCELLED", "EXPIRED"].includes(remote.status);
        await Subscription.updateOne({ _id: current._id }, { $set: { state: cancelRequested ? "CANCELLED" : "ACTIVE", paidThrough: through, graceUntil: null, cancelRequested, lastReconciledAt: new Date() } }, { session });
        await Membership.findOneAndUpdate({ subjectType: current.subjectType, subjectId: current.subjectId }, { $set: { ...current.terms, status: "ACTIVE", billingStatus: "CURRENT", endsAt: through, graceUntil: cancelRequested ? null : new Date(through.getTime() + 7 * DAY), reason: "Pago PayPal confirmado", updatedBy: current.actorId }, $inc: { revision: 1 } }, { upsert: true, runValidators: true, session });
        await audit(current, "saas.payment.confirmed", session, null, { paidThrough: through, amountMinor: amount });
      }
      if (payment && !current.open && through > new Date()) await audit(current, "saas.payment.review", session, null, { providerId: resource.id, amountMinor: amount, reason: "Cobro recibido después del cierre; revisar en PayPal" });
    }
    if (["CANCELLED", "EXPIRED"].includes(remote.status)) {
      await Subscription.updateOne({ _id: current._id, state: { $ne: "FREE" } }, { $set: { cancelRequested: true, state: "CANCELLED", lastReconciledAt: new Date() } }, { session });
      if (current.open) await Membership.updateOne({ subjectType: current.subjectType, subjectId: current.subjectId }, { $set: { graceUntil: null } }, { session });
    }
  });
}
async function cancelSubscription(subscription) {
  // A provider creation request may still be in flight. Keep the unique open slot
  // until its idempotent retry returns the remote identifier.
  if (!subscription.providerId) commercial.fail("Reintenta la contratación para obtener su identificador antes de cancelar", 409);
  await reconcilePayments(subscription);
  subscription = await Subscription.findById(subscription._id).lean();
  const remote = await paypal.request(`/v1/billing/subscriptions/${encodeURIComponent(subscription.providerId)}`);
  if (!["CANCELLED", "EXPIRED"].includes(remote.status)) await paypal.cancel(subscription.providerId);
  await mongoose.connection.transaction(async session => {
    await Subscription.updateOne({ _id: subscription._id }, { $set: { state: "CANCELLED", cancelRequested: true, ...(!subscription.paidThrough ? { open: false } : {}) } }, { session });
    await Membership.updateOne({ subjectType: subscription.subjectType, subjectId: subscription.subjectId }, { $set: { graceUntil: null } }, { session });
    await audit(subscription, "saas.subscription.cancel", session);
  });
}
async function requireLiveBackup() {
  if (paypal.environment() === "live") { const backup = await require("./saasBackupStatus").read(); if (backup.state !== "VERIFIED_RECENT" || !backup.offsiteVerified) commercial.fail("Verifica un respaldo externo restaurado antes de habilitar contrataciones reales", 503); }
}
async function reconcilePayments(subscription, now = new Date()) {
  if (!subscription.providerId) return;
  const start = new Date(Math.min(now.getTime() - 1000, Math.max(new Date(subscription.createdAt).getTime() - DAY, now.getTime() - 90 * DAY)));
  // PayPal returns at most a 180-day interval. A 90-day window covers delayed
  // renewals, and local unique sale identifiers make every retry idempotent.
  const result = await paypal.request(`/v1/billing/subscriptions/${encodeURIComponent(subscription.providerId)}/transactions?start_time=${encodeURIComponent(start.toISOString())}&end_time=${encodeURIComponent(now.toISOString())}`);
  if (!Array.isArray(result.transactions) || result.total_pages > 1 || result.total_items > result.transactions.length || result.links?.some(link => link.rel === "next")) commercial.fail("PayPal no devolvió un historial completo; se reintentará antes de cambiar el plan", 502);
  for (const row of result.transactions) {
    if (row.status !== "COMPLETED") continue;
    await processVerifiedEvent({ id: `reconcile-${row.id}`, event_type: "PAYMENT.SALE.COMPLETED", resource: {
      id: row.id, billing_agreement_id: subscription.providerId, create_time: row.time,
      amount: { currency: row.amount_with_breakdown?.gross_amount?.currency_code, total: row.amount_with_breakdown?.gross_amount?.value },
    } });
  }
}
async function settle(subscription, now = new Date()) {
  if (!subscription.open || subscription.environment !== paypal.environment()) return;
  if (subscription.providerId && (!subscription.paidThrough || new Date(subscription.paidThrough) <= now)) {
    await reconcilePayments(subscription, now);
    subscription = await Subscription.findById(subscription._id).lean();
    if (!subscription.open) return;
  }
  if (!subscription.paidThrough) {
    if (now - new Date(subscription.createdAt) > DAY) await cancelSubscription(subscription);
    return;
  }
  if (new Date(subscription.paidThrough) > now) return;
  // Reconcile before expiry; never trust webhook delivery order for cancellation state.
  const remote = await paypal.request(`/v1/billing/subscriptions/${encodeURIComponent(subscription.providerId)}`);
  const cancelled = subscription.cancelRequested || ["CANCELLED", "EXPIRED"].includes(remote.status);
  const graceUntil = new Date(new Date(subscription.paidThrough).getTime() + 7 * DAY);
  if (!cancelled && graceUntil > now) {
    await mongoose.connection.transaction(async session => {
      await Subscription.updateOne({ _id: subscription._id, paidThrough: subscription.paidThrough }, { $set: { state: "GRACE", graceUntil, lastReconciledAt: now } }, { session });
      await Membership.updateOne({ subjectType: subscription.subjectType, subjectId: subscription.subjectId, endsAt: subscription.paidThrough }, { $set: { graceUntil, billingStatus: "PAST_DUE" } }, { session });
    }); return;
  }
  const free = await commercial.defaultFree(subscription.subjectType);
  // Cancel outside the database transaction. If PayPal fails, retry instead of opening a second subscription.
  if (!["CANCELLED", "EXPIRED"].includes(remote.status)) await paypal.cancel(subscription.providerId);
  await mongoose.connection.transaction(async session => {
    const current = await Subscription.findById(subscription._id).session(session).lean();
    if (!current.open || (current.paidThrough && new Date(current.paidThrough) > now)) return;
    await Subscription.updateOne({ _id: current._id }, { $set: { state: "FREE", open: false, cancelRequested: true, graceUntil: null, lastReconciledAt: now } }, { session });
    await Membership.updateOne({ subjectType: current.subjectType, subjectId: current.subjectId }, { $set: { ...commercial.snapshot(free), status: "ACTIVE", billingStatus: "CURRENT", endsAt: null, graceUntil: null, reason: "Regreso a capa gratuita", updatedBy: current.actorId }, $inc: { revision: 1 } }, { session });
    await audit(current, "saas.subscription.free", session, null, { plan: free.name });
  });
}
module.exports = { subscriptionContext, publishPlan, createSubscription, processWebhook, cancelSubscription, settle, nextMonth, reconcilePayments };
