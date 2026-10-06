"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("../../backend/node_modules/express");
const jwt = require("../../backend/node_modules/jsonwebtoken");
const { getJwtSecret } = require("../../backend/service/jwt");
const Owner = require("../../backend/models/owners");
const Family = require("../../backend/models/family");
const Staff = require("../../backend/models/staff");
const Admin = require("../../backend/models/admin");
const Organization = require("../../backend/models/organization");
const AccessGrant = require("../../backend/models/accessGrant");
const Condominium = require("../../backend/models/condominio");
const { parseSupport } = require("../../backend/service/residentSupport");
const ids = { condo: "111111111111111111111111", other: "222222222222222222222222", org: "333333333333333333333333", resident: "444444444444444444444444", staff: "555555555555555555555555", family: "666666666666666666666666", admin: "777777777777777777777777" };
process.env.CALL_TOKEN_SECRET = "call-test-credential-secret-32-characters";
process.env.CALL_INTERNAL_TOKEN = "call-test-internal-secret-32-characters";
let condo, resident, family, staff, base, server;
const patches = [];
function query(value) { return { select() { return this; }, lean: async () => value }; }
function patch(model, key, method) { patches.push([model, key, model[key]]); model[key] = method; }
function matches(document, filter) {
  return Object.entries(filter).every(([key, value]) => {
    const actual = key.split('.').reduce((entry, part) => entry?.[part], document);
    if (value?.$in) return value.$in.map(String).includes(String(actual));
    return String(actual) === String(value);
  });
}
function credential(sub, role, overrides = {}) {
  return jwt.sign({ sub, role, ...overrides }, process.env.CALL_TOKEN_SECRET, { audience: "call-service", issuer: "condapp", ...('exp' in overrides ? {} : { expiresIn: "5m" }) });
}
function appToken(sub, role) { return jwt.sign({ sub, role }, getJwtSecret(), { expiresIn: "1h" }); }
async function request(path, body, token, method = 'POST', internal = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (internal) headers['X-Call-Internal-Token'] = process.env.CALL_INTERNAL_TOKEN;
  if (token) headers.Authorization = token;
  const response = await fetch(`${base}/api/calls/${path}`, { method, headers, body: method === 'GET' ? undefined : JSON.stringify(body) });
  return { status: response.status, body: await response.json().catch(() => null) };
}
test.before(async () => {
  patch(Owner, 'findById', () => query(resident));
  patch(Owner, 'findOne', (filter) => query(matches(resident, filter) ? resident : null));
  patch(Family, 'findById', () => query(family));
  patch(Staff, 'findById', () => query(staff));
  patch(Admin, 'findById', () => query({ _id: ids.admin, role: 'ADMIN', organizationId: ids.org, status: 'active' }));
  patch(Organization, 'findOne', () => query({ _id: ids.org, status: 'active', ownerAdminId: ids.admin }));
  patch(AccessGrant, 'findOne', () => ({ populate() { return this; }, lean: async () => null }));
  patch(Condominium, 'find', (filter) => query(matches(condo, filter) ? [condo] : []));
  patch(Condominium, 'findOne', (filter) => query(matches(condo, filter) ? condo : null));
  patch(Condominium, 'findOneAndUpdate', async (filter, update) => {
    if (!matches(condo, filter)) return null;
    condo.residentSupport = update.$set.residentSupport;
    return condo;
  });
  patch(Staff, 'exists', async (filter) => matches(staff, filter) ? { _id: staff._id } : null);
  patch(Staff, 'find', (filter) => query(matches(staff, filter) ? [staff] : []));
  const app = express();
  app.use(express.json());
  app.use('/api', require('../../backend/routes/calls'));
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.beforeEach(() => {
  condo = { _id: ids.condo, organizationId: ids.org, status: 'active', alias: 'Condominio', residentSupport: { enabled: true, staffId: ids.staff } };
  resident = { _id: ids.resident, organizationId: ids.org, role: 'OWNER', status: 'active', name: 'Residente', lastname: 'Prueba', propertyDetails: [{ addressId: ids.condo, condominium_unit: 'A1', status_property: 'active' }] };
  family = { _id: ids.family, organizationId: ids.org, role: 'FAMILY', status: 'active', name: 'Familiar', lastname: 'Prueba', createdBy: ids.resident, propertyDetails: [{ addressId: ids.condo, unit: 'A1', family_status: 'authorized' }] };
  staff = { _id: ids.staff, organizationId: ids.org, role: 'STAFF', status: 'active', condo_id: ids.condo, name: 'Atención', lastname: 'Prueba' };
});
test.after(async () => {
  for (const [model, key, original] of patches.reverse()) model[key] = original;
  await new Promise((resolve) => server.close(resolve));
});
test('support schema requires a responsible STAFF when enabled', () => {
  assert.deepEqual(parseSupport('{"enabled":false}'), { enabled: false, staffId: null });
  assert.throws(() => parseSupport({ enabled: true }), { statusCode: 400 });
  assert.throws(() => parseSupport({ enabled: 'false' }), { statusCode: 400 });
});
test('session only returns authorized condos and a scoped short-lived credential', async () => {
  const response = await request('session', null, appToken(ids.resident, 'OWNER'), 'GET', false);
  assert.equal(response.status, 200);
  assert.equal(response.body.destinations.length, 1);
  const claims = jwt.verify(response.body.token, process.env.CALL_TOKEN_SECRET, { audience: 'call-service', issuer: 'condapp' });
  assert.equal(claims.sub, ids.resident);
  assert.equal(claims.exp - claims.iat, 300);
});
test('internal endpoint refuses requests without service authentication', async () => {
  const response = await request('internal/validate', { token: credential(ids.resident, 'OWNER') }, null, 'POST', false);
  assert.equal(response.status, 403);
});
test('authorization checks both resident and assigned STAFF and derives unit server-side', async () => {
  const body = { condominiumId: ids.condo, residentToken: credential(ids.resident, 'OWNER'), staffToken: credential(ids.staff, 'STAFF'), staffId: ids.other, units: ['unauthorized'] };
  const response = await request('internal/authorize', body);
  assert.equal(response.status, 200);
  assert.equal(response.body.staffId, ids.staff);
  assert.deepEqual(response.body.units, ['A1']);
});
test('FAMILY displays its authorized unit and loses access when owner association is inactive', async () => {
  const body = { condominiumId: ids.condo, residentToken: credential(ids.family, 'FAMILY') };
  assert.deepEqual((await request('internal/authorize', body)).body.units, ['A1']);
  resident.propertyDetails[0].status_property = 'inactive';
  assert.equal((await request('internal/authorize', body)).status, 403);
});
test('FAMILY without property authorization cannot call', async () => {
  family.propertyDetails[0].family_status = 'inactive';
  assert.equal((await request('internal/authorize', { condominiumId: ids.condo, residentToken: credential(ids.family, 'FAMILY') })).status, 403);
});
test('cross-condominium, disabled service, wrong organization and inactive STAFF fail closed', async () => {
  const body = { condominiumId: ids.other, residentToken: credential(ids.resident, 'OWNER') };
  assert.equal((await request('internal/authorize', body)).status, 403);
  body.condominiumId = ids.condo;
  condo.residentSupport.enabled = false;
  assert.equal((await request('internal/authorize', body)).status, 403);
  condo.residentSupport.enabled = true;
  staff.organizationId = ids.other;
  assert.equal((await request('internal/authorize', body)).status, 403);
  staff.organizationId = ids.org;
  staff.status = 'inactive';
  assert.equal((await request('internal/authorize', body)).status, 403);
});
test('expired and wrong-audience credentials are rejected', async () => {
  const expired = credential(ids.resident, 'OWNER', { exp: 1 });
  assert.equal((await request('internal/validate', { token: expired })).status, 403);
  const wrong = jwt.sign({ sub: ids.resident, role: 'OWNER' }, process.env.CALL_TOKEN_SECRET, { audience: 'other', issuer: 'condapp' });
  assert.equal((await request('internal/validate', { token: wrong })).status, 403);
});
test('resident cannot edit configuration; administrator can assign only local active STAFF', async () => {
  assert.equal((await request(`settings/${ids.condo}`, { enabled: true, staffId: ids.staff }, appToken(ids.resident, 'OWNER'), 'PUT', false)).status, 403);
  staff.condo_id = ids.other;
  assert.equal((await request(`settings/${ids.condo}`, { enabled: true, staffId: ids.staff }, appToken(ids.admin, 'ADMIN'), 'PUT', false)).status, 400);
  staff.condo_id = ids.condo;
  const saved = await request(`settings/${ids.condo}`, { enabled: true, staffId: ids.staff }, appToken(ids.admin, 'ADMIN'), 'PUT', false);
  assert.equal(saved.status, 200);
  assert.equal(saved.body.support.staffId, ids.staff);
});
test('assigned STAFF can establish a session without condominium management permissions', async () => {
  const response = await request('session', null, appToken(ids.staff, 'STAFF'), 'GET', false);
  assert.equal(response.status, 200);
  assert.equal(response.body.destinations[0].staffId, ids.staff);
});
