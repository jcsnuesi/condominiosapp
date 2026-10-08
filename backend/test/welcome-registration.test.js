"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const Family = require("../models/family");
const Condominium = require("../models/condominio");
const Admin = require("../models/admin");
const emailService = require("../service/generateVerification");
const whatsapp = require("../controllers/whatsappController");
const familyController = require("../controllers/family");
const condominiumController = require("../controllers/condominio");

function response() {
  return { status(code) { this.code = code; return this; }, send(body) { this.body = body; return this; } };
}

test("family registration emails a usable unique password and survives mail failure", async t => {
  const savedHashes = [];
  const emails = [];
  t.mock.method(Family, "findOne", async () => null);
  t.mock.method(Family.prototype, "save", async function () { savedHashes.push(this.password); return this; });
  t.mock.method(Condominium, "findById", () => ({ select: () => ({ lean: async () => ({ alias: "Jardines" }) }) }));
  t.mock.method(whatsapp, "sendWhatsappMessage", () => {});
  t.mock.method(console, "error", () => {});
  t.mock.method(emailService, "verifyRegistration", async account => {
    emails.push(account);
    if (emails.length === 2) throw new Error("SMTP unavailable");
  });
  for (let i = 0; i < 2; i++) {
    const res = response();
    await familyController.createAccount({
      user: { sub: "507f1f77bcf86cd799439011" }, auth: { organizationId: "507f1f77bcf86cd799439012" },
      body: { ownerId: "507f1f77bcf86cd799439011", addressId: "507f1f77bcf86cd799439013", name: "Ana", lastname: "Santos", email: `ana${i}@example.com`, phone: "8095551234", gender: "unspecified", unit: "A1" },
    }, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.emailSent, i === 0);
    assert.equal(res.body.message.password, undefined);
    assert.equal(await bcrypt.compare(emails[i].passwordTemp, savedHashes[i]), true);
  }
  assert.notEqual(emails[0].passwordTemp, emails[1].passwordTemp);
});

test("condominium welcome goes to its creator only after saving and preserves success on mail failure", async t => {
  t.mock.method(require("../models/saasMembership"), "exists", async () => null);
  let saved = false;
  let sent = 0;
  t.mock.method(Condominium, "findOne", async () => null);
  t.mock.method(Condominium.prototype, "save", async function () { saved = true; return this; });
  t.mock.method(Admin, "findOne", filter => {
    assert.equal(filter._id, "507f1f77bcf86cd799439011");
    assert.equal(filter.organizationId, "507f1f77bcf86cd799439012");
    return { select: () => ({ lean: async () => ({ email: "admin@example.com" }) }) };
  });
  t.mock.method(emailService, "sendWelcome", async account => {
    assert.equal(saved, true);
    assert.equal(account.email, "admin@example.com");
    assert.equal(account.condominiumName, "Jardines");
    sent++;
    if (sent === 2) throw new Error("SMTP unavailable");
  });
  t.mock.method(console, "error", () => {});
  for (let i = 0; i < 2; i++) {
    saved = false;
    const res = response();
    await condominiumController.createCondominium({
      user: { sub: "507f1f77bcf86cd799439011", role: "ADMIN" }, auth: { organizationId: "507f1f77bcf86cd799439012" },
      body: { alias: "Jardines", street_1: "Calle 1", street_2: "Calle 2", sector_name: "Centro", city: "Santo Domingo", province: "Distrito Nacional", mPayment: "1000" },
    }, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.emailSent, i === 0);
  }
  assert.equal(sent, 2);
});
