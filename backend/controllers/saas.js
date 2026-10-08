"use strict";
const mongoose = require("mongoose");
const Subscription = require("../models/saasSubscription");
const Membership = require("../models/saasMembership");
const Plan = require("../models/saasPlan");
const { Charge } = require("../models/saasBilling");
const billing = require("../service/saasBillingService");
const commercial = require("../service/saasCommercial");
const { platformScopeAllows } = require("../service/platformPermissions");
const handle = fn => async (req, res) => { try { await fn(req, res); } catch (e) { res.status(e.statusCode || 503).send({ code: e.code || "SAAS_OPERATION_FAILED", message: e.statusCode ? e.message : "No se pudo completar la operación; vuelve a intentarlo" }); } };
function scopeFilter(auth) {
  if (auth.scope.mode === "ALL") return {};
  return { $or: [{ subjectType: "ORGANIZATION", subjectId: { $in: auth.scope.organizationIds } }, { subjectType: "PERSONAL_OWNER", subjectId: { $in: auth.scope.ownerIds } }] };
}
exports.subscription = handle(async (req, res) => {
  const context = billing.subscriptionContext(req.auth, req.user.sub);
  const filter = { subjectType: context.subjectType, subjectId: context.subjectId };
  const [membership, subscription, plans, charges] = await Promise.all([
    Membership.findOne(filter).lean(), Subscription.findOne({ ...filter, open: true }).lean(),
    Plan.find({ subjectType: context.subjectType, status: "active", kind: { $in: ["FREE", "PAID"] } }).select("name kind priceMinor currency interval limits modules paypalPlanId paypalEnvironment").lean(),
    Charge.find(filter).sort({ occurredAt: -1 }).limit(50).lean(),
  ]);
  const paypal = require("../service/saasPaypal");
  res.send({ data: { membership, subscription, plans: plans.filter(p => p.kind === "FREE" || (p.paypalPlanId && p.paypalEnvironment === paypal.environment())), charges, checkoutEnabled: commercial.enabled("SAAS_PAYPAL_ENABLED") } });
});
exports.subscribe = handle(async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.body.planId)) commercial.fail("Plan inválido");
  res.send({ data: await billing.createSubscription(billing.subscriptionContext(req.auth, req.user.sub), req.body.planId, req.headers["idempotency-key"]) });
});
exports.cancel = handle(async (req, res) => {
  const context = billing.subscriptionContext(req.auth, req.user.sub);
  const subscription = await Subscription.findOne({ subjectType: context.subjectType, subjectId: context.subjectId, open: true }).lean();
  if (!subscription) commercial.fail("No hay una suscripción abierta", 404);
  await billing.cancelSubscription(subscription);
  res.send({ data: { cancelled: true } });
});
exports.webhook = handle(async (req, res) => { await billing.processWebhook(req.headers, req.body); res.sendStatus(200); });
exports.publish = handle(async (req, res) => { if (!mongoose.isObjectIdOrHexString(req.params.id)) commercial.fail("Plan inválido"); const plan = await billing.publishPlan(req.params.id); await require("./platformOperations").audit(req, "platform.plan.publish", "SAAS_PLAN", plan._id, null, { paypalPlanId: plan.paypalPlanId, environment: plan.paypalEnvironment }); res.send({ data: plan }); });
exports.cancelPlatform = handle(async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id) || !req.body.reason?.trim() || req.body.reason.length > 500) commercial.fail("Indica la suscripción y el motivo");
  const subscription = await Subscription.findById(req.params.id).lean();
  if (!subscription || !subscription.open || subscription.environment !== require("../service/saasPaypal").environment()) commercial.fail("Suscripción no disponible", 409);
  require("../service/platformAuthorization").requireTarget(req, subscription.subjectType, subscription.subjectId);
  await billing.cancelSubscription(subscription);
  await require("./platformOperations").audit(req, "platform.subscription.cancel", subscription.subjectType, subscription.subjectId, { subscriptionId: subscription._id }, { reason: req.body.reason.trim() });
  res.send({ data: { cancelled: true } });
});
exports.reconcilePlatform = handle(async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id) || !req.body.reason?.trim() || req.body.reason.length > 500) commercial.fail("Indica la suscripción y el motivo");
  let subscription = await Subscription.findById(req.params.id).lean();
  if (!subscription || !subscription.open || subscription.environment !== require("../service/saasPaypal").environment()) commercial.fail("Suscripción no disponible", 409);
  require("../service/platformAuthorization").requireTarget(req, subscription.subjectType, subscription.subjectId);
  if (!subscription.providerId) {
    if (!/^I-[A-Z0-9-]{3,80}$/.test(req.body.providerId || "")) commercial.fail("Indica el identificador de PayPal para esta contratación pendiente");
    const remote = await require("../service/saasPaypal").request(`/v1/billing/subscriptions/${encodeURIComponent(req.body.providerId)}`);
    const plan = await Plan.findById(subscription.planId).lean();
    if (remote.custom_id !== String(subscription._id) || remote.plan_id !== plan?.paypalPlanId) commercial.fail("El identificador PayPal pertenece a otra contratación", 409);
    subscription = await Subscription.findOneAndUpdate({ _id: subscription._id, providerId: null, open: true }, { $set: { providerId: req.body.providerId } }, { returnDocument: "after" }).lean();
    if (!subscription) commercial.fail("La contratación cambió; actualiza la pantalla", 409);
  }
  await billing.reconcilePayments(subscription); await billing.settle(await Subscription.findById(subscription._id).lean());
  await require("./platformOperations").audit(req, "platform.subscription.reconcile", subscription.subjectType, subscription.subjectId, null, { subscriptionId: subscription._id, reason: req.body.reason.trim() });
  res.send({ data: { reconciled: true } });
});
exports.listBilling = handle(async (req, res) => {
  const page = Math.max(1, Math.floor(Number(req.query.page) || 1)); const filter = scopeFilter(req.auth);
  const [charges, subscriptions, total, totals] = await Promise.all([
    Charge.find(filter).sort({ occurredAt: -1, _id: -1 }).skip((page - 1) * 50).limit(50).lean(),
    Subscription.find({ ...filter, open: true }).select("subjectType subjectId state paidThrough graceUntil terms.priceMinor").limit(100).lean(),
    Charge.countDocuments(filter),
    Charge.aggregate([{ $match: req.auth.scope.mode === "ALL" ? {} : { $or: [{ subjectType: "ORGANIZATION", subjectId: { $in: req.auth.scope.organizationIds.map(id => new mongoose.Types.ObjectId(id)) } }, { subjectType: "PERSONAL_OWNER", subjectId: { $in: req.auth.scope.ownerIds.map(id => new mongoose.Types.ObjectId(id)) } }] } }, { $group: { _id: "$kind", amountMinor: { $sum: "$amountMinor" } } }]),
  ]);
  res.send({ data: { charges, subscriptions, total, page, totals } });
});
exports.receipt = handle(async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) commercial.fail("Comprobante inválido");
  const charge = await Charge.findById(req.params.id).lean();
  if (!charge) commercial.fail("Comprobante no encontrado", 404);
  if (req.auth.isPlatform) { if (!req.auth.permissions.includes("platform.billing.read") || !platformScopeAllows(req.auth.scope, charge.subjectType, charge.subjectId)) commercial.fail("Acceso denegado", 403); }
  else { const context = billing.subscriptionContext(req.auth, req.user.sub); if (context.subjectType !== charge.subjectType || String(context.subjectId) !== String(charge.subjectId)) commercial.fail("Acceso denegado", 403); }
  res.set("Content-Disposition", `attachment; filename="comunard-${charge._id}.json"`).send({ title: "Comprobante comercial de Comunard — no es factura fiscal", ...charge });
});
module.exports.scopeFilter = scopeFilter;
