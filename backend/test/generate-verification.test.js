"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const mailer = require("nodemailer");

const emailVerification = require("../service/generateVerification");

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
