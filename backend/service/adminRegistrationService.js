"use strict";

const bcrypt = require("bcrypt");
const { randomBytes } = require("node:crypto");
const mongoose = require("mongoose");
const { hashVerificationToken } = require("./iotOwnerRegistrationService");
const { STANDARD_POLICIES } = require("./permissionCatalog");
const notifyWelcome = require("./welcomeNotification");

function registrationError(code, message, statusCode = 400) {
  return Object.assign(new Error(message), { code, statusCode });
}

function normalizeAdminRegistration(input = {}) {
  const text = (field, limit = 100) => {
    const value = typeof input[field] === "string" ? input[field].trim() : "";
    if (!value || value.length > limit) {
      throw registrationError("ADMIN_REGISTRATION_INVALID", `Revisa el campo ${field}.`);
    }
    return value;
  };
  const email = text("email", 254).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";
  const phone = text("phone", 17);
  if (!/^\S+@\S+\.\S+$/.test(email) || !/^\+?[0-9]{8,16}$/.test(phone)) {
    throw registrationError("ADMIN_REGISTRATION_INVALID", "Revisa el correo y el teléfono.");
  }
  if (password.length < 12 || password.length > 128) {
    throw registrationError("ADMIN_PASSWORD_INVALID", "La contraseña debe tener entre 12 y 128 caracteres.");
  }
  if (input.terms !== true) {
    throw registrationError("ADMIN_TERMS_REQUIRED", "Acepta los términos y condiciones.");
  }
  return {
    email, password, phone, name: text("name"), lastname: text("lastname"), company: text("company", 160),
    address: { street_1: text("street_1", 200), city: text("city"), state: text("state"), country: text("country") },
  };
}

class AdminRegistrationService {
  constructor({
    Registration = require("../models/adminRegistration"),
    Organization = require("../models/organization"),
    Admin = require("../models/admin"),
    Policy = require("../models/accessPolicy"),
    Audit = require("../models/authorizationAudit"),
    accounts = [Admin, require("../models/owners"), require("../models/staff_admin"), require("../models/staff"), require("../models/family")],
    emailService = require("./generateVerification"),
    mongo = mongoose,
    now = () => new Date(),
    hashPassword = password => bcrypt.hash(password, 12),
  } = {}) {
    Object.assign(this, { Registration, Organization, Admin, Policy, Audit, accounts, emailService, mongo, now, hashPassword });
  }

  async emailExists(email, session) {
    // MongoDB transactions require sequential operations on a session.
    for (const Model of this.accounts) {
      const query = Model.exists({ email });
      if (await (session ? query.session(session) : query)) return true;
    }
    return false;
  }

  async register(input) {
    const values = normalizeAdminRegistration(input);
    if (await this.emailExists(values.email)) return { accepted: true };
    const token = randomBytes(32).toString("hex");
    const tokenHash = hashVerificationToken(token);
    const { password, ...data } = values;
    // Re-registering a pending account issues a new link; only its latest link can activate it.
    await this.Registration.findOneAndUpdate({ email: values.email }, { $set: {
      ...data, passwordHash: await this.hashPassword(password), tokenHash,
      expiresAt: new Date(this.now().getTime() + 24 * 60 * 60 * 1000), usedAt: null,
    } }, { upsert: true, runValidators: true });
    try {
      await this.emailService.sendAdminVerification({ email: values.email, token });
    } catch {
      await this.Registration.deleteOne({ email: values.email, tokenHash, usedAt: null });
      throw registrationError("ADMIN_VERIFICATION_UNAVAILABLE", "No pudimos enviar el correo. Intenta nuevamente.", 503);
    }
    return { accepted: true };
  }

  async resend(email) {
    if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim()) || email.length > 254) {
      throw registrationError("ADMIN_EMAIL_INVALID", "Indica un correo válido.");
    }
    const token = randomBytes(32).toString("hex");
    const tokenHash = hashVerificationToken(token);
    const pending = await this.Registration.findOneAndUpdate({ email: email.trim().toLowerCase(), usedAt: null }, { $set: {
      tokenHash, expiresAt: new Date(this.now().getTime() + 24 * 60 * 60 * 1000),
    } }, { new: true });
    if (pending) {
      await this.emailService.sendAdminVerification({ email: pending.email, token });
    }
    return { accepted: true };
  }

  async verify(token, request = {}) {
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      throw registrationError("ADMIN_VERIFICATION_INVALID", "El enlace no es válido o ha vencido.");
    }
    let welcomeAccount;
    await this.mongo.connection.transaction(async session => {
      const pending = await this.Registration.findOne({
        tokenHash: hashVerificationToken(token), usedAt: null, expiresAt: { $gt: this.now() },
      }).select("+passwordHash").session(session);
      if (!pending) throw registrationError("ADMIN_VERIFICATION_INVALID", "El enlace no es válido o ha vencido.");
      if (await this.emailExists(pending.email, session)) {
        throw registrationError("ADMIN_EMAIL_EXISTS", "Ya tienes una cuenta. Inicia sesión o recupera tu contraseña.", 409);
      }
      const organizationId = new this.mongo.Types.ObjectId();
      const adminId = new this.mongo.Types.ObjectId();
      const slugBase = pending.company.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "organizacion";
      await this.Organization.create([{
        _id: organizationId, name: pending.company, slug: `${slugBase}-${organizationId}`,
        email: pending.email, phone: [pending.phone], address: pending.address,
        ownerAdminId: adminId, status: "active", registrationSource: "SELF_SERVICE",
        provisionedBy: adminId, provisionedAt: this.now(),
      }], { session, ordered: true });
      await this.Admin.create([{
        _id: adminId, organizationId, company: pending.company, ...pending.address.toObject(),
        phone: [pending.phone], email: pending.email, password: pending.passwordHash,
        contact_person: [{ name_contact: pending.name, lastname_contact: pending.lastname,
          gender_contact: "unspecified", email_contact: pending.email, phone_contact: [pending.phone], role_contact: "admin" }],
        role: "ADMIN", status: "active", verified: true, terms: true, first_password_changed: true,
      }], { session, ordered: true });
      await this.Policy.create(STANDARD_POLICIES.map(policy => ({
        ...policy, organizationId, isSystem: true, status: "active", createdBy: adminId,
      })), { session, ordered: true });
      await this.Audit.create([{
        organizationId, actorId: adminId, actorRole: "ADMIN", action: "organization.self_register",
        targetType: "Organization", targetId: organizationId,
        after: { ownerAdminId: adminId }, ip: request.ip || "", userAgent: request.userAgent || "",
      }], { session, ordered: true });
      pending.usedAt = this.now();
      await pending.save({ session });
      welcomeAccount = { email: pending.email, name: pending.name };
    });
    await notifyWelcome(welcomeAccount, this.emailService);
    return { verified: true };
  }
}

module.exports = { AdminRegistrationService, normalizeAdminRegistration };
