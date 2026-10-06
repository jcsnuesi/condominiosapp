"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { AdminRegistrationService, normalizeAdminRegistration } = require("../service/adminRegistrationService");
const { hashVerificationToken } = require("../service/iotOwnerRegistrationService");
const { resolveAccessContext, publicAccessContext } = require("../service/authorization");
const { createRegistrationRateLimit } = require("../middleware/registrationRateLimit");

const input = () => ({ name: "María", lastname: "Santos", email: "MARIA@example.test", phone: "+18095550123",
  password: "una-frase-larga-segura", company: "Administración Jardines", street_1: "Calle Jardines 12",
  city: "Santo Domingo", state: "Distrito Nacional", country: "República Dominicana", terms: true });

function harness({ exists = false, expired = false, mailFails = false, policyFails = false } = {}) {
  let pending;
  const created = { organizations: [], admins: [], policies: [], audits: [] };
  const emails = [];
  const welcomes = [];
  const session = {};
  const account = { exists: () => ({ then: resolve => resolve(exists ? {} : null), session: async supplied => { assert.equal(supplied, session); return exists ? {} : null; } }) };
  const create = key => ({ create: async (docs, options) => {
    assert.equal(options.session, session);
    if (key === 'policies' && policyFails) throw new Error('policy failure');
    created[key].push(...docs); return docs;
  } });
  const service = new AdminRegistrationService({
    Registration: {
      findOneAndUpdate: async (filter, update) => {
        if ('usedAt' in filter && (!pending || pending.usedAt)) return null;
        const values = { ...pending, ...update.$set };
        const address = values.address;
        pending = { ...values, address: { ...address, toObject: () => address }, save: async () => {} };
        return pending;
      },
      findOne: filter => ({ select: () => ({ session: async () => expired || !pending || pending.usedAt || filter.tokenHash !== pending.tokenHash ? null : pending }) }),
      deleteOne: async () => { pending = null; },
    },
    Organization: create('organizations'), Admin: create('admins'), Policy: create('policies'), Audit: create('audits'),
    accounts: [account], emailService: {
      sendAdminVerification: async message => { if (mailFails) throw new Error('smtp'); emails.push(message); },
      sendWelcome: async message => { assert.equal(created.admins.length, 1); welcomes.push(message); },
    },
    hashPassword: async () => 'hashed-password', now: () => new Date('2026-10-04T12:00:00Z'),
    mongo: { Types: mongoose.Types, connection: { transaction: async callback => {
      const snapshot = Object.fromEntries(Object.entries(created).map(([key, docs]) => [key, [...docs]]));
      try { return await callback(session); } catch (error) { Object.assign(created, snapshot); throw error; }
    } } },
  });
  return { service, created, emails, welcomes, pending: () => pending };
}

test('ADMIN registration normalizes email, requires terms and rejects missing organization data', () => {
  assert.equal(normalizeAdminRegistration(input()).email, 'maria@example.test');
  for (const change of [{ terms: false }, { company: '' }, { city: '' }, { phone: 'bad' }, { email: {} }, { password: 'short' }]) {
    assert.throws(() => normalizeAdminRegistration({ ...input(), ...change }));
  }
});

test('ADMIN registration stores only a hash and creates no tenant before email verification', async () => {
  const h = harness(); await h.service.register({ ...input(), role: 'SUPERUSER', organizationId: 'forged' });
  assert.equal(h.created.organizations.length, 0);
  assert.equal(h.pending().passwordHash, 'hashed-password');
  assert.equal(h.pending().password, undefined);
  assert.equal(h.pending().role, undefined);
  assert.equal(h.pending().tokenHash, hashVerificationToken(h.emails[0].token));
});

test('ADMIN verification atomically creates its own organization, policies and audit without a supervisor', async () => {
  const h = harness(); await h.service.register(input()); await h.service.verify(h.emails[0].token);
  const org = h.created.organizations[0]; const admin = h.created.admins[0];
  assert.equal(admin.role, 'ADMIN'); assert.equal(admin.verified, true);
  assert.equal(admin.organizationId, org._id); assert.equal(org.ownerAdminId, admin._id);
  assert.equal(org.registrationSource, 'SELF_SERVICE'); assert.equal(org.provisionedBy, admin._id);
  assert.ok(h.created.policies.length > 0); assert.equal(h.created.audits[0].actorId, admin._id);
  assert.deepEqual(h.welcomes, [{ email: 'maria@example.test', name: input().name }]);
  await assert.rejects(h.service.verify(h.emails[0].token), { code: 'ADMIN_VERIFICATION_INVALID' });
  assert.equal(h.welcomes.length, 1);
});

test('expired ADMIN verification and transaction failures leave no partially created tenant', async () => {
  for (const option of [{ expired: true }, { policyFails: true }]) {
    const h = harness(option); await h.service.register(input());
    await assert.rejects(h.service.verify(h.emails[0].token));
    assert.equal(h.created.organizations.length, 0); assert.equal(h.created.admins.length, 0);
    assert.equal(h.pending().usedAt, null);
    assert.equal(h.welcomes.length, 0);
  }
});

