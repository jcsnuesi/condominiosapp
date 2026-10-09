"use strict";
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const Change = require("../models/saasCapacityChange");
const Adjustment = require("../models/saasBillingAdjustment");
const Subscription = require("../models/saasSubscription");
const Membership = require("../models/saasMembership");
const { Charge } = require("../models/saasBilling");
const paypal = require("./saasPaypal");
const capacity = require("./saasCapacityService");
const quota = require("./saasMembershipService");
const fail = capacity.fail;
const scope = (context) => ({
  subjectType: context.subjectType,
  subjectId: context.subjectId,
  environment: paypal.environment(),
});
const subscriptionPath = (subscription) =>
  `/v1/billing/subscriptions/${encodeURIComponent(subscription.providerId)}`;
const returnUrl = () =>
  `${(
    (process.env.FRONTEND_ORIGINS || "https://condapp.hsantosnuesi.com").split(",")[0].trim()
  ).replace(/\/$/, "")}/#/subscription`;
function approvalUrl(remote) {
  const url = remote.links?.find((link) =>
    ["approve", "payer-action"].includes(link.rel)
  )?.href;
  if (!url || !/^https:\/\/(?:www\.)?(?:sandbox\.)?paypal\.com\//.test(url))
    fail("PayPal no devolvió una aprobación válida", 502);
  return url;
}
async function audit(change, action, session, after) {
  await require("../models/platformAudit").create(
    [
      {
        actorId: change.actorId,
        targetType: change.subjectType,
        targetId: change.subjectId,
        action,
        after,
      },
    ],
    { session }
  );
}
function memberTerms(terms, member) {
  return {
    ...terms,
    allocationMode: member.distributionEnabled ? "DISTRIBUTED" : terms.allocationMode || "UNIFORM",
    limits: {
      ...terms.limits,
      ...(member.distributionEnabled ? { unitsPerCondominium: null } : {}),
    },
  };
}
async function validateReduction(context, terms, member, session) {
  const usage = await quota.usageFor(
    context.subjectType,
    context.subjectId,
    session
  );
  if (quota.exceededLimits(memberTerms(terms, member).limits, usage).length)
    fail("Reduce el uso antes de reducir la capacidad contratada");
  if (member.distributionEnabled)
    await capacity.validateDistribution(
      context.subjectId,
      member.allocations,
      terms.limits.units,
      session
    );
}
async function quote(context, quantity, now = new Date()) {
  await Change.init();
  const subscription = await Subscription.findOne({
    ...scope(context),
    open: true,
    state: "ACTIVE",
    cancelRequested: false,
  }).lean();
  if (
    !subscription ||
    !subscription.providerId ||
    new Date(subscription.paidThrough) <= now
  )
    fail("Necesitas una suscripción de pago vigente con un período confirmado");
  const lastRenewal =
    !subscription.periodStart &&
    (await Charge.findOne({
      subscriptionId: subscription._id,
      kind: "PAYMENT",
      occurredAt: { $lt: subscription.paidThrough },
      $or: [{ component: "RENEWAL" }, { component: { $exists: false } }],
    })
      .sort({ occurredAt: -1 })
      .lean());
  const periodStart = subscription.periodStart || lastRenewal?.occurredAt;
  if (!periodStart)
    fail("Concilia el último pago para confirmar el inicio del período");
  if (await Change.exists({ subscriptionId: subscription._id, open: true }))
    fail("Completa o cancela el cambio pendiente");
  if (
    await Adjustment.exists({
      subscriptionId: subscription._id,
      state: "PENDING",
    })
  )
    fail("Regulariza primero los ajustes pendientes");
  const member = await Membership.findOne({
    subjectType: context.subjectType,
    subjectId: context.subjectId,
  }).lean();
  if (!member || !quota.isMembershipCurrent(member, now))
    fail("La membresía no está vigente");
  const before = subscription.terms;
  const plan =
    before.extraPriceMinor == null &&
    (await require("../models/saasPlan").findById(subscription.planId).lean());
  const after = capacity.capacityTerms(
    {
      ...before,
      extraPriceMinor: before.extraPriceMinor ?? plan?.extraPriceMinor ?? null,
    },
    context.subjectType,
    quantity
  );
  if ((before.additionalQuantity || 0) === quantity)
    fail("La cantidad adicional no cambia");
  const reduction = after.priceMinor < before.priceMinor;
  if (reduction) await validateReduction(context, after, member, null);
  return (
    await Change.create({
      ...context,
      subscriptionId: subscription._id,
      environment: subscription.environment,
      requestKey: `quote-${crypto.randomUUID()}`,
      before,
      after,
      revision: member.revision,
      quotedAt: now,
      expiresAt: new Date(
        Math.min(
          now.getTime() + 15 * 60000,
          new Date(subscription.paidThrough).getTime()
        )
      ),
      periodStart,
      periodEnd: subscription.paidThrough,
      effectiveAt: subscription.paidThrough,
      prorationMinor: reduction
        ? 0
        : capacity.prorate(
            before,
            after,
            periodStart,
            subscription.paidThrough,
            now
          ),
      state: "QUOTED",
      open: false,
    })
  ).toObject();
}
async function getChange(context, id) {
  if (!mongoose.isObjectIdOrHexString(id)) fail("Cambio inválido", 400);
  const change = await Change.findOne({ ...scope(context), _id: id }).lean();
  if (!change) fail("Cambio no encontrado", 404);
  return change;
}
async function start(context, id, requestId) {
  if (!/^[A-Za-z0-9-]{16,64}$/.test(String(requestId)))
    fail("Indica una clave de contratación válida", 400);
  paypal.config();
  await require("./saasBillingService").requireLiveBackup();
  const requestKey = crypto
    .createHash("sha256")
    .update(`${context.subjectType}:${context.subjectId}:${requestId}`)
    .digest("hex");
  const existing = await Change.findOne({
    requestKey,
    ...scope(context),
  }).lean();
  if (existing && String(existing._id) !== String(id))
    fail("La clave corresponde a otro cambio");
  if (!existing)
    await mongoose.connection.transaction(async (session) => {
      const change = await Change.findOne({ ...scope(context), _id: id })
        .session(session)
        .lean();
      if (
        !change ||
        change.state !== "QUOTED" ||
        new Date(change.expiresAt) <= new Date()
      )
        fail("La cotización venció; vuelve a cotizar");
      const member = await quota.lockMembership(
        context.subjectType,
        context.subjectId,
        session
      );
      const sub = await Subscription.findById(change.subscriptionId)
        .session(session)
        .lean();
      if (
        !member ||
        member.revision !== change.revision ||
        sub.state !== "ACTIVE" ||
        sub.cancelRequested ||
        !sub.open ||
        new Date(sub.paidThrough).getTime() !==
          new Date(change.periodEnd).getTime() ||
        JSON.stringify(sub.terms) !== JSON.stringify(change.before)
      )
        fail("La suscripción cambió; vuelve a cotizar");
      if (change.after.priceMinor < change.before.priceMinor)
        await validateReduction(context, change.after, member, session);
      if (!sub.periodStart)
        await Subscription.updateOne(
          { _id: sub._id },
          { $set: { periodStart: change.periodStart } },
          { session }
        );
      try {
        await Change.updateOne(
          { _id: id, state: "QUOTED" },
          { $set: { state: "CREATED", open: true, requestKey } },
          { session }
        );
      } catch (e) {
        if (e.code === 11000) fail("Ya hay un cambio pendiente");
        throw e;
      }
      await audit(change, "saas.capacity.request", session, {
        quantity: change.after.additionalQuantity,
        priceMinor: change.after.priceMinor,
      });
    });
  return progress(context, id);
}
async function lease(Model, id, work) {
  const now = new Date();
  const row = await Model.findOneAndUpdate(
    { _id: id, $or: [{ leaseUntil: null }, { leaseUntil: { $lte: now } }] },
    { $set: { leaseUntil: new Date(now.getTime() + 120000) } },
    { returnDocument: "after" }
  ).lean();
  if (!row) fail("Esta operación se está procesando; actualiza su estado");
  try {
    return await work(row);
  } finally {
    await Model.updateOne(
      { _id: id, leaseUntil: row.leaseUntil },
      { $set: { leaseUntil: null } }
    );
  }
}
function remoteMatches(remote, subscription, terms) {
  if (
    remote.custom_id !== String(subscription._id) ||
    remote.status !== "ACTIVE"
  )
    return false;
  const cycle = remote.plan?.billing_cycles?.find((c) => c.sequence === 1);
  return (
    cycle?.pricing_scheme?.fixed_price?.currency_code === "USD" &&
    paypal.moneyMinor(cycle.pricing_scheme.fixed_price.value) ===
      terms.priceMinor
  );
}
async function revise(subscription, terms, key) {
  return paypal.request(`${subscriptionPath(subscription)}/revise`, {
    method: "POST",
    key,
    body: {
      plan: {
        billing_cycles: [
          {
            sequence: 1,
            pricing_scheme: {
              fixed_price: {
                currency_code: "USD",
                value: (terms.priceMinor / 100).toFixed(2),
              },
            },
          },
        ],
        payment_preferences: { auto_bill_outstanding: false },
      },
      application_context: { return_url: returnUrl(), cancel_url: returnUrl() },
    },
  });
}
async function restore(subscription, row, reason) {
  await Change.updateOne(
    { _id: row._id },
    { $set: { state: "RESTORING", approvalUrl: null, failureReason: reason } }
  );
  const result = await revise(subscription, row.before, `restore-${row._id}`);
  await Change.updateOne(
    { _id: row._id },
    { $set: { approvalUrl: approvalUrl(result) } }
  );
}
async function createOrder(row, amountMinor, description, key) {
  return paypal.request("/v2/checkout/orders", {
    method: "POST",
    key,
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: String(row._id),
          custom_id: String(row._id),
          description,
          amount: {
            currency_code: "USD",
            value: (amountMinor / 100).toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            user_action: "PAY_NOW",
            return_url: returnUrl(),
            cancel_url: returnUrl(),
          },
        },
      },
    },
  });
}
async function captureOrder(row, amountMinor, key, allowCapture = true) {
  let order = await paypal.request(
    `/v2/checkout/orders/${encodeURIComponent(row.orderId)}`
  );
  if (order.id !== row.orderId || order.purchase_units?.length !== 1)
    fail("La orden no corresponde al pago esperado");
  const unit = order.purchase_units[0];
  if (
    unit.custom_id !== String(row._id) ||
    unit.amount?.currency_code !== "USD" ||
    paypal.moneyMinor(unit.amount.value) !== amountMinor
  )
    fail("La orden no coincide con la cotización");
  if (order.status === "APPROVED") {
    if (!allowCapture) return null;
    if (row.expiresAt && new Date(row.expiresAt) <= new Date())
      fail("La cotización venció; cancela el cambio y vuelve a cotizar");
    order = await paypal.request(
      `/v2/checkout/orders/${encodeURIComponent(row.orderId)}/capture`,
      { method: "POST", key, body: {} }
    );
  }
  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
  if (order.status !== "COMPLETED" || capture?.status !== "COMPLETED")
    return null;
  if (
    capture.amount?.currency_code !== "USD" ||
    paypal.moneyMinor(capture.amount.value) !== amountMinor
  )
    fail("El pago confirmado no coincide con la cotización");
  return capture;
}
async function apply(change, capture) {
  // Keep a verified payment visible even if entitlement activation must retry.
  if (capture) await mongoose.connection.transaction(async (session) => {
    await Change.updateOne({ _id: change._id }, { $set: { captureId: capture.id } }, { session });
    await Charge.updateOne({ providerId: capture.id, environment: change.environment, kind: "PAYMENT" }, { $setOnInsert: {
      subjectType: change.subjectType, subjectId: change.subjectId, subscriptionId: change.subscriptionId, amountMinor: change.prorationMinor, currency: "USD", occurredAt: new Date(capture.create_time || Date.now()),
      component: "PRORATION", breakdown: { additionalQuantity: change.after.additionalQuantity - (change.before.additionalQuantity || 0), extraPriceMinor: change.after.extraPriceMinor, periodStart: change.quotedAt, periodEnd: change.periodEnd },
    } }, { session, upsert: true });
  });
  await mongoose.connection.transaction(async (session) => {
    const current = await Change.findById(change._id).session(session).lean();
    if (current.state === "APPLIED") return;
    const subscription = await Subscription.findById(change.subscriptionId)
      .session(session)
      .lean();
    const timelyCapture = capture?.create_time && new Date(capture.create_time) >= new Date(change.quotedAt) && new Date(capture.create_time) <= new Date(change.expiresAt);
    if (
      !subscription.open ||
      subscription.cancelRequested ||
      new Date(subscription.paidThrough) <= new Date() && !timelyCapture
    )
      fail("El período terminó; concilia este pago antes de activar capacidad");
    const member = await quota.lockMembership(
      change.subjectType,
      change.subjectId,
      session
    );
    const after = memberTerms(change.after, member);
    await Membership.updateOne(
      { _id: member._id },
      {
        $set: {
          ...after,
          reason: "Capacidad adicional pagada",
          updatedBy: change.actorId,
        },
      },
      { session, runValidators: true }
    );
    await Subscription.updateOne(
      { _id: subscription._id },
      { $set: { terms: change.after } },
      { session }
    );
    if (capture)
      await Charge.updateOne(
        {
          providerId: capture.id,
          environment: change.environment,
          kind: "PAYMENT",
        },
        {
          $setOnInsert: {
            subjectType: change.subjectType,
            subjectId: change.subjectId,
            subscriptionId: subscription._id,
            amountMinor: change.prorationMinor,
            currency: "USD",
            occurredAt: new Date(capture.create_time || Date.now()),
            component: "PRORATION",
            breakdown: {
              additionalQuantity:
                change.after.additionalQuantity -
                (change.before.additionalQuantity || 0),
              extraPriceMinor: change.after.extraPriceMinor,
              periodStart: change.quotedAt,
              periodEnd: change.periodEnd,
            },
          },
        },
        { session, upsert: true }
      );
    await Change.updateOne(
      { _id: change._id },
      {
        $set: {
          state: "APPLIED",
          open: false,
          appliedAt: new Date(),
          captureId: capture?.id || null,
        },
      },
      { session }
    );
    await audit(change, "saas.capacity.applied", session, {
      quantity: after.additionalQuantity,
      prorationMinor: change.prorationMinor,
    });
  });
}
async function compensate(change, capture, subscription) {
  const charge = await Charge.findOne({ providerId: capture.id, environment: change.environment, kind: "PAYMENT" }).lean();
  await Adjustment.updateOne({ chargeId: charge._id }, { $setOnInsert: { subjectType: change.subjectType, subjectId: change.subjectId, subscriptionId: change.subscriptionId,
    chargeId: charge._id, saleId: capture.id, providerKind: "CAPTURE", environment: change.environment, differenceMinor: -change.prorationMinor, terms: change.before } }, { upsert: true });
  if (subscription.open && !subscription.cancelRequested) await restore(subscription, change, "El pago se confirmó, pero la membresía ya no permite activar capacidad. Se devolverá el prorrateo y se restaurará la mensualidad anterior.");
  else await Change.updateOne({ _id: change._id }, { $set: { state: "CANCELLED", open: false, failureReason: "El prorrateo se devolverá porque la suscripción terminó." } });
}
async function progress(context, id) {
  const initial = await getChange(context, id);
  if (!initial.open) return initial;
  return lease(Change, id, async (row) => {
    const subscription = await Subscription.findById(row.subscriptionId).lean();
    const remote = await paypal.request(subscriptionPath(subscription));
    if (row.state === "RESTORING") {
      if (row.approvalUrl && remoteMatches(remote, subscription, row.before)) {
        await mongoose.connection.transaction(async (session) => {
          await Change.updateOne(
            { _id: id },
            { $set: { state: "CANCELLED", open: false, approvalUrl: null } },
            { session }
          );
          await Membership.updateOne(
            { subjectType: row.subjectType, subjectId: row.subjectId },
            { $set: { scheduledCapacity: null }, $inc: { revision: 1 } },
            { session }
          );
          await audit(row, "saas.capacity.cancelled", session, {
            restored: true,
          });
        });
      } else if (!row.approvalUrl) {
        const result = await revise(subscription, row.before, `restore-${id}`);
        await Change.updateOne(
          { _id: id },
          { $set: { approvalUrl: approvalUrl(result) } }
        );
      }
      return getChange(context, id);
    }
    if (row.state === "CREATED") {
      // Confirm remote state first: a provider response may have been lost.
      if (!remoteMatches(remote, subscription, row.after)) {
        const result = await revise(subscription, row.after, `revise-${id}`);
        await Change.updateOne(
          { _id: id },
          { $set: { state: "APPROVAL", approvalUrl: approvalUrl(result) } }
        );
        return getChange(context, id);
      }
      row.state = "APPROVAL";
    }
    if (row.state === "APPROVAL") {
      if (!remoteMatches(remote, subscription, row.after))
        return getChange(context, id);
      const now = new Date();
      await Change.updateOne(
        { _id: id },
        { $set: { recurringConfirmedAt: now } }
      );
      if (
        new Date(row.expiresAt) <= now ||
        !subscription.open ||
        subscription.cancelRequested
      ) {
        await restore(
          subscription,
          row,
          "La cotización venció o la suscripción terminó; se restaurará la mensualidad anterior."
        );
        return getChange(context, id);
      }
      if (row.after.priceMinor < row.before.priceMinor) {
        try {
          await mongoose.connection.transaction(async (session) => {
            const member = await quota.lockMembership(
              row.subjectType,
              row.subjectId,
              session
            );
            await validateReduction(row, row.after, member, session);
            await Membership.updateOne(
              { _id: member._id },
              {
                $set: {
                  scheduledCapacity: {
                    limits: row.after.limits,
                    effectiveAt: row.effectiveAt,
                  },
                },
              },
              { session }
            );
            await Change.updateOne(
              { _id: id },
              {
                $set: {
                  state: "SCHEDULED",
                  recurringConfirmedAt: now,
                  approvalUrl: null,
                },
              },
              { session }
            );
            await audit(row, "saas.capacity.scheduled", session, {
              effectiveAt: row.effectiveAt,
              quantity: row.after.additionalQuantity,
            });
          });
        } catch (error) {
          if (![403, 409].includes(error.statusCode)) throw error;
          await restore(
            subscription,
            row,
            "El uso o la distribución cambió y ya no permite la reducción; se restaurará la mensualidad anterior."
          );
        }
        return getChange(context, id);
      }
      await Change.updateOne(
        { _id: id },
        {
          $set: {
            state: "PAYMENT",
            recurringConfirmedAt: now,
            approvalUrl: null,
          },
        }
      );
      row.state = "PAYMENT";
    }
    if (row.state === "PAYMENT") {
      if (!remoteMatches(remote, subscription, row.after) && !row.orderId)
        fail("PayPal no confirma la nueva mensualidad");
      if (row.prorationMinor === 0) {
        await apply(row, null);
        return getChange(context, id);
      }
      if (!row.orderId) {
        if (new Date(row.expiresAt) <= new Date())
          fail("La cotización venció; cancela este cambio y vuelve a cotizar");
        const order = await createOrder(
          row,
          row.prorationMinor,
          "Prorrateo de capacidad adicional Comunard",
          `order-${id}`
        );
        await Change.updateOne(
          { _id: id },
          { $set: { orderId: order.id, paymentUrl: approvalUrl(order) } }
        );
      } else {
        const capture = await captureOrder(
          row,
          row.prorationMinor,
          `capture-${id}`,
          remoteMatches(remote, subscription, row.after)
        );
        if (capture) {
          try { await apply(row, capture); }
          catch (error) {
            if (![403, 409].includes(error.statusCode)) throw error;
            await compensate(row, capture, subscription);
          }
        }
      }
    }
    return getChange(context, id);
  });
}
async function cancel(context, id) {
  const row = await getChange(context, id);
  if (!row.open) return row;
  await lease(Change, id, async (current) => {
    if (current.state === "PAYMENT" && current.orderId) {
      const order = await paypal.request(
        `/v2/checkout/orders/${encodeURIComponent(current.orderId)}`
      );
      if (order.status === "COMPLETED")
        fail("Completa la conciliación del pago antes de cancelar");
    }
    await Change.updateOne(
      { _id: id },
      { $set: { state: "RESTORING", approvalUrl: null } }
    );
  });
  return progress(context, id);
}
async function termsAt(subscription, date, session = null) {
  const changes = await Change.find({
    subscriptionId: subscription._id,
    state: {
      $in: ["APPLIED", "SCHEDULED", "PAYMENT", "RESTORING", "CANCELLED"],
    },
    recurringConfirmedAt: { $ne: null },
  })
    .sort({ effectiveAt: 1, createdAt: 1 })
    .session(session)
    .lean();
  let terms = changes[0]?.before || subscription.terms;
  let previous = terms;
  let effectiveAt = null;
  let previousPrices = [];
  const pendingPrices = changes
    .filter(
      (change) =>
        change.open &&
        ["PAYMENT", "RESTORING"].includes(change.state) &&
        new Date(change.effectiveAt) <= date
    )
    .flatMap((change) => [change.before.priceMinor, change.after.priceMinor]);
  for (const change of changes)
    if (new Date(change.effectiveAt) <= date) {
      if (
        !effectiveAt ||
        new Date(change.effectiveAt).getTime() !==
          new Date(effectiveAt).getTime()
      )
        previousPrices = [];
      previous = change.before;
      previousPrices.push(change.before.priceMinor, change.after.priceMinor);
      if (["APPLIED", "SCHEDULED"].includes(change.state)) terms = change.after;
      effectiveAt = change.effectiveAt;
    }
  return { terms, previous, previousPrices, pendingPrices, effectiveAt };
}
async function finishScheduled(subscription, date, session) {
  const change = await Change.findOne({
    subscriptionId: subscription._id,
    state: "SCHEDULED",
    effectiveAt: { $lte: date },
  })
    .session(session)
    .lean();
  if (!change) return subscription.terms;
  await Change.updateOne(
    { _id: change._id },
    { $set: { state: "APPLIED", open: false, appliedAt: date } },
    { session }
  );
  await Subscription.updateOne(
    { _id: subscription._id },
    { $set: { terms: change.after } },
    { session }
  );
  await Membership.updateOne(
    {
      subjectType: subscription.subjectType,
      subjectId: subscription.subjectId,
    },
    { $set: { scheduledCapacity: null } },
    { session }
  );
  await audit(change, "saas.capacity.reduction.applied", session, {
    quantity: change.after.additionalQuantity,
  });
  return change.after;
}
async function reconcileAdjustment(context, id) {
  if (!mongoose.isObjectIdOrHexString(id)) fail("Ajuste inválido", 400);
  const row = await Adjustment.findOne({ ...scope(context), _id: id }).lean();
  if (!row) fail("Ajuste no encontrado", 404);
  if (row.state === "COMPLETED") return row;
  return lease(Adjustment, id, async (current) => {
    let payment;
    if (current.differenceMinor < 0) {
      const isCapture = current.providerKind === "CAPTURE";
      const refund = await paypal.request(
        isCapture ? `/v2/payments/captures/${encodeURIComponent(current.saleId)}/refund` : `/v1/payments/sale/${encodeURIComponent(current.saleId)}/refund`,
        {
          method: "POST",
          key: `refund-${id}`,
          body: {
            amount: isCapture ? { currency_code: "USD", value: (-current.differenceMinor / 100).toFixed(2) } : {
              currency: "USD",
              total: (-current.differenceMinor / 100).toFixed(2),
            },
          },
        }
      );
      if (isCapture ? refund.status !== "COMPLETED" : refund.state !== "completed") return current;
      payment = { id: refund.id, create_time: refund.create_time };
    } else if (!current.orderId) {
      const order = await createOrder(
        current,
        current.differenceMinor,
        "Ajuste de renovación Comunard",
        `adjust-order-${id}`
      );
      await Adjustment.updateOne(
        { _id: id },
        { $set: { orderId: order.id, paymentUrl: approvalUrl(order) } }
      );
    } else
      payment = await captureOrder(
        current,
        current.differenceMinor,
        `adjust-capture-${id}`
      );
    if (payment)
      await mongoose.connection.transaction(async (session) => {
        const kind = current.differenceMinor < 0 ? "REFUND" : "PAYMENT";
        await Charge.updateOne(
          { providerId: payment.id, environment: current.environment, kind },
          {
            $setOnInsert: {
              subjectType: current.subjectType,
              subjectId: current.subjectId,
              subscriptionId: current.subscriptionId,
              amountMinor: Math.abs(current.differenceMinor),
              currency: "USD",
              occurredAt: new Date(payment.create_time || Date.now()),
              component: "ADJUSTMENT",
              breakdown: {
                renewalChargeId: current.chargeId,
                differenceMinor: current.differenceMinor,
              },
            },
          },
          { session, upsert: true }
        );
        await Adjustment.updateOne(
          { _id: id },
          { $set: { state: "COMPLETED", providerId: payment.id } },
          { session }
        );
        const activeSubscription = current.differenceMinor > 0 && await Subscription.findOne({ _id: current.subscriptionId, open: true, paidThrough: { $gt: new Date() }, state: { $in: ["ACTIVE", "GRACE", "CANCELLED"] } }).session(session).lean();
        if (
          activeSubscription && !(await Adjustment.exists({
            subscriptionId: current.subscriptionId,
            state: "PENDING",
            differenceMinor: { $gt: 0 },
            _id: { $ne: current._id },
          }).session(session))
        ) {
          await Membership.updateOne(
            { subjectType: current.subjectType, subjectId: current.subjectId },
            { $set: { billingStatus: "CURRENT", graceUntil: activeSubscription.cancelRequested ? null : new Date(new Date(activeSubscription.paidThrough).getTime() + 7 * 86400000) } },
            { session }
          );
          await Subscription.updateOne(
            {
              _id: current.subscriptionId,
              state: "GRACE",
              cancelRequested: false,
            },
            { $set: { state: "ACTIVE", graceUntil: null } },
            { session }
          );
        }
      });
    return Adjustment.findById(id).lean();
  });
}
async function reconcilePending() {
  const now = new Date();
  let failures = 0;
  for await (const row of Change.find({
    open: true,
    environment: paypal.environment(),
    state: { $in: ["CREATED", "PAYMENT", "RESTORING", "APPROVAL"] },
  })
    .lean()
    .cursor()) {
    try {
      if (new Date(row.expiresAt) <= now && row.state !== "RESTORING") {
        const order =
          row.orderId &&
          (await paypal.request(
            `/v2/checkout/orders/${encodeURIComponent(row.orderId)}`
          ));
        if (order?.status === "COMPLETED") await progress(row, row._id);
        else await cancel(row, row._id);
      } else await progress(row, row._id);
    } catch {
      failures++;
      console.error(
        JSON.stringify({
          event: "saas.capacity.reconciliation.failed",
          changeId: String(row._id),
        })
      );
    }
  }
  for await (const row of Adjustment.find({
    state: "PENDING",
    environment: paypal.environment(),
    $or: [{ differenceMinor: { $lt: 0 } }, { orderId: { $type: "string" } }],
  })
    .lean()
    .cursor()) {
    try {
      await reconcileAdjustment(row, row._id);
    } catch {
      failures++;
      console.error(
        JSON.stringify({
          event: "saas.adjustment.reconciliation.failed",
          adjustmentId: String(row._id),
        })
      );
    }
  }
  if (failures)
    fail("Hay cambios de capacidad o ajustes pendientes de conciliación", 503);
}
module.exports = {
  quote,
  start,
  getChange,
  progress,
  cancel,
  termsAt,
  finishScheduled,
  memberTerms,
  reconcileAdjustment,
  reconcilePending,
  remoteMatches,
};
