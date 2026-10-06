"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const mailer = require("nodemailer");

const emailVerification = require("../service/generateVerification");
const notifyWelcome = require("../service/welcomeNotification");

test("welcome mail uses existing SMTP for all account roles and condominium registration", async () => {
  const originalCreateTransport = mailer.createTransport;
  const originalEnv = { SMTP_USER: process.env.SMTP_USER, SMTP_PASS: process.env.SMTP_PASS, FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL, PUBLIC_API_BASE_URL: process.env.PUBLIC_API_BASE_URL };
  const messages = [];
  process.env.SMTP_USER = "sender@example.com";
  process.env.SMTP_PASS = "app-password";
  process.env.FRONTEND_BASE_URL = "https://app.example.com/";
  process.env.PUBLIC_API_BASE_URL = "https://api.example.com/api/";
  mailer.createTransport = () => ({ sendMail: async message => { messages.push(message); } });
  try {
    for (const role of ["ADMIN", "OWNER", "STAFF", "STAFF_ADMIN", "FAMILY"]) {
      await emailVerification.sendWelcome({ email: `${role}@example.com`, name: role });
    }
    await emailVerification.sendWelcome({ email: "admin@example.com", condominiumName: "Jardines" });
    await emailVerification.verifyRegistration({ email: "owner@example.com", name: "Ana", passwordTemp: "temporary-secret" });
    await emailVerification.verifyRegistration({ email: "family@example.com", passwordTemp: "family-secret" });
    await emailVerification.StaffRegistration({ email: "staff@example.com", password: "staff-secret" });
    assert.equal(messages.length, 9);
    for (const message of messages) {
      assert.equal(message.subject, "Bienvenida a la plataforma");
      assert.match(message.text, /https:\/\/app.example.com\/#\/auth\/login/);
      assert.doesNotMatch(message.text, /undefined/);
    }
    assert.match(messages[5].text, /condominio Jardines/);
    assert.match(messages[6].text, /temporary-secret/);
    assert.match(messages[6].text, /https:\/\/api.example.com\/api\/verify-email\/owner%40example.com/);
    assert.match(messages[7].text, /family-secret/);
    assert.match(messages[8].text, /staff-secret/);
    assert.match(messages[8].text, /staff-verify-email/);
  } finally {
    mailer.createTransport = originalCreateTransport;
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("welcome delivery failure preserves successful registration", async () => {
  const originalError = console.error;
  console.error = () => {};
  try {
    assert.equal(await notifyWelcome({ email: "admin@example.com" }, {
      sendWelcome: async () => { throw Object.assign(new Error("smtp unavailable"), { code: "ECONNECTION" }); },
    }), false);
  } finally {
    console.error = originalError;
  }
});

test("SMTP settings reject missing credentials before Nodemailer authentication", () => {
  assert.throws(
    () => emailVerification._smtpSettings({}),
    (error) =>
      error.code === "SMTP_CONFIG_MISSING" &&
      /SMTP_USER and SMTP_PASS/.test(error.message)
  );
});

test("SMTP settings support the legacy EMAIL_PASSWORD during migration", () => {
  const settings = emailVerification._smtpSettings({
    SMTP_USER: "sender@example.com",
    EMAIL_PASSWORD: "abcd efgh ijkl mnop",
    PUBLIC_API_BASE_URL: "https://api.example.com/api/",
  });

  assert.deepEqual(settings.transport.auth, {
    user: "sender@example.com",
    pass: "abcdefghijklmnop",
  });
  assert.equal(settings.from, "sender@example.com");
  assert.equal(settings.apiBaseUrl, "https://api.example.com/api");
});

test("Staff registration propagates delivery failures to its controller", async () => {
  const originalCreateTransport = mailer.createTransport;
  const originalSmtpUser = process.env.SMTP_USER;
  const originalSmtpPass = process.env.SMTP_PASS;
  const deliveryError = Object.assign(new Error("Authentication failed"), {
    code: "EAUTH",
  });

  process.env.SMTP_USER = "sender@example.com";
  process.env.SMTP_PASS = "app-password";
  mailer.createTransport = () => ({
    sendMail: async () => {
      throw deliveryError;
    },
  });

  try {
    await assert.rejects(
      () =>
        emailVerification.StaffRegistration({
          email: "staff@example.com",
          password: "temporary-password",
        }),
      (error) => error === deliveryError
    );
  } finally {
    mailer.createTransport = originalCreateTransport;
    if (originalSmtpUser === undefined) delete process.env.SMTP_USER;
    else process.env.SMTP_USER = originalSmtpUser;
    if (originalSmtpPass === undefined) delete process.env.SMTP_PASS;
    else process.env.SMTP_PASS = originalSmtpPass;
  }
});
