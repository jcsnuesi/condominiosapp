"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const AccessPolicy = require("../models/accessPolicy");
const AccessGrant = require("../models/accessGrant");
const AuthorizationAudit = require("../models/authorizationAudit");
const Condominium = require("../models/condominio");
const StaffAdmin = require("../models/staff_admin");
const Staff = require("../models/staff");
const { MODULE_ACTIONS, PERMISSIONS, isValidPermission } = require("../service/permissionCatalog");
const {
  ACCOUNT_MODELS,
  publicAccessContext,
  SUBJECT_MODELS,
} = require("../service/authorization");

const PROFILE_IMAGE_TYPES = Object.freeze({
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
});

function cleanPermissions(values) {
  return [...new Set((values || []).map((value) => String(value).toLowerCase()))];
}

function publicAccount(account) {
  if (!account) return null;
  const { password, ...safeAccount } = account;
  return safeAccount;
}

function publicProfile(account, role) {
  const safeAccount = publicAccount(account);
  if (!safeAccount) return null;

  const contact = safeAccount.contact_person?.[0] || {};
  const phoneValue =
    role === "ADMIN" ? contact.phone_contact : safeAccount.phone;

  return {
    ...safeAccount,
    name: safeAccount.name || contact.name_contact || "",
    lastname: safeAccount.lastname || contact.lastname_contact || "",
    phone: Array.isArray(phoneValue) ? phoneValue[0] || "" : phoneValue || "",
  };
}

function profileUploadDirectory(role) {
  if (role === "OWNER") return "owners";
  if (role === "FAMILY") return "family";
  return "users";
}

async function storeProfileAvatar(file, role) {
  if (!file) return null;

  const extension = PROFILE_IMAGE_TYPES[file.mimetype];
  if (!extension) {
    throw Object.assign(new Error("Avatar must be a JPG, PNG, or WebP image"), {
      statusCode: 400,
    });
  }

  const directory = path.resolve(
    __dirname,
    "..",
    "uploads",
    profileUploadDirectory(role)
  );
  const filename = `${crypto.randomUUID()}${extension}`;
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, filename), file.buffer);
  return filename;
}

async function emailBelongsToAnotherAccount(email, accountId) {
  const models = [...new Set(Object.values(ACCOUNT_MODELS))];
  const matches = await Promise.all(
    models.map((Model) =>
      Model.exists({ email, _id: { $ne: accountId } })
    )
  );
  return matches.some(Boolean);
}

function auditData(req, details) {
  return {
    organizationId: req.auth.organizationId,
    actorId: req.user.sub,
    actorRole: req.user.role,
    ip: req.ip || "",
    userAgent: req.get("user-agent") || "",
    ...details,
  };
}

function invalidPermissions(...lists) {
  return lists.flat().filter((permission) => !isValidPermission(permission));
}

function transactionsUnavailable(error) {
  return error?.code === 20 ||
    /Transaction numbers are only allowed|Only servers in a sharded cluster can start a new transaction|replica set member/i.test(
      error?.message || ""
    );
}

async function runAuthorizationWrite(work) {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(() => work(session));
  } catch (error) {
    if (!transactionsUnavailable(error)) throw error;
    return work(null);
  } finally {
    await session.endSession();
  }
}

async function me(req, res) {
  return res.status(200).send({
    status: "success",
    data: {
      // `resolveAccessContext` loads an internal persistence record. Never
      // return credential material from that record to a browser client.
      user: publicProfile(req.auth.account, req.auth.role),
      access: publicAccessContext(req.auth),
    },
  });
}

