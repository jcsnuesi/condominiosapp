"use strict";

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Organization = require("../models/organization");
const Admin = require("../models/admin");
const AccessPolicy = require("../models/accessPolicy");
const AuthorizationAudit = require("../models/authorizationAudit");
const { STANDARD_POLICIES } = require("../service/permissionCatalog");

function toSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function provision(req, res) {
  const organizationInput = req.body.organization || {};
  const adminInput = req.body.admin || {};
  const slug = toSlug(organizationInput.slug || organizationInput.name);
  if (!organizationInput.name || !organizationInput.email || !slug || !adminInput.email || !adminInput.password) {
    return res.status(400).send({ status: "error", message: "Organization and owner administrator data are required" });
  }

  try {
    let organization;
    let admin;
    await mongoose.connection.transaction(async (session) => {
      [organization] = await Organization.create([{
        name: organizationInput.name,
        slug,
        rnc: organizationInput.rnc,
        email: organizationInput.email,
        phone: organizationInput.phone || [],
        address: organizationInput.address || {},
        provisionedBy: req.user.sub,
        status: "provisioning",
      }], { session, ordered: true });

      [admin] = await Admin.create([{
        organizationId: organization._id,
        company: organizationInput.name,
        rnc: organizationInput.rnc,
        phone: organizationInput.phone || [],
        street_1: organizationInput.address?.street_1 || "N/A",
        street_2: organizationInput.address?.street_2,
        city: organizationInput.address?.city || "N/A",
        state: organizationInput.address?.state || "N/A",
        zipcode: organizationInput.address?.zipcode,
        country: organizationInput.address?.country || "N/A",
        email: String(adminInput.email).toLowerCase(),
        password: await bcrypt.hash(adminInput.password, 10),
        contact_person: adminInput.contact_person || [],
        verified: true,
        terms: true,
        status: "active",
      }], { session, ordered: true });

      await AccessPolicy.create(STANDARD_POLICIES.map((policy) => ({
        ...policy,
        organizationId: organization._id,
        isSystem: true,
        status: "active",
        createdBy: admin._id,
      })), { session, ordered: true });

      organization.ownerAdminId = admin._id;
      organization.status = "active";
      organization.provisionedAt = new Date();
      await organization.save({ session });
      await AuthorizationAudit.create([{
        organizationId: organization._id,
        actorId: req.user.sub,
        actorRole: req.user.role,
        action: "organization.provision",
        targetType: "Organization",
        targetId: organization._id,
        before: null,
        after: { organization: organization.toObject(), ownerAdminId: admin._id },
        ip: req.ip || "",
        userAgent: req.get("user-agent") || "",
      }], { session, ordered: true });
    });

    const cleanAdmin = admin.toObject();
    delete cleanAdmin.password;
    return res.status(201).send({ status: "success", message: { organization, admin: cleanAdmin } });
  } catch (error) {
    const status = error?.code === 11000 ? 409 : 500;
    return res.status(status).send({ status: "error", message: status === 409 ? "Organization or administrator already exists" : "Organization could not be provisioned" });
  }
}

module.exports = { provision };
