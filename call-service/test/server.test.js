"use strict";
const test = require('node:test');
const assert = require('node:assert/strict');
const { createHmac } = require('node:crypto');
const { io } = require('../../backend/node_modules/socket.io-client');
const { createCallService } = require('../server');
const turnSecret = 'socket-test-turn-secret-32-characters';
async function fixture(t) {
  const history = [];
  const target = { condominiumId: 'condo', staffId: 'staff', alias: 'Condominio' };
  const service = createCallService({ internalToken: 'socket-test-internal-secret-32-chars', turnSecret, origins: ['http://allowed.test'], turnUrls: ['turn:turn.example.test:3478'], backend: async (route, body) => {
    if (route === 'validate') {
      const role = body.token;
      if (!['OWNER', 'STAFF', 'FAMILY'].includes(role)) throw new Error('unauthorized');
      return { userId: role.toLowerCase(), role, destinations: [target] };
    }
    if (route === 'authorize') return { residentId: body.residentToken.toLowerCase(), residentRole: body.residentToken, staffId: 'staff', condominiumId: 'condo', organizationId: 'org', alias: 'Condominio', name: 'Residente', units: ['A1'] };
    if (route === 'history') history.push(body);
    return null;
  } });
  await service.listen(0, '127.0.0.1');
  const url = `http://127.0.0.1:${service.http.address().port}`;
  const clients = [];
  t.after(async () => { clients.forEach((client) => client.disconnect()); await service.close(); });
  async function connect(role, origin) {
    const socket = io(url, { path: '/calls/socket.io/', auth: { token: role }, transports: ['websocket'], reconnection: false, autoConnect: false, ...(origin ? { extraHeaders: { Origin: origin } } : {}) });
    clients.push(socket);
    const result = new Promise((resolve, reject) => { socket.once('connect', () => resolve(socket)); socket.once('connect_error', reject); });
    socket.connect();
    return result;
  }
  return { service, url, connect, history };
}
const request = (socket, event, data) => socket.timeout(2000).emitWithAck(event, data);
test('real socket endpoint authenticates clients and rejects foreign origins', async (t) => {
  const { connect, url } = await fixture(t);
  assert.equal((await fetch(`${url}/health`)).status, 200);
  await assert.rejects(connect('invalid', 'http://allowed.test'));
  await assert.rejects(connect('OWNER', 'http://foreign.test'));
  const resident = await connect('OWNER', 'http://allowed.test');
  assert.equal(resident.connected, true);
  const cannotServe = await request(resident, 'calls:availability', { available: true });
  assert.equal(cannotServe.ok, false);
});
test('socket protocol restricts TURN credentials and relays audio signaling only to accepted participants', async (t) => {
  const { connect, service } = await fixture(t);
  const resident = await connect('OWNER');
  const staff = await connect('STAFF');
  const outsider = await connect('FAMILY');
  assert.equal((await request(staff, 'calls:availability', { available: true })).ok, true);
  const { callId } = await request(resident, 'calls:start', { condominiumId: 'condo' });
  assert.ok(callId);
  assert.equal((await request(outsider, 'calls:ice', { callId })).ok, false);
  assert.equal((await request(resident, 'calls:ice', { callId })).ok, false);
  assert.equal((await request(staff, 'calls:accept', { callId })).ok, true);
  const ice = await request(resident, 'calls:ice', { callId });
  const server = ice.iceServers[0];
  assert.equal(server.credential, createHmac('sha1', turnSecret).update(server.username).digest('base64'));
  assert.ok(Number(server.username.split(':')[0]) > Date.now() / 1000);
  const received = new Promise((resolve) => staff.once('calls:signal', resolve));
  await request(resident, 'calls:signal', { callId, description: { type: 'offer', sdp: 'test offer' } });
  assert.equal((await received).description.sdp, 'test offer');
  assert.equal((await request(outsider, 'calls:signal', { callId, candidate: { candidate: 'test' } })).ok, false);
  await request(resident, 'calls:connected', { callId });
  await request(staff, 'calls:connected', { callId });
  assert.equal(service.engine.calls.get(callId).state, 'active');
  const call = service.engine.calls.get(callId);
  await request(resident, 'calls:end', { callId });
  await call.historyChain;
  assert.equal(service.engine.calls.size, 0);
});
test('service restart closes active calls and persists final metadata', async (t) => {
  const { service, connect, history } = await fixture(t);
  const resident = await connect('OWNER');
  const staff = await connect('STAFF');
  await request(staff, 'calls:availability', { available: true });
  const { callId } = await request(resident, 'calls:start', { condominiumId: 'condo' });
  await request(staff, 'calls:accept', { callId });
  await service.close();
  assert.equal(service.engine.calls.size, 0);
  assert.equal(history.at(-1).result, 'service_restart');
  assert.ok(history.at(-1).endedAt);
});
