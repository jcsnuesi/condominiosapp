"use strict";

const mailer = require("nodemailer");
require("dotenv").config();

function smtpSettings(env = process.env) {
  const user = String(env.SMTP_USER || "").trim();
  const rawPass = String(env.SMTP_PASS || env.EMAIL_PASSWORD || "").trim();
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
      env.PUBLIC_API_BASE_URL || "https://condapp.hsantosnuesi.com/api"
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

exports.sendWelcome = async function ({ email, name, condominiumName, verificationLink, temporaryPassword }) {
  const frontendBase = String(process.env.FRONTEND_BASE_URL || "https://condapp.hsantosnuesi.com").replace(/\/$/, "");
  const lines = [
    `Hola${name ? ` ${name}` : ""},`,
    "¡Te damos la bienvenida a la plataforma!",
    condominiumName ? `El condominio ${condominiumName} ya está registrado en la plataforma.` : "Tu cuenta ha sido creada correctamente.",
    verificationLink ? `Verifica tu cuenta para comenzar: ${verificationLink}` : "Ya puedes iniciar sesión con tu correo y contraseña.",
    `Accede a la plataforma: ${frontendBase}/#/auth/login`,
  ];
  if (temporaryPassword) {
    lines.push(`Correo: ${email}`, `Contraseña temporal: ${temporaryPassword}`, "Cambia tu contraseña al ingresar.");
  }
  return sendEmail({ to: email, subject: "Bienvenida a la plataforma", text: lines.join("\n\n") });
};

exports.sendAdminVerification = async function ({ email, token }) {
  const frontendBase = String(process.env.FRONTEND_BASE_URL || "https://condapp.hsantosnuesi.com").replace(/\/$/, "");
  return sendEmail({
    to: email,
    subject: "Verifica tu cuenta de administración",
    text: `Para crear tu cuenta ADMIN y tu organización, abre este enlace dentro de las próximas 24 horas:\n\n${frontendBase}/#/auth/verify/admin/${encodeURIComponent(token)}\n`,
  });
};

exports.sendPersonalOwnerVerification = async function ({ email, token }) {
  const frontendBase = String(process.env.FRONTEND_BASE_URL || "https://condapp.hsantosnuesi.com").replace(/\/$/, "");
  const verificationLink = `${frontendBase}/#/auth/verify/owner/${encodeURIComponent(token)}`;
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
  return exports.sendWelcome({
    email: user.email,
    name: user.name,
    verificationLink,
    temporaryPassword: user.passwordTemp,
  });
};

exports.CodeVerification = async function (email, code) {
  return sendEmail({
    to: email,
    subject: "Verificación de cuenta",
    text: `Your guest verification code is: ${code}`,
  });
};

exports.StaffRegistration = async function ({ email, password, name }) {
  const { apiBaseUrl } = smtpSettings();
  const verificationLink = `${apiBaseUrl}/staff-verify-email/${encodeURIComponent(
    email
  )}`;
  return exports.sendWelcome({
    email,
    name,
    verificationLink,
    temporaryPassword: password,
  });
};

exports._smtpSettings = smtpSettings;
