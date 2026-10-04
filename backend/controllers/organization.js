"use strict";
const Organization = require("../models/organization");
const Condominium = require("../models/condominio");
const Owner = require("../models/owners");

async function status(req, res) {
  try {
    const organization = await Organization.findById(req.auth.organizationId).lean();
    const condominiums = await Condominium.find({ organizationId: req.auth.organizationId, status: "active" }).select("_id alias units").lean();
    const ownerCount = await Owner.countDocuments({ organizationId: req.auth.organizationId, status: "active" });
    return res.status(200).send({ status: "success", message: {
      name: organization.name,
      completed: Boolean(organization.onboardingCompletedAt),
      condominiumCount: condominiums.length,
      unitCount: condominiums.reduce((count, condo) => count + (condo.units || []).filter(unit => unit.status === "active").length, 0),
      ownerCount,
      firstCondominiumId: condominiums[0]?._id || null,
    } });
  } catch {
    return res.status(500).send({ status: "error", message: "No pudimos cargar la configuración." });
  }
}

async function complete(req, res) {
  try {
    await Organization.updateOne({ _id: req.auth.organizationId, onboardingCompletedAt: null }, { $set: { onboardingCompletedAt: new Date() } });
    return res.status(200).send({ status: "success", message: "Puedes continuar configurando tu organización desde el menú." });
  } catch {
    return res.status(500).send({ status: "error", message: "No pudimos guardar tu progreso." });
  }
}
module.exports = { status, complete };
