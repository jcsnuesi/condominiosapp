"use strict";

let validator = require("validator");
let bcrypt = require("bcrypt");
const crypto = require("crypto");
let saltRounds = 10;
let path = require("path");
let fs = require("fs");
let jwtoken = require("../service/jwt");
let checkExtensions = require("../service/extensions");
let Admin = require("../models/admin");
let Staff = require("../models/staff");
let Owner = require("../models/owners");
let Condominio = require("../models/condominio");
const Staff_Admin = require("../models/staff_admin");
let PasswordResetToken = require("../models/passwordResetToken");
let deactivatedOwner = require("../service/persistencia");
let backup = require("../models/accountsDeleted");
const mailer = require("nodemailer");
var Family = require("../models/family");
const apiResponse = require("../service/apiResponse");
const {
  resolveAccessContext,
  publicAccessContext,
} = require("../service/authorization");

function buildResetLink(token) {
  const frontendBase = (
    process.env.FRONTEND_BASE_URL || "https://condapp.hsantosnuesi.com"
  ).replace(/\/$/, "");
  return `${frontendBase}/#/auth/reset-password/${token}`;
}

async function sendResetPasswordEmail(email, resetLink) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.log(`Password reset link for ${email}: ${resetLink}`);
    return;
  }

  const transporter = mailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || smtpUser,
    to: email,
    subject: "Recuperacion de acceso",
    text: `Recibimos una solicitud para restablecer tu clave. Usa este enlace: ${resetLink}. Expira en 30 minutos.`,
  });
}

