"use strict";
// Local browser integration with simulated account data; no live database writes.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createCallService } = require('../server');
function playwright() {
  try { return require('playwright'); } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    const root = path.join(process.env.LOCALAPPDATA, 'npm-cache', '_npx');
    for (const entry of fs.readdirSync(root)) {
      const location = path.join(root, entry, 'node_modules', 'playwright');
      if (fs.existsSync(path.join(location, 'package.json'))) return require(location);
    }
    throw error;
  }
}
function chromiumPath() {
  const root = path.join(process.env.LOCALAPPDATA, 'ms-playwright');
  return fs.readdirSync(root).filter((entry) => /^chromium-\d+$/.test(entry)).sort().reverse().map((entry) => path.join(root, entry, 'chrome-win64', 'chrome.exe')).find(fs.existsSync);
}
const build = path.resolve(__dirname, '../../frontend/dist/support-calls-review');
const artifacts = path.resolve(__dirname, '../artifacts');
const target = { condominiumId: '111111111111111111111111', staffId: 'staff', alias: 'Residencial Las Palmas' };
const history = [];
let supportConfiguration = { enabled: false, staffId: null };
let callsConfigured = true;
const tokenClaims = (token) => JSON.parse(Buffer.from(String(token).split('.')[1], 'base64url').toString());
const identity = (role) => ({ _id: role.toLowerCase(), role, name: role === 'STAFF' ? 'Atención' : 'María', lastname: 'Prueba', email: `${role.toLowerCase()}@example.test`, avatar: 'noimage.jpeg', first_password_changed: true, createdBy: 'admin', ownerId: 'owner' });
const access = { organization: { id: 'org', name: 'Piloto', status: 'active' }, permissions: ['condominiums.read', 'dashboard.read'], scope: { mode: 'SELECTED', condominiumIds: [target.condominiumId] }, isOwnerAdmin: false };
const accessFor = (role) => role === 'ADMIN' ? { ...access, permissions: [...access.permissions, 'condominiums.update'], isOwnerAdmin: true } : access;
const appToken = (role) => `${Buffer.from('{"alg":"none"}').toString('base64url')}.${Buffer.from(JSON.stringify({ role, sub: role.toLowerCase(), exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`;
function send(res, data, code = 200) { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); }
const origins = [];
const service = createCallService({
  internalToken: 'browser-test-internal-secret-32-chars', turnSecret: 'browser-test-turn-secret-32-characters', origins,
  turnUrls: ['stun:127.0.0.1:9'],
  backend: async (route, body) => {
    if (route === 'validate') {
      const role = body.token.split('|')[0];
      if (!['OWNER', 'FAMILY', 'STAFF'].includes(role)) throw new Error('unauthorized');
      return { userId: role.toLowerCase(), role, destinations: [target] };
    }
    if (route === 'authorize') {
      const role = body.residentToken.split('|')[0];
      return { organizationId: 'org', condominiumId: target.condominiumId, staffId: 'staff', residentId: role.toLowerCase(), residentRole: role, alias: target.alias, name: 'María Prueba', units: ['A1'] };
    }
    if (route === 'history') history.push(body);
    return null;
  },
  requestListener: (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      let role = 'OWNER';
      try { role = tokenClaims(req.headers.authorization).role; } catch {}
      if (url.pathname === '/api/calls/session') return send(res, { destinations: role === 'ADMIN' ? [] : [target], token: role === 'ADMIN' || !callsConfigured ? null : `${role}|${role.toLowerCase()}`, ...(!callsConfigured ? { unavailableReason: 'Servicio de llamadas no disponible.' } : {}) });
      if (url.pathname === '/api/auth/me') return send(res, { data: { user: identity(role), access: accessFor(role) } });
      if (url.pathname === '/api/notifications/inbox') return send(res, { data: { notifications: [], unreadCount: 0 } });
      if (url.pathname.startsWith('/api/buildingDetail/')) return send(res, { success: true, data: { condominium: [{ _id: target.condominiumId, alias: target.alias, typeOfProperty: 'Residencial', avatar: 'noimage.jpeg', status: 'active', units_ownerId: [], socialAreas: [], phone: '8095551111', phone2: '', mPayment: 1000, paymentDate: '2026-10-01', createdAt: '2026-01-01' }] }, error: null, code: 'OK' });
      if (url.pathname.startsWith('/api/calls/settings/')) {
        if (req.method === 'PUT') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => { supportConfiguration = JSON.parse(body); send(res, { support: supportConfiguration }); });
          return;
        }
        return send(res, { support: supportConfiguration, staff: [{ _id: 'staff', name: 'Atención', lastname: 'Prueba' }] });
      }
      return send(res, { status: 'success', message: [] });
    }
    let file = path.resolve(build, `.${url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)}`);
    if (!file.startsWith(build + path.sep)) { res.writeHead(403); res.end(); return; }
    if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' };
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  },
});
async function contextFor(browser, origin, role, viewport) {
  const context = await browser.newContext({ viewport, permissions: ['microphone'] });
  await context.addCookies([
    { name: 'identity', value: JSON.stringify(identity(role)), url: origin },
    { name: 'token', value: appToken(role), url: origin },
    { name: 'access_context', value: JSON.stringify(accessFor(role)), url: origin },
  ]);
  await context.addInitScript(() => {
    window.callTestPeers = [];
    window.callTestStreams = [];
    const Original = window.RTCPeerConnection;
    window.RTCPeerConnection = class extends Original {
      constructor(configuration) { super(configuration); window.callTestPeers.push(this); }
    };
    const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (constraints) => {
      const stream = await getUserMedia(constraints);
      window.callTestStreams.push(stream);
      return stream;
    };
  });
  const page = await context.newPage();
  await page.goto(`${origin}/#/see-property`, { waitUntil: 'domcontentloaded' });
  await page.locator('app-support-call').waitFor({ state: 'attached' });
  return { context, page };
}
async function main() {
  fs.mkdirSync(artifacts, { recursive: true });
  await service.listen(0, '127.0.0.1');
  const origin = `http://127.0.0.1:${service.http.address().port}`;
  origins.push(origin);
  const { chromium } = playwright();
  const browser = await chromium.launch({ headless: true, executablePath: chromiumPath(), args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  try {
    const staff = await contextFor(browser, origin, 'STAFF', { width: 1280, height: 900 });
    const resident = await contextFor(browser, origin, 'OWNER', { width: 390, height: 844 });
    const family = await contextFor(browser, origin, 'FAMILY', { width: 390, height: 844 });
    await staff.page.getByRole('button', { name: 'Atención: disponibilidad para llamadas' }).click();
    await staff.page.getByRole('button', { name: 'Disponible para llamadas', exact: true }).click();
    await staff.page.getByRole('button', { name: 'Dejar de recibir llamadas' }).waitFor();
    await resident.page.getByRole('button', { name: 'Llamar a atención', exact: true }).click();
    await resident.page.getByRole('button', { name: 'Llamar', exact: true }).waitFor();
    await resident.page.waitForFunction(() => ![...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Llamar')?.disabled);
    await resident.page.screenshot({ path: path.join(artifacts, 'owner-destinations-mobile.png'), fullPage: true, animations: 'disabled' });
    await resident.page.getByRole('button', { name: 'Llamar', exact: true }).click();
    await staff.page.getByRole('button', { name: 'Aceptar', exact: true }).waitFor();
    await staff.page.getByText('María Prueba · OWNER', { exact: true }).waitFor();
    await staff.page.screenshot({ path: path.join(artifacts, 'staff-incoming-desktop.png'), fullPage: true, animations: 'disabled' });
    await family.page.getByRole('button', { name: 'Llamar a atención', exact: true }).click();
    await family.page.getByText('Ocupado', { exact: true }).waitFor();
    assert.equal(await family.page.getByRole('button', { name: 'Llamar', exact: true }).isDisabled(), true);
    await staff.page.getByRole('button', { name: 'Aceptar', exact: true }).click();
    await resident.page.getByRole('button', { name: 'Silenciar', exact: true }).waitFor({ timeout: 25000 });
    await staff.page.getByRole('button', { name: 'Silenciar', exact: true }).waitFor({ timeout: 25000 });
    for (const page of [resident.page, staff.page]) {
      await page.waitForFunction(async () => {
        const peer = window.callTestPeers.at(-1);
        const stats = await peer.getStats();
        return [...stats.values()].some((entry) => entry.type === 'inbound-rtp' && entry.kind === 'audio' && entry.packetsReceived > 0);
      }, null, { timeout: 20000 });
    }
    await resident.page.screenshot({ path: path.join(artifacts, 'owner-active-mobile.png'), fullPage: true, animations: 'disabled' });
    await resident.page.getByRole('button', { name: 'Silenciar', exact: true }).click();
    assert.equal(await resident.page.evaluate(() => window.callTestStreams.at(-1).getAudioTracks()[0].enabled), false);
    await resident.page.getByRole('button', { name: 'Activar micrófono', exact: true }).click();
    await resident.page.evaluate(() => { location.hash = '/family-area/owner'; });
    await resident.page.getByRole('button', { name: 'Colgar', exact: true }).waitFor();
    assert.equal(await resident.page.evaluate(() => window.callTestPeers.at(-1).connectionState), 'connected');
    await resident.page.getByRole('button', { name: 'Colgar', exact: true }).click();
    await staff.page.getByText('Llamada finalizada.', { exact: true }).waitFor();
    for (const page of [resident.page, staff.page]) assert.equal(await page.evaluate(() => window.callTestStreams.every((stream) => stream.getTracks().every((track) => track.readyState === 'ended'))), true);
    await family.page.waitForFunction(() => ![...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Llamar')?.disabled);
    await family.page.getByRole('button', { name: 'Llamar', exact: true }).click();
    await staff.page.getByText('María Prueba · FAMILY', { exact: true }).waitFor();
    await staff.page.getByRole('button', { name: 'Rechazar', exact: true }).click();
    await family.page.getByText('Atención rechazó la llamada.', { exact: true }).waitFor();
    await family.page.evaluate(() => {
      navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Permission denied', 'NotAllowedError'); };
    });
    await family.page.getByRole('button', { name: 'Llamar', exact: true }).click();
    await family.page.getByText('Permite el micrófono y abre la app con HTTPS para llamar.', { exact: true }).waitFor();
    assert.equal(service.engine.calls.size, 0);
    assert.ok(history.some((entry) => entry.result === 'active'));
    const admin = await contextFor(browser, origin, 'ADMIN', { width: 1280, height: 900 });
    await admin.page.goto(`${origin}/#/home/${target.condominiumId}`, { waitUntil: 'domcontentloaded' });
    await admin.page.getByRole('button', { name: 'Settings', exact: true }).click();
    await admin.page.getByLabel('Tiene garita o recepción', { exact: true }).check();
    await admin.page.waitForFunction(() => [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Guardar atención')?.disabled === true);
    await admin.page.getByLabel('STAFF responsable de atención', { exact: true }).selectOption({ label: 'Atención Prueba' });
    await admin.page.getByRole('button', { name: 'Guardar atención', exact: true }).click();
    await admin.page.getByText('Configuración de atención guardada.', { exact: true }).waitFor();
    assert.deepEqual(supportConfiguration, { enabled: true, staffId: 'staff' });
    await admin.page.screenshot({ path: path.join(artifacts, 'admin-support-settings.png'), fullPage: true, animations: 'disabled' });
    callsConfigured = false;
    const unavailable = await contextFor(browser, origin, 'OWNER', { width: 390, height: 844 });
    await unavailable.page.getByRole('button', { name: 'Llamar a atención', exact: true }).click();
    await unavailable.page.getByText('Servicio de llamadas no disponible.', { exact: true }).waitFor();
    assert.equal(await unavailable.page.getByRole('button', { name: 'Llamar', exact: true }).isDisabled(), true);
    await unavailable.page.screenshot({ path: path.join(artifacts, 'owner-service-unavailable-mobile.png'), fullPage: true, animations: 'disabled' });
    console.log(JSON.stringify({ result: 'passed', scenarios: ['mobile access', 'STAFF availability', 'incoming caller and unit', 'busy STAFF', 'bidirectional audio RTP', 'mute', 'navigation', 'microphone cleanup', 'FAMILY rejection', 'microphone denied', 'administrator configuration', 'mobile entry with unconfigured call service'], artifacts }));
  } finally { await browser.close(); await service.close(); }
}
main().catch(async (error) => { console.error(error); await service.close().catch(() => {}); process.exitCode = 1; });
