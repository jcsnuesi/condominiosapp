const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('./schedule-tools/node_modules/playwright');
const root = path.resolve(__dirname, 'aside-build');
const identity = { _id: 'preview-admin', name: 'Elena', lastname: 'Martinez', role: 'ADMIN', avatar: 'default-avatar.png', first_password_changed: true };
const access = { organization: { id: 'preview', name: 'Residencial', status: 'active' }, isOwnerAdmin: true, onboardingRequired: false, scope: { mode: 'ALL', condominiumIds: [] }, permissions: ['schedules.read', 'dashboard.read', 'condominiums.read', 'condominiums.create', 'users.read', 'staff.read', 'bookings.read', 'iot.read', 'owners.read', 'documents.read', 'str.read', 'finance.read', 'communications.read', 'maintenance.read'] };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + relative);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end(); return;
  }
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const payload = Buffer.from(JSON.stringify({ role: 'ADMIN', exp: Math.floor(Date.now()/1000)+3600 })).toString('base64url');
    await context.addCookies([{ name: 'identity', value: JSON.stringify(identity), url: base }, { name: 'token', value: `preview.${payload}.preview`, url: base }, { name: 'access_context', value: JSON.stringify(access), url: base }]);
    const page = await context.newPage();
    await page.route('**/api/**', async route => {
      const url = route.request().url();
      let data = { docs: [], total: 0, notifications: [], unreadCount: 0 };
      if (url.includes('auth/me')) data = { user: identity, access };
      if (url.includes('schedules/contexts')) data = [];
      await route.fulfill({ json: { success: true, data, message: data } });
    });
    await page.goto(`${base}/index.html#/schedule`);
    await page.getByRole('heading', { name: 'Mantenimientos', exact: true }).waitFor();
    const aside = page.getByRole('complementary');
    assert.deepEqual(await aside.locator('.layout-menuitem-root-text').allTextContents().then(labels => labels.map(label => label.trim())), ['Overview', 'Operations', 'Management']);
    const active = aside.getByRole('link', { name: 'Maintenance', exact: true });
    assert.equal(await active.getAttribute('aria-current'), 'page');
    assert.equal(await aside.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(21, 46, 54)');
    await active.focus();
    assert.equal(await active.evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
    await aside.screenshot({ path: path.join(__dirname, 'aside-desktop.png') });
    await page.getByRole('button', { name: 'Contraer menú principal', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.layout-sidebar').getBoundingClientRect().width <= 80);
    assert.equal(await active.getAttribute('title'), 'Maintenance');
    await aside.screenshot({ path: path.join(__dirname, 'aside-collapsed.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Expandir menú principal', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.layout-sidebar').getBoundingClientRect().left >= 0);
    await aside.screenshot({ path: path.join(__dirname, 'aside-mobile.png') });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.getByRole('button', { name: 'Activar modo oscuro', exact: true }).click();
    assert.equal(await aside.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(21, 46, 54)');
    console.log('PASS: grouped navigation, active route, keyboard focus, collapsed rail, mobile layout, dark mode. Mocked APIs; no production data.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