var controller = {
  login: async function (req, res) {
    const params = { ...req.body, email: typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "" };

    const rememberMe = Boolean(params.rememberMe);

    try {
      var val_email = validator.isEmail(params.email);
      var val_password = !validator.isEmpty(params.password);
    } catch (error) {
      return apiResponse.failure(
        res,
        400,
        { message: "Missing data" },
        "AUTH_INVALID_PAYLOAD"
      );
    }

    if (val_email && val_password) {
      const userFound = await Promise.all([
        Admin.findOne({ email: params.email }).select("+password").lean(),
        Staff_Admin.findOne({ email: params.email }).select("+password").lean(),
        Staff.findOne({ email: params.email }).select("+password").lean(),
        Owner.findOne({ email: params.email })
          .populate({
            path: "propertyDetails.addressId",
            select:
              "alias type phone street_1 street_2 sector_name city province zipcode country  status createdAt createdBy",
          })
          .populate(
            "familyAccount",
            "name lastname gender email phone status permission addressId"
          ),

        Family.findOne({ email: params.email }).select("+password").lean(),
      ]);

      let foundUser = null;

      const response = userFound.some((user) => {
        if (user) {
          foundUser = user;
          return true;
        }
        return false;
      });

      if (response == false) {
        return apiResponse.failure(
          res,
          404,
          { message: "Account not found" },
          "AUTH_ACCOUNT_NOT_FOUND"
        );
      }

      if (foundUser?.status?.includes("inactive")) {
        return apiResponse.failure(
          res,
          403,
          { message: "Account terminated" },
          "AUTH_ACCOUNT_INACTIVE"
        );
      }

      bcrypt.compare(params.password, foundUser.password, async (err, verified) => {
        if (err) {
          return apiResponse.failure(
            res,
            500,
            { message: "Server error validating credentials" },
            "AUTH_VERIFY_ERROR"
          );
        }

        if (verified) {
          const accessContext = await resolveAccessContext({
            sub: foundUser._id,
            role: foundUser.role,
            organizationId: foundUser.organizationId,
          });
          if (!accessContext) {
            return apiResponse.failure(
              res,
              403,
              { message: "Account has no active organization access" },
              "AUTH_CONTEXT_MISSING"
            );
          }
          const session = jwtoken.resolveSessionExpiration({ rememberMe });
          const token = jwtoken.createToken(foundUser, { rememberMe });

          //Generar token jwt y devolverlo
          if (params.gettoken) {
            return apiResponse.success(
              res,
              200,
              {
                token,
                session,
              },
              "AUTH_LOGIN_TOKEN"
            );
          } else {
            //Limpiar el objeto para que no se muestre el resultado de la password
            foundUser.password = undefined;

            //Devolver datos

            return apiResponse.success(
              res,
              200,
              {
                user: foundUser,
                token,
                session,
                access: publicAccessContext(accessContext),
              },
              "AUTH_LOGIN_SUCCESS"
            );
          }
        } else {
          return apiResponse.failure(
            res,
            401,
            { message: "Invalid credentials." },
            "AUTH_INVALID_CREDENTIALS"
          );
        }
      });
    } else {
      return apiResponse.failure(
        res,
        401,
        { message: "Fill out all fields." },
        "AUTH_MISSING_FIELDS"
      );
    }
  },

  forgotPassword: async function (req, res) {
    try {
      const email = String(req.body.email || "")
        .trim()
        .toLowerCase();

      const userSearch = await Promise.all([
        Admin.findOne({ email }).select("_id email"),
        Staff_Admin.findOne({ email }).select("_id email"),
        Staff.findOne({ email }).select("_id email"),
        Owner.findOne({ email }).select("_id email"),
        Family.findOne({ email }).select("_id email"),
      ]);

      const modelNames = ["Admin", "Staff_Admin", "Staff", "Owner", "Family"];
      const modelIndex = userSearch.findIndex((user) => Boolean(user));

      if (modelIndex === -1) {
        return apiResponse.success(
          res,
          200,
          {
            message:
              "Si la cuenta existe, enviaremos instrucciones de recuperacion.",
          },
          "AUTH_RESET_REQUESTED"
        );
      }

      const user = userSearch[modelIndex];
      const userModel = modelNames[modelIndex];
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await PasswordResetToken.updateMany(
        { userId: user._id, userModel, usedAt: null },
        { $set: { usedAt: new Date() } }
      );

      await PasswordResetToken.create({
        userId: user._id,
        userModel,
        email,
        tokenHash,
        expiresAt,
      });

      await sendResetPasswordEmail(email, buildResetLink(rawToken));

      return apiResponse.success(
        res,
        200,
        {
          message:
            "Si la cuenta existe, enviaremos instrucciones de recuperacion.",
        },
        "AUTH_RESET_REQUESTED"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        { message: "No se pudo procesar la solicitud de recuperacion." },
        "AUTH_RESET_REQUEST_FAILED"
      );
    }
  },

  resetPassword: async function (req, res) {
    try {
      const token = String(req.body.token || "").trim();
      const password = String(req.body.password || "");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      const resetToken = await PasswordResetToken.findOne({
        tokenHash,
        usedAt: null,
        expiresAt: { $gt: new Date() },
      });

      if (!resetToken) {
        return apiResponse.failure(
          res,
          400,
          { message: "Token de recuperacion invalido o expirado." },
          "AUTH_RESET_INVALID_TOKEN"
        );
      }

      const models = {
        Admin,
        Staff_Admin,
        Staff,
        Owner,
        Family,
      };

      const targetModel = models[resetToken.userModel];
      const account = await targetModel
        .findById(resetToken.userId)
        .select("_id password");

      if (!account) {
        return apiResponse.failure(
          res,
          404,
          { message: "Cuenta no encontrada." },
          "AUTH_RESET_ACCOUNT_NOT_FOUND"
        );
      }

      account.password = await bcrypt.hash(password, saltRounds);
      account.first_password_changed = true;
      await account.save();

      resetToken.usedAt = new Date();
      await resetToken.save();

      return apiResponse.success(
        res,
        200,
        { message: "Clave actualizada correctamente." },
        "AUTH_RESET_SUCCESS"
      );
    } catch (error) {
      return apiResponse.failure(
        res,
        500,
        { message: "No se pudo actualizar la clave." },
        "AUTH_RESET_FAILED"
      );
    }
  },

  deleteOwner: async function (req, res) {
    var params = req.body;

    Owner.findOne({ _id: params.id }, async (err, ownerFound) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Server error",
        });
      }

      if (!ownerFound) {
        return res.status(404).send({
          status: "error",
          message: "User was not found",
        });
      }

      if (!ownerFound.adminId.includes(req.user.sub)) {
        return res.status(400).send({
          status: "forbidden",
          message: "You are not authorized",
        });
      }

      /// ELIMINAR OWNER DEL CONDOMINIO
      const condominio = await Condominio.findOne({ _id: params.idCondominio });

      condominio.owners.splice(
        condominio.owners.indexOf(params.idCondominio),
        1
      );
      const condominioUpdated = await Condominio.findOneAndUpdate(
        { _id: params.idCondominio },
        condominio,
        { new: true }
      );

      ownerFound.adminId.splice(ownerFound.adminId.indexOf(req.user.sub), 1);
      const ownerUpdated = await Owner.findOneAndUpdate(
        { _id: params.id },
        ownerFound,
        { new: true }
      );

      return res.status(200).send({
        status: "success",
        message: ownerUpdated,
      });
    });
  },
  avatar: async function (req, res) {
    var params = req.files.avatar;
    var fileName = params.path.split("\\")[2];

    //verificar la extension de archivo enviado sea tipo imagen
    var imgFormatAccepted = checkExtensions.confirmExtension(req);

    if (imgFormatAccepted == false) {
      return res.status(400).send({
        status: "bad request",
        message: "Files allows '.jpg', '.jpeg', '.gif', '.png'",
      });
    }

    Admin.findOneAndUpdate(
      { _id: req.user.sub },
      { avatar: fileName },
      { new: true },
      (err, updated) => {
        if (err) {
          return res.status(500).send({
            status: "bad request",
            message: "Avatar was not updating, try again.",
          });
        }

        return res.status(200).send({
          status: "success",
          message: updated,
        });
      }
    );
  },
  getAvatar: function (req, res) {
    var fileName = req.params.fileName;
    var imgName = req.params.imgName;

    var paths = "./uploads/" + fileName + "/" + imgName;

    if (fs.existsSync(paths)) {
      return res.sendFile(path.resolve(paths));
    } else {
      return res.status(404).send({
        status: "error",
        message: "Image does not exits",
      });
    }
  },
};

module.exports = controller;
