"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  IoTOwnerRegistrationService,
  hashVerificationToken,
  normalizeOwnerRegistration,
} = require("../service/iotOwnerRegistrationService");

function registrationInput() {
  return {
    name: "María",
    lastname: "Santos",
    email: "maria@example.test",
    gender: "unspecified",
    phone: "+18095550123",
    password: "a-long-personal-passphrase",
    residenceLabel: "Casa principal",
  };
}

function makeRegistrationHarness({ existingEmail = false } = {}) {
  const owners = [];
  const verificationTokens = [];
  const sentEmails = [];
  class Owner {
    constructor(document) {
      Object.assign(this, document);
      this._id = "owner-1";
    }
    async save() {
      owners.push(this);
    }
    static async exists() {
      return existingEmail ? { _id: "existing" } : null;
    }
    static async deleteOne() {}
    static async updateOne() {
      return { modifiedCount: 1 };
    }
  }
  class Verification {
    static async create(document) {
      verificationTokens.push(document);
    }
    static async deleteMany() {}
    static findOne() {
      return { session: async () => ({ usedAt: null, save: async () => {} }) };
    }
  }
  const service = new IoTOwnerRegistrationService({
    models: {
      Owner,
      Admin: { exists: async () => null },
      StaffAdmin: { exists: async () => null },
      Staff: { exists: async () => null },
      Family: { exists: async () => null },
    },
    VerificationModel: Verification,
    emailService: {
      sendPersonalOwnerVerification: async (message) =>
        sentEmails.push(message),
    },
    hashPassword: async () => "password-hash",
    mongo: {
      startSession: async () => ({
        withTransaction: async (callback) => callback(),
        endSession: async () => {},
      }),
    },
    now: () => new Date("2026-10-01T00:00:00.000Z"),
  });
  return { service, owners, verificationTokens, sentEmails };
}

test("personal registration normalizes email and requires strong password and a named residence", () => {
  const normalized = normalizeOwnerRegistration({
    ...registrationInput(),
    email: "  MARIA@Example.test ",
  });
  assert.equal(normalized.email, "maria@example.test");
  assert.throws(
    () =>
      normalizeOwnerRegistration({ ...registrationInput(), password: "short" }),
    { code: "IOT_OWNER_PASSWORD_INVALID" }
  );
  assert.throws(
    () =>
      normalizeOwnerRegistration({
        ...registrationInput(),
        residenceLabel: "",
      }),
    { code: "IOT_OWNER_RESIDENCE_INVALID" }
  );
});

test("registration creates a pending personal owner and emails only a one-time verification link", async () => {
  const harness = makeRegistrationHarness();
  await harness.service.register(registrationInput());

  assert.equal(harness.owners.length, 1);
  assert.equal(harness.owners[0].organizationId, undefined);
  assert.equal(harness.owners[0].status, "pending_verification");
  assert.equal(harness.owners[0].emailVerified, false);
  assert.equal(
    harness.owners[0].propertyDetails[0].contextType,
    "PERSONAL_RESIDENCE"
  );
  assert.equal(harness.owners[0].password, "password-hash");
  assert.equal(harness.verificationTokens.length, 1);
  assert.equal(harness.verificationTokens[0].tokenHash.length, 64);
  assert.equal(harness.sentEmails.length, 1);
  assert.ok(harness.sentEmails[0].token);
  assert.notEqual(
    harness.sentEmails[0].token,
    harness.verificationTokens[0].tokenHash
  );
});

test("registration does not enumerate existing email addresses", async () => {
  const harness = makeRegistrationHarness({ existingEmail: true });
  assert.deepEqual(await harness.service.register(registrationInput()), {
    accepted: true,
  });
  assert.equal(harness.owners.length, 0);
  assert.equal(harness.sentEmails.length, 0);
});

test("verification token hashes are one-way and deterministic", () => {
  assert.equal(
    hashVerificationToken("token-value"),
    hashVerificationToken("token-value")
  );
  assert.notEqual(hashVerificationToken("token-value"), "token-value");
});

test("verification activates only the pending owner and marks the one-time token used", async () => {
  const token = "a".repeat(64);
  let ownerUpdate;
  let savedVerification;
  class Verification {
    static findOne(filter) {
      assert.equal(filter.tokenHash, hashVerificationToken(token));
      return {
        session: async () => ({
          ownerId: "owner-pending",
          usedAt: null,
          save: async function () {
            savedVerification = this;
          },
        }),
      };
    }
  }
  const service = new IoTOwnerRegistrationService({
    models: {
      Owner: {
        updateOne: async (filter, update) => {
          ownerUpdate = { filter, update };
          return { modifiedCount: 1 };
        },
      },
    },
    VerificationModel: Verification,
    mongo: {
      startSession: async () => ({
        withTransaction: async (callback) => callback(),
        endSession: async () => {},
      }),
    },
    now: () => new Date("2026-10-01T00:00:00.000Z"),
  });

  assert.deepEqual(await service.verify(token), { verified: true });
  assert.equal(ownerUpdate.filter.status, "pending_verification");
  assert.deepEqual(ownerUpdate.update.$set, {
    status: "active",
    emailVerified: true,
  });
  assert.ok(savedVerification.usedAt);
});
