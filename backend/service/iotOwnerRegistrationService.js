"use strict";

const bcrypt = require("bcrypt");
const { createHash, randomBytes } = require("node:crypto");
const Owner = require("../models/owners");
const Admin = require("../models/admin");
const StaffAdmin = require("../models/staff_admin");
const Staff = require("../models/staff");
const Family = require("../models/family");
const IoTOwnerVerification = require("../models/iotOwnerVerification");
const verificationEmail = require("./generateVerification");
const notifyWelcome = require("./welcomeNotification");

function registrationError(code, message, statusCode = 400) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function normalizeOwnerRegistration(input = {}) {
  const normalized = {
    name: String(input.name || "").trim(),
    lastname: String(input.lastname || "").trim(),
    gender: String(input.gender || "unspecified").trim(),
    email: String(input.email || "")
      .trim()
      .toLowerCase(),
    phone: String(input.phone || "").trim(),
    password: String(input.password || ""),
    residenceLabel: String(input.residenceLabel || "").trim(),
  };
  if (!/^\S+@\S+\.\S+$/.test(normalized.email)) {
    throw registrationError(
      "IOT_OWNER_EMAIL_INVALID",
      "A valid email is required"
    );
  }
  if (
    !normalized.name ||
    normalized.name.length > 100 ||
    !normalized.lastname ||
    normalized.lastname.length > 100
  ) {
    throw registrationError(
      "IOT_OWNER_NAME_INVALID",
      "Name and last name are required"
    );
  }
  if (!/^\+?[0-9]{8,16}$/.test(normalized.phone)) {
    throw registrationError(
      "IOT_OWNER_PHONE_INVALID",
      "Phone number is invalid"
    );
  }
  if (normalized.password.length < 12 || normalized.password.length > 128) {
    throw registrationError(
      "IOT_OWNER_PASSWORD_INVALID",
      "Password must contain between 12 and 128 characters"
    );
  }
  if (!normalized.residenceLabel || normalized.residenceLabel.length > 100) {
    throw registrationError(
      "IOT_OWNER_RESIDENCE_INVALID",
      "A residence name is required"
    );
  }
  return normalized;
}

function hashVerificationToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

class IoTOwnerRegistrationService {
  constructor({
    models = { Owner, Admin, StaffAdmin, Staff, Family, PlatformUser: require("../models/platformUser") },
    VerificationModel = IoTOwnerVerification,
    emailService = verificationEmail,
    mongo = require("mongoose"),
    now = () => new Date(),
    hashPassword = (password) => bcrypt.hash(password, 12),
  } = {}) {
    this.models = models;
    this.VerificationModel = VerificationModel;
    this.emailService = emailService;
    this.mongo = mongo;
    this.now = now;
    this.hashPassword = hashPassword;
  }

  async register(input) {
    const values = normalizeOwnerRegistration(input);
    const existing = await Promise.all(
      Object.values(this.models).map((Model) =>
        Model.exists({ email: values.email })
      )
    );
    if (existing.some(Boolean)) return { accepted: true };

    const verificationToken = randomBytes(32).toString("hex");
    const tokenHash = hashVerificationToken(verificationToken);
    const now = this.now();
    const owner = new this.models.Owner({
      name: values.name,
      lastname: values.lastname,
      gender: values.gender,
      email: values.email,
      phone: values.phone,
      password: await this.hashPassword(values.password),
      role: "OWNER",
      status: "pending_verification",
      emailVerified: false,
      propertyDetails: [
        {
          contextType: "PERSONAL_RESIDENCE",
          residenceLabel: values.residenceLabel,
          status_property: "active",
          parkingsQty: 0,
          isRenting: false,
          contractStart: now,
          contractEnd: now,
        },
      ],
    });

    await owner.save();
    try {
      await this.VerificationModel.create({
        ownerId: owner._id,
        tokenHash,
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      });
      await this.emailService.sendPersonalOwnerVerification({
        email: owner.email,
        token: verificationToken,
      });
    } catch (error) {
      await this.VerificationModel.deleteMany({ ownerId: owner._id });
      await this.models.Owner.deleteOne({
        _id: owner._id,
        status: "pending_verification",
      });
      throw registrationError(
        error.code || "IOT_OWNER_VERIFICATION_UNAVAILABLE",
        "Account verification could not be sent",
        503
      );
    }

    return { accepted: true };
  }

  async resend(email) {
    if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim()) || email.length > 254) {
      throw registrationError("IOT_OWNER_EMAIL_INVALID", "Indica un correo válido.");
    }
    const owner = await this.models.Owner.findOne({
      email: email.trim().toLowerCase(), status: "pending_verification", emailVerified: false,
      organizationId: null,
    }).select("_id email").lean();
    if (!owner) return { accepted: true };
    const token = randomBytes(32).toString("hex");
    // Replace the token atomically; older links must stop working.
    await this.VerificationModel.findOneAndUpdate({ ownerId: owner._id }, { $set: {
      tokenHash: hashVerificationToken(token), expiresAt: new Date(this.now().getTime() + 24 * 60 * 60 * 1000), usedAt: null,
    } }, { upsert: true });
    await this.emailService.sendPersonalOwnerVerification({ email: owner.email, token });
    return { accepted: true };
  }

  async verify(token) {
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      throw registrationError(
        "IOT_OWNER_VERIFICATION_INVALID",
        "Verification link is invalid",
        400
      );
    }
    const tokenHash = hashVerificationToken(token);
    const session = await this.mongo.startSession();
    let verified = false;
    let welcomeAccount;
    try {
      await session.withTransaction(async () => {
        const verification = await this.VerificationModel.findOne({
          tokenHash,
          usedAt: null,
          expiresAt: { $gt: this.now() },
        }).session(session);
        if (!verification) {
          throw registrationError(
            "IOT_OWNER_VERIFICATION_INVALID",
            "Verification link is invalid or expired",
            400
          );
        }
        const ownerUpdate = await this.models.Owner.updateOne(
          {
            _id: verification.ownerId,
            status: "pending_verification",
            emailVerified: false,
          },
          { $set: { status: "active", emailVerified: true } },
          { session }
        );
        if (ownerUpdate.modifiedCount !== 1) {
          throw registrationError(
            "IOT_OWNER_VERIFICATION_INVALID",
            "Verification link is invalid or already used",
            400
          );
        }
        verification.usedAt = this.now();
        await require("./saasCommercial").provisionFree("PERSONAL_OWNER", verification.ownerId, verification.ownerId, session);
        await verification.save({ session });
        welcomeAccount = await this.models.Owner.findById(verification.ownerId)
          .select("email name").session(session).lean();
        verified = true;
      });
    } finally {
      await session.endSession();
    }
    await notifyWelcome(welcomeAccount, this.emailService);
    return { verified };
  }
}

module.exports = {
  IoTOwnerRegistrationService,
  normalizeOwnerRegistration,
  hashVerificationToken,
};
