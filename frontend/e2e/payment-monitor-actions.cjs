const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

function playwright() {
  if (process.env.PLAYWRIGHT_MODULE) return require(process.env.PLAYWRIGHT_MODULE);
  try { return require('playwright'); } catch {
    const cache = path.join(process.env.LOCALAPPDATA, 'npm-cache', '_npx');
    const module = fs.readdirSync(cache).map(dir => path.join(cache, dir, 'node_modules', 'playwright'))
      .find(dir => fs.existsSync(path.join(dir, 'package.json')));
    return require(module);
  }
}

const root = path.resolve('frontend/dist/payment-monitor-actions-review');
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
  res.end(fs.readFileSync(file));
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await playwright().chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext();
    const identity = { _id: 'owner-test', role: 'OWNER', name: 'Ana', lastname: 'Perez', first_password_changed: true };
    const access = { permissions: ['finance.read'], scope: { mode: 'ALL', condominiumIds: [] } };
    const token = 'test.' + Buffer.from(JSON.stringify({ ...identity, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url') + '.test';
    await context.addCookies(Object.entries({ identity: JSON.stringify(identity), token, access_context: JSON.stringify(access) })
      .map(([name, value]) => ({ name, value, url: origin })));
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = { ownerId: 'owner-test', ownerName: 'Ana Perez', ownerPhone: '8090000001', ownerEmail: 'ana@example.test',
      condominiumId: 'condo-test', condominiumAlias: 'Residencial Test', unitNumber: '002',
      issueDate: '2026-10-02T04:00:00Z', dueDate: '2026-11-02T04:00:00Z', currency: 'DOP', amount: 600,
      invoiceAmount: 1000, reconciliationStatus: 'not_started' };
    const rows = [
      { ...base, _id: 'pending', invoiceId: 'invoice-pending', status: 'pending', invoicePaymentStatus: 'pending', rowType: 'invoice' },
      { ...base, _id: 'paid', invoiceId: 'invoice-paid', status: 'succeeded', invoicePaymentStatus: 'completed', rowType: 'transaction', reconciliationStatus: 'matched' },
      { ...base, _id: 'partial', invoiceId: 'invoice-partial', status: 'succeeded', invoicePaymentStatus: 'pending', rowType: 'transaction' },
    ];
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      const ok = data => route.fulfill({ json: { success: true, data, error: null } });
      if (url.pathname.endsWith('/auth/me')) return ok({ user: identity, access });
      if (url.pathname.endsWith('/monitor/options')) return ok([{ label: 'Residencial Test', value: 'condo-test', units: ['002'] }]);
      if (url.pathname.endsWith('/payments/providers')) return ok([]);
      if (url.pathname.endsWith('/monitor/invoices')) {
        const docs = rows.filter(row => (!url.searchParams.get('status') || row.status === url.searchParams.get('status'))
          && (!url.searchParams.get('reconciliationStatus') || row.reconciliationStatus === url.searchParams.get('reconciliationStatus')));
        return ok({ docs, total: docs.length, page: 1, limit: 20 });
      }
      return ok({ docs: [], total: 0 });
    });
    await page.goto(`${origin}/#/payment-monitor`);
    const panel = page.getByRole('region', { name: 'Payment transactions', exact: true });
    await panel.getByRole('button', { name: 'Table', exact: true }).click();
    const pending = panel.getByRole('row').filter({ hasText: 'invoice-pending' });
    await pending.getByRole('cell', { name: 'Ana Perez', exact: true }).waitFor();
    assert.equal(await pending.getByRole('button', { name: /Download paid invoice/ }).count(), 0);
    assert.equal(await panel.getByRole('row').filter({ hasText: 'invoice-partial' }).getByRole('button', { name: /Download paid invoice/ }).count(), 0);
    const tagColor = await pending.getByText('pending', { exact: true }).evaluate(tag => {
      const style = getComputedStyle(tag.closest('.p-tag'));
      return { color: style.color, background: style.backgroundColor };
    });
    assert.deepEqual(tagColor, { color: 'rgb(133, 85, 0)', background: 'rgb(255, 243, 205)' });
    const downloadPromise = page.waitForEvent('download');
    await panel.getByRole('button', { name: 'Download paid invoice PDF invoice-paid', exact: true }).click();
    const download = await downloadPromise;
    assert.equal(await download.failure(), null);
    assert.equal(download.suggestedFilename(), 'invoice_Residencial Test.pdf');
    const bytes = fs.readFileSync(await download.path());
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    const filters = page.getByRole('region', { name: 'Payment filters', exact: true });
    await Promise.all([
      page.waitForRequest(request => request.url().includes('/monitor/invoices?') && new URL(request.url()).searchParams.get('status') === 'pending'),
      (async () => {
        await filters.getByRole('combobox', { name: 'Status', exact: true }).click();
        await page.getByRole('option', { name: 'pending', exact: true }).click();
      })(),
    ]);
    await panel.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await Promise.all([
      page.waitForRequest(request => request.url().includes('/monitor/invoices?') && new URL(request.url()).searchParams.get('reconciliationStatus') === 'matched'),
      (async () => {
        await filters.getByRole('combobox', { name: 'Reconciliation', exact: true }).click();
        await page.getByRole('option', { name: 'matched', exact: true }).click();
      })(),
    ]);
    await panel.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await Promise.all([
      page.waitForRequest(request => request.url().includes('/monitor/invoices?') && new URL(request.url()).searchParams.get('condominiumId') === 'condo-test'),
      (async () => {
        await filters.getByRole('combobox', { name: 'Property', exact: true }).click({ timeout: 5000 });
        await page.getByRole('option', { name: 'Residencial Test', exact: true }).and(page.locator('li')).click();
      })(),
    ]);
    await panel.getByRole('button', { name: 'Cards', exact: true }).click();
    const paidCard = panel.getByRole('article').filter({ has: page.getByRole('heading', { name: 'invoice-paid', exact: true }) });
    await paidCard.getByText('Ana Perez', { exact: true }).waitFor();
    await paidCard.getByRole('button', { name: 'Download paid invoice PDF invoice-paid', exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS: registered owner, amber pending tag, paid invoice PDF, partial payment exclusion, cards and automatic filters.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