async function updateMe(req, res) {
  const role = String(req.auth.role || "").toUpperCase();
  const AccountModel = ACCOUNT_MODELS[role];
  const accountId = req.user.sub;
  const name = String(req.body.name || "").trim();
  const lastname = String(req.body.lastname || "").trim();
  const phone = String(req.body.phone || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();

  if (!AccountModel || !name || !lastname || !phone || !email) {
    return res.status(400).send({
      status: "error",
      message: "Name, last name, phone, and email are required",
    });
  }

  try {
    if (await emailBelongsToAnotherAccount(email, accountId)) {
      return res.status(409).send({
        status: "error",
        message: "That email address is already in use",
      });
    }

    const avatar = await storeProfileAvatar(req.file, role);
    const update = { email };

    if (role === "ADMIN") {
      update["contact_person.0.name_contact"] = name;
      update["contact_person.0.lastname_contact"] = lastname;
      update["contact_person.0.phone_contact"] = [phone];
    } else {
      update.name = name;
      update.lastname = lastname;
      update.phone = phone;
    }

    if (avatar) update.avatar = avatar;

    const updated = await AccountModel.findByIdAndUpdate(
      accountId,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).send({
        status: "error",
        message: "Account not found",
      });
    }

    return res.status(200).send({
      status: "success",
      data: { user: publicProfile(updated, role) },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).send({
      status: "error",
      message: error.statusCode
        ? error.message
        : "The profile could not be updated",
    });
  }
}

async function changeMyPassword(req, res) {
  const role = String(req.auth.role || "").toUpperCase();
  const AccountModel = ACCOUNT_MODELS[role];
  const currentPassword = String(req.body.currentPassword || "");
  const newPassword = String(req.body.newPassword || "");
  if (req.auth.isPlatform && (newPassword.length < 12 || newPassword.length > 128)) return res.status(400).send({ message: "La contraseña de plataforma requiere de 12 a 128 caracteres" });

  if (!AccountModel || !currentPassword || newPassword.length < 8) {
    return res.status(400).send({
      status: "error",
      message: "Current password and a new password of at least 8 characters are required",
    });
  }

  try {
    const account = await AccountModel.findById(req.user.sub).select(
      "+password"
    );
    if (!account) {
      return res.status(404).send({
        status: "error",
        message: "Account not found",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      account.password
    );
    if (!passwordMatches) {
      return res.status(400).send({
        status: "error",
        message: "The current password is incorrect",
      });
    }

    account.password = await bcrypt.hash(newPassword, 10);
    if (req.auth.isPlatform) account.sessionVersion = (account.sessionVersion || 0) + 1;
    if ("first_password_changed" in account) {
      account.first_password_changed = true;
    }
    await account.save();

    return res.status(200).send({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "The password could not be updated",
    });
  }
}

async function catalog(req, res) {
  return res.status(200).send({
    status: "success",
    message: { modules: MODULE_ACTIONS, permissions: PERMISSIONS },
  });
}

async function listPolicies(req, res) {
  const policies = await AccessPolicy.find({ organizationId: req.auth.organizationId })
    .sort({ isSystem: -1, name: 1 })
    .lean();
  return res.status(200).send({ status: "success", message: policies });
}

async function createPolicy(req, res) {
  if (req.body.excludedModules !== undefined && (!Array.isArray(req.body.excludedModules) || req.body.excludedModules.some(value => typeof value !== "string" || !Object.hasOwn(MODULE_ACTIONS, value)))) {
    return res.status(400).send({ status: "error", message: "Invalid excluded modules" });
  }
  const excludedModules = [...new Set(req.body.excludedModules || [])];
  const permissions = cleanPermissions(req.body.permissions);
  const unknown = invalidPermissions(permissions);
  if (!req.body.name || unknown.length) {
    return res.status(400).send({ status: "error", message: "Invalid policy", unknownPermissions: unknown });
  }

  try {
    let created;
    await mongoose.connection.transaction(async (session) => {
      [created] = await AccessPolicy.create([{
        organizationId: req.auth.organizationId,
        name: req.body.name,
        description: req.body.description || "",
        permissions,
        excludedModules,
        isSystem: false,
        createdBy: req.user.sub,
      }], { session });
      await AuthorizationAudit.create([auditData(req, {
        action: "policy.create", targetType: "AccessPolicy", targetId: created._id,
        before: null, after: created.toObject(),
      })], { session });
    });
    return res.status(201).send({ status: "success", message: created });
  } catch (error) {
    const status = error?.code === 11000 ? 409 : 500;
    return res.status(status).send({ status: "error", message: status === 409 ? "Policy name already exists" : "Policy could not be created" });
  }
}

async function updatePolicy(req, res) {
  if (req.body.excludedModules !== undefined && (!Array.isArray(req.body.excludedModules) || req.body.excludedModules.some(value => typeof value !== "string" || !Object.hasOwn(MODULE_ACTIONS, value)))) {
    return res.status(400).send({ status: "error", message: "Invalid excluded modules" });
  }
  const permissions = cleanPermissions(req.body.permissions);
  const unknown = invalidPermissions(permissions);
  if (!req.body.name || unknown.length) {
    return res.status(400).send({ status: "error", message: "Invalid policy", unknownPermissions: unknown });
  }

  try {
    let updated;
    await mongoose.connection.transaction(async (session) => {
      const before = await AccessPolicy.findOne({
        _id: req.params.id, organizationId: req.auth.organizationId,
      }).session(session).lean();
      if (!before) throw Object.assign(new Error("NOT_FOUND"), { statusCode: 404 });
      if (before.isSystem) throw Object.assign(new Error("SYSTEM_POLICY"), { statusCode: 409 });

      updated = await AccessPolicy.findByIdAndUpdate(before._id, {
        $set: { name: req.body.name, description: req.body.description || "", permissions,
          excludedModules: req.body.excludedModules === undefined ? (before.excludedModules || []) : [...new Set(req.body.excludedModules)] },
      }, { new: true, runValidators: true, session });
      await AuthorizationAudit.create([auditData(req, {
        action: "policy.update", targetType: "AccessPolicy", targetId: updated._id,
        before, after: updated.toObject(),
      })], { session });
    });
    return res.status(200).send({ status: "success", message: updated });
  } catch (error) {
    return res.status(error.statusCode || (error?.code === 11000 ? 409 : 500)).send({ status: "error", message: error.message });
  }
}

async function archivePolicy(req, res) {
  try {
    await mongoose.connection.transaction(async (session) => {
      const policy = await AccessPolicy.findOne({ _id: req.params.id, organizationId: req.auth.organizationId }).session(session);
      if (!policy) throw Object.assign(new Error("NOT_FOUND"), { statusCode: 404 });
      if (policy.isSystem) throw Object.assign(new Error("SYSTEM_POLICY"), { statusCode: 409 });
      const assigned = await AccessGrant.exists({ organizationId: req.auth.organizationId, policyIds: policy._id }).session(session);
      if (assigned) throw Object.assign(new Error("POLICY_IS_ASSIGNED"), { statusCode: 409 });
      const before = policy.toObject();
      policy.status = "archived";
      await policy.save({ session });
      await AuthorizationAudit.create([auditData(req, {
        action: "policy.archive", targetType: "AccessPolicy", targetId: policy._id,
        before, after: policy.toObject(),
      })], { session });
    });
    return res.status(200).send({ status: "success", message: "Policy archived" });
  } catch (error) {
    return res.status(error.statusCode || 500).send({ status: "error", message: error.message });
  }
}

async function listAdministrativeUsers(req, res) {
  const [staffAdmins, staff, grants] = await Promise.all([
    StaffAdmin.find({ organizationId: req.auth.organizationId }).select("-password -government_id").lean(),
    Staff.find({ organizationId: req.auth.organizationId })
      .select("-password -government_id")
      .populate("condo_id", "_id alias")
      .lean(),
    AccessGrant.find({ organizationId: req.auth.organizationId }).populate("policyIds", "name key status").lean(),
  ]);
  const grantBySubject = new Map(grants.map((grant) => [`${grant.subjectModel}:${grant.subjectId}`, grant]));
  const attach = (users, subjectModel) => users.map((user) => ({
    ...user, subjectModel, accessGrant: grantBySubject.get(`${subjectModel}:${user._id}`) || null,
  }));
  return res.status(200).send({
    status: "success",
    message: [...attach(staffAdmins, "Staff_Admin"), ...attach(staff, "Staff")],
  });
}

function administrativeSubject(subjectModel) {
  if (subjectModel === "Staff_Admin") return StaffAdmin;
  if (subjectModel === "Staff") return Staff;
  return null;
}

async function updateAdministrativeUserStatus(req, res) {
  const subjectModel = req.params.subjectModel;
  const Subject = administrativeSubject(subjectModel);
  const status = String(req.body.status || "").toLowerCase();

  if (
    !Subject ||
    !mongoose.Types.ObjectId.isValid(req.params.subjectId) ||
    !["active", "inactive"].includes(status)
  ) {
    return res.status(400).send({
      status: "error",
      message: "A valid user and status are required",
    });
  }

  try {
    let updated;
    await runAuthorizationWrite(async (session) => {
      const query = Subject.findOne({
        _id: req.params.subjectId,
        organizationId: req.auth.organizationId,
      });
      const before = await query.session(session || null).lean();
      if (!before) {
        throw Object.assign(new Error("User not found"), { statusCode: 404 });
      }

      updated = await Subject.findByIdAndUpdate(
        before._id,
        { $set: { status } },
        { new: true, runValidators: true, session: session || undefined }
      ).select("-password -government_id");

      await AuthorizationAudit.create(
        [
          auditData(req, {
            action: "administrative-user.status.update",
            targetType: subjectModel,
            targetId: before._id,
            before: { status: before.status },
            after: { status },
          }),
        ],
        { session: session || undefined }
      );
    });

    return res.status(200).send({ status: "success", message: updated });
  } catch (error) {
    return res.status(error.statusCode || 500).send({
      status: "error",
      message: error.statusCode ? error.message : "User status could not be updated",
    });
  }
}

async function deleteAdministrativeUser(req, res) {
  const subjectModel = req.params.subjectModel;
  const Subject = administrativeSubject(subjectModel);

  if (!Subject || !mongoose.Types.ObjectId.isValid(req.params.subjectId)) {
    return res.status(400).send({
      status: "error",
      message: "A valid user is required",
    });
  }

  try {
    let deletedUser;
    await runAuthorizationWrite(async (session) => {
      deletedUser = await Subject.findOne({
        _id: req.params.subjectId,
        organizationId: req.auth.organizationId,
      })
        .session(session || null)
        .lean();

      if (!deletedUser) {
        throw Object.assign(new Error("User not found"), { statusCode: 404 });
      }

      await Promise.all([
        AccessGrant.deleteOne({
          organizationId: req.auth.organizationId,
          subjectModel,
          subjectId: deletedUser._id,
        }).session(session || null),
        Subject.deleteOne({
          _id: deletedUser._id,
          organizationId: req.auth.organizationId,
        }).session(session || null),
        AuthorizationAudit.create(
          [
            auditData(req, {
              action: "administrative-user.delete.permanent",
              targetType: subjectModel,
              targetId: deletedUser._id,
              before: publicAccount(deletedUser),
              after: null,
            }),
          ],
          { session: session || undefined }
        ),
      ]);
    });

    const sharedAvatars = new Set([
      "noimage.jpeg",
      "noimage2.jpeg",
      "default-avatar1.png",
    ]);
    const avatarName = path.basename(deletedUser.avatar || "");
    if (avatarName && !sharedAvatars.has(avatarName)) {
      const uploadFolder = subjectModel === "Staff" ? "staff" : "users";
      try {
        await fs.unlink(
          path.resolve(__dirname, "..", "uploads", uploadFolder, avatarName)
        );
      } catch (fileError) {
        if (fileError.code !== "ENOENT") {
          console.error("Administrative user avatar cleanup failed:", fileError.message);
        }
      }
    }

    return res.status(200).send({
      status: "success",
      message: "User permanently deleted",
      deletedId: deletedUser._id,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).send({
      status: "error",
      message: error.statusCode ? error.message : "User could not be permanently deleted",
    });
  }
}

async function upsertGrant(req, res) {
  const subjectModel = req.params.subjectModel;
  const Subject = subjectModel === "Staff_Admin" ? StaffAdmin : subjectModel === "Staff" ? Staff : null;
  if (!Subject || !mongoose.Types.ObjectId.isValid(req.params.subjectId)) {
    return res.status(400).send({ status: "error", message: "Invalid access subject" });
  }
  const allow = cleanPermissions(req.body.overrides?.allow);
  const deny = cleanPermissions(req.body.overrides?.deny);
  const policyIds = [...new Set((req.body.policyIds || []).map(String))];
  const mode = String(req.body.scope?.mode || "SELECTED").toUpperCase();
  const condominiumIds = mode === "SELECTED" ? [...new Set((req.body.scope?.condominiumIds || []).map(String))] : [];
  const unknown = invalidPermissions(allow, deny);
  if (unknown.length || !["ALL", "SELECTED"].includes(mode)) {
    return res.status(400).send({ status: "error", message: "Invalid grant", unknownPermissions: unknown });
  }

  try {
    let saved;
    await runAuthorizationWrite(async (session) => {
      const [subject, policyCount, condominiumCount, before] = await Promise.all([
        Subject.findOne({ _id: req.params.subjectId, organizationId: req.auth.organizationId }).session(session || null).lean(),
        AccessPolicy.countDocuments({ _id: { $in: policyIds }, organizationId: req.auth.organizationId, status: "active" }).session(session || null),
        Condominium.countDocuments({ _id: { $in: condominiumIds }, organizationId: req.auth.organizationId }).session(session || null),
        AccessGrant.findOne({ subjectModel, subjectId: req.params.subjectId }).session(session || null).lean(),
      ]);
      if (!subject) throw Object.assign(new Error("SUBJECT_NOT_FOUND"), { statusCode: 404 });
      if (policyCount !== policyIds.length) throw Object.assign(new Error("INVALID_POLICY_SCOPE"), { statusCode: 400 });
      if (condominiumCount !== condominiumIds.length) throw Object.assign(new Error("INVALID_CONDOMINIUM_SCOPE"), { statusCode: 400 });

      saved = await AccessGrant.findOneAndUpdate(
        { subjectModel, subjectId: subject._id },
        { $set: {
          organizationId: req.auth.organizationId, policyIds,
          overrides: { allow, deny }, scope: { mode, condominiumIds }, updatedBy: req.user.sub,
        } },
        { new: true, upsert: true, runValidators: true, session: session || undefined }
      );
      await AuthorizationAudit.create([auditData(req, {
        action: "grant.upsert", targetType: "AccessGrant", targetId: saved._id,
        before, after: saved.toObject(),
      })], { session: session || undefined });
    });
    return res.status(200).send({ status: "success", message: saved });
  } catch (error) {
    return res.status(error.statusCode || 500).send({ status: "error", message: error.message });
  }
}

module.exports = {
  me, updateMe, changeMyPassword,
  catalog, listPolicies, createPolicy, updatePolicy, archivePolicy,
  listAdministrativeUsers, updateAdministrativeUserStatus,
  deleteAdministrativeUser, upsertGrant,
};
