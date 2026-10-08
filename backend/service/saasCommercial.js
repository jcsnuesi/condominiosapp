"use strict";
const { MODULE_ACTIONS } = require("./permissionCatalog");
const MODULES = Object.keys(MODULE_ACTIONS);
const enabled = name => process.env[name] === "true";
const fail = (message, statusCode = 400) => { throw Object.assign(new Error(message), { statusCode, code: "SAAS_CONFIGURATION_INVALID" }); };
function commercialInput(input, previous = {}) {
  const kind = input.kind ?? previous.kind ?? "LEGACY";
  if (!["LEGACY", "FREE", "PAID"].includes(kind)) fail("Tipo de plan inválido");
  const priceMinor = input.priceMinor ?? previous.priceMinor ?? 0;
  if (!Number.isSafeInteger(priceMinor) || priceMinor < 0 || (kind === "FREE" && priceMinor !== 0) || (kind === "PAID" && priceMinor === 0)) fail("Indica un precio válido en centavos USD");
  const modules = input.modules === undefined ? previous.modules ?? null : input.modules;
  if (modules !== null && (!Array.isArray(modules) || modules.some(m => !MODULES.includes(m)))) fail("Módulos inválidos");
  const isDefaultFree = input.isDefaultFree ?? previous.isDefaultFree ?? false;
  if (typeof isDefaultFree !== "boolean" || (isDefaultFree && kind !== "FREE")) fail("El predeterminado debe ser gratuito");
  if (input.currency && input.currency !== "USD") fail("La moneda inicial es USD");
  if (input.interval && input.interval !== "MONTH") fail("La periodicidad inicial es mensual");
  return { kind, priceMinor, currency: "USD", interval: "MONTH", modules: modules === null ? null : [...new Set(modules)], isDefaultFree };
}
function snapshot(plan) {
  return { planId: plan._id, plan: plan.name, kind: plan.kind || "LEGACY", priceMinor: plan.priceMinor || 0,
    currency: "USD", interval: "MONTH", modules: plan.modules ?? null, limits: plan.limits.toObject ? plan.limits.toObject() : plan.limits };
}
function moduleAllowed(modules, permission) {
  if (modules === null || modules === undefined) return true;
  const module = MODULES.slice().sort((a, b) => b.length - a.length).find(m => permission.startsWith(`${m}.`));
  return !module || (modules.includes(module) && (!module.startsWith("cameras.") || modules.includes("cameras")));
}
async function automationAllowed(organizationId, module) {
  if (!enabled("SAAS_MODULES_ENABLED") && !enabled("PLATFORM_OPERATIONS_ENABLED")) return true;
  if (!organizationId || !await require("../models/organization").exists({ _id: organizationId, status: "active" })) return false;
  const member = await require("../models/saasMembership").findOne({ subjectType: "ORGANIZATION", subjectId: organizationId }).lean();
  return !member || (require("./saasMembershipService").isMembershipCurrent(member) && (!enabled("SAAS_MODULES_ENABLED") || moduleAllowed(member.modules, `${module}.read`)));
}
async function defaultFree(type, session) {
  const plan = await require("../models/saasPlan").findOne({ subjectType: type, kind: "FREE", isDefaultFree: true, status: "active" }).session(session || null).lean();
  if (!plan) fail("Configura el plan gratuito predeterminado", 503);
  return plan;
}
async function provisionFree(type, id, actorId, session) {
  if (!enabled("SAAS_FREE_REGISTRATION_ENABLED")) return;
  // Both defaults must exist before any new registration is placed on the free tier.
  const plan = await defaultFree(type, session);
  await defaultFree(type === "ORGANIZATION" ? "PERSONAL_OWNER" : "ORGANIZATION", session);
  const usage = await require("./saasMembershipService").usageFor(type, id, session);
  if (require("./saasMembershipService").exceededLimits(plan.limits, usage).length) fail("El registro inicial supera los cupos del plan gratuito; revisa su configuración", 409);
  await require("../models/saasMembership").create([{ ...snapshot(plan), subjectType: type, subjectId: id,
    status: "ACTIVE", billingStatus: "CURRENT", endsAt: null, reason: "Registro en capa gratuita", updatedBy: actorId }], { session });
}
module.exports = { MODULES, enabled, fail, commercialInput, snapshot, moduleAllowed, defaultFree, provisionFree, automationAllowed };
