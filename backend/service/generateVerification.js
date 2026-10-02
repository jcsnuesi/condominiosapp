"use strict";

const mailer = require("nodemailer");
require("dotenv").config();

function smtpSettings(env = process.env) {
  const user = String(env.SMTP_USER || "").trim();
  const rawPass = String(env.SMTP_PASS || "").trim();
  const service = String(env.SMTP_SERVICE || "gmail").trim();
  const pass =
    service.toLowerCase() === "gmail" ? rawPass.replace(/\s+/g, "") : rawPass;

  if (!user || !pass) {
    const error = new Error(
      "SMTP is not configured. Set SMTP_USER and SMTP_PASS."
    );
    error.code = "SMTP_CONFIG_MISSING";
    throw error;
  }

  const host = String(env.SMTP_HOST || "").trim();
  const port = Number(env.SMTP_PORT || 465);
  const secure = String(env.SMTP_SECURE || "true").toLowerCase() !== "false";
  const transport = host
    ? { host, port, secure, auth: { user, pass } }
    : {
        service,
        auth: { user, pass },
      };

  return {
    transport,
    from: String(env.SMTP_FROM || user).trim(),
    apiBaseUrl: String(
      env.PUBLIC_API_BASE_URL || "http://localhost:3993/api"
    ).replace(/\/$/, ""),
  };
}

function createTransport(env = process.env) {
  return mailer.createTransport(smtpSettings(env).transport);
}

async function sendEmail({ to, subject, text }, env = process.env) {
  const settings = smtpSettings(env);
  return createTransport(env).sendMail({
    from: settings.from,
    to,
    subject,
    text,
  });
}

exports.verifySmtpConnection = async function () {
  await createTransport().verify();
};

exports.sendPersonalOwnerVerification = async function ({ email, token }) {
  const { apiBaseUrl } = smtpSettings();
  const verificationLink = `${apiBaseUrl}/iot/owners/verify/${encodeURIComponent(
    token
  )}`;
  return sendEmail({
    to: email,
    subject: "Verifica tu cuenta de Smart Home",
    text: `Para verificar tu cuenta y activar tu residencia Smart Home, abre este enlace dentro de las próximas 24 horas:\n\n${verificationLink}\n`,
  });
};

exports.verifyRegistration = async function (user) {
  const { apiBaseUrl } = smtpSettings();
  const verificationLink = `${apiBaseUrl}/verify-email/${encodeURIComponent(
    user.email
  )}`;
  const message = `Por favor, haz clic en el siguiente enlace para verificar tu cuenta: ${verificationLink}\n\n==== Credenciales de acceso ====\nEmail: ${user.email}\nPassword: ${user.passwordTemp}\n`;

  return sendEmail({
    to: user.email,
    subject: "Verificación de cuenta",
    text: message,
  });
};

exports.CodeVerification = async function (email, code) {
  return sendEmail({
    to: email,
    subject: "Verificación de cuenta",
    text: `Your guest verification code is: ${code}`,
  });
};

exports.StaffRegistration = async function ({ email, password }) {
  const { apiBaseUrl } = smtpSettings();
  const verificationLink = `${apiBaseUrl}/staff-verify-email/${encodeURIComponent(
    email
  )}`;
  const message = `Por favor, haz clic en el siguiente enlace para verificar tu cuenta: ${verificationLink}\nPassword temporal: ${password}\n`;

  return sendEmail({
    to: email,
    subject: "Verificación de cuenta",
    text: message,
  });
};

exports._smtpSettings = smtpSettings;