test('registration uses a generic response for existing accounts and cleans up failed mail delivery', async () => {
  const existing = harness({ exists: true });
  assert.deepEqual(await existing.service.register(input()), { accepted: true });
  assert.equal(existing.emails.length, 0);
  const failed = harness({ mailFails: true });
  await assert.rejects(failed.service.register(input()), { code: 'ADMIN_VERIFICATION_UNAVAILABLE' });
  assert.equal(failed.pending(), null);
});

test('a replacement registration invalidates the previous ADMIN verification link', async () => {
  const h = harness(); await h.service.register(input()); const old = h.emails[0].token;
  await h.service.register(input());
  await assert.rejects(h.service.verify(old), { code: 'ADMIN_VERIFICATION_INVALID' });
  await h.service.verify(h.emails[1].token);
});

test('SUPERUSER authentication context is rejected, including previously issued tokens', async () => {
  assert.equal(await resolveAccessContext({ role: 'SUPERUSER', sub: 'legacy-id' }), null);
});

test('retired supervisor tokens cannot use auxiliary email registration middleware', () => {
  const jwt = require('jsonwebtoken');
  const { getJwtSecret, algorithm } = require('../service/jwt');
  const auth = require('../middleware/auth');
  const token = jwt.sign({ sub: 'legacy', role: 'SUPERUSER', exp: Math.floor(Date.now() / 1000) + 1000 }, getJwtSecret(), { algorithm });
  const res = { status(code) { this.code = code; return this; }, send() {} };
  let passed = false;
  auth.emailOwnerRegistration({ headers: { authorization: token } }, res, () => { passed = true; });
  assert.equal(passed, false); assert.equal(res.code, 401);
});

test('only a self-service organization owner with incomplete onboarding is redirected to setup', () => {
  const context = { permissions: [], scope: {}, isOwnerAdmin: true, organization: { _id: 'org', registrationSource: 'SELF_SERVICE' } };
  assert.equal(publicAccessContext(context).onboardingRequired, true);
  assert.equal(publicAccessContext({ ...context, isOwnerAdmin: false }).onboardingRequired, false);
  assert.equal(publicAccessContext({ ...context, organization: { ...context.organization, onboardingCompletedAt: new Date() } }).onboardingRequired, false);
  assert.equal(publicAccessContext({ ...context, organization: { _id: 'legacy-org' } }).onboardingRequired, false);
});

test('public registration throttles repeated attempts and permits retries after the window', () => {
  let time = 0; let passed = 0;
  const middleware = createRegistrationRateLimit({ limit: 2, windowMs: 1000, now: () => time });
  const res = { status(code) { this.code = code; return this; }, set() {}, send() {} };
  for (let i = 0; i < 3; i++) middleware({ ip: 'test-ip' }, res, () => passed++);
  assert.equal(passed, 2); assert.equal(res.code, 429);
  time = 1001; middleware({ ip: 'test-ip' }, res, () => passed++); assert.equal(passed, 3);
});

test('ADMIN resend rotates the pending token and does not revive an already verified account', async () => {
  const h = harness(); await h.service.register(input()); const old = h.emails[0].token;
  await h.service.resend(input().email);
  await assert.rejects(h.service.verify(old), { code: 'ADMIN_VERIFICATION_INVALID' });
  await h.service.verify(h.emails[1].token);
  const count = h.emails.length; await h.service.resend(input().email);
  assert.equal(h.emails.length, count);
  const empty = harness(); await empty.service.resend('unknown@example.test'); assert.equal(empty.emails.length, 0);
});

test('self-service verification creates documents valid against the real Mongoose schemas', async () => {
  const h = harness(); await h.service.register(input()); await h.service.verify(h.emails[0].token);
  for (const [key, Model] of [
    ['organizations', require('../models/organization')], ['admins', require('../models/admin')],
    ['policies', require('../models/accessPolicy')], ['audits', require('../models/authorizationAudit')],
  ]) for (const document of h.created[key]) assert.equal(new Model(document).validateSync(), undefined);
});

test('public ADMIN registration routes require no supervisor and tenant onboarding requires owner-admin access', () => {
  const router = require('../routes/organization');
  assert.deepEqual(router.stack.map(layer => layer.route.path), [
    '/auth/admin/register', '/auth/admin/resend-verification', '/auth/admin/verify/:token',
    '/organization/onboarding', '/organization/onboarding/complete',
  ]);
  const { authenticated } = require('../middleware/auth');
  const { requireOwnerAdmin } = require('../middleware/organizationAuth');
  for (const layer of router.stack.filter(layer => layer.route.path.startsWith('/organization'))) {
    assert.equal(layer.route.stack[0].handle, authenticated);
    assert.equal(layer.route.stack[1].handle, requireOwnerAdmin);
  }
  const users = require('../routes/users');
  for (const layer of users.stack) assert.ok(!['/createAccount', '/admins', '/inactive-account', '/reactiveAccount', '/update-account'].includes(layer.route.path));
});
