// Run from the repository root after building frontend/dist/ocr-flow-review.
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
const root = path.resolve('frontend/dist/ocr-flow-review');
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
    const identity = { _id: 'owner-test', role: 'OWNER', name: 'OCR', lastname: 'Test', first_password_changed: true };
    const access = { permissions: ['finance.read'], scope: { mode: 'ALL', condominiumIds: [] } };
    const token = 'test.' + Buffer.from(JSON.stringify({ ...identity, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url') + '.test';
    await context.addCookies(Object.entries({ identity: JSON.stringify(identity), token, access_context: JSON.stringify(access) })
      .map(([name, value]) => ({ name, value, url: origin })));
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let receipt = { _id: 'receipt-test', invoiceId: 'invoice-test', ocrStatus: 'queued', reconciliationStatus: 'pending', fields: {}, error: 'OCR_PROCESSING_FAILED' };
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      const ok = data => route.fulfill({ json: { success: true, data, error: null } });
      if (url.pathname.endsWith('/auth/me')) return ok({ user: identity, access });
      if (url.pathname.endsWith('/payments/receipts/receipt-test')) return ok(receipt);
      if (url.pathname.endsWith('/payments/receipts')) return ok({ docs: [receipt] });
      if (url.pathname.endsWith('/monitor/options')) return ok([]);
      if (url.pathname.endsWith('/payments/providers')) return ok([]);
      return ok({ docs: [], total: 0 });
    });
    await page.goto(`${origin}/#/payment-monitor`);
    const panel = page.getByRole('region', { name: 'Transferencias bancarias' });
    await panel.getByRole('button', { name: /Factura .*OCR: queued/ }).click();
    const details = panel.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Datos del comprobante' }) });
    await details.getByText('OCR_PROCESSING_FAILED', { exact: true }).waitFor();
    receipt = { ...receipt, ocrStatus: 'ready', error: undefined, fields: { amount: '1500.00', currency: 'DOP', date: '2026-10-02', reference: '0000123', bank: 'Banco sintético' } };
    await details.getByText('1500.00 DOP', { exact: true }).waitFor();
    await details.getByText('0000123', { exact: true }).waitFor();
    await panel.getByRole('button', { name: /Factura .*OCR: ready/ }).waitFor();
    assert.equal(await details.getByRole('alert').count(), 0);
    // A manual refresh must also update an already-open ready receipt.
    receipt = { ...receipt, fields: { ...receipt.fields, amount: '1600.00' } };
    await panel.getByRole('button', { name: 'Actualizar', exact: true }).click();
    await details.getByText('1600.00 DOP', { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS: Payment Monitor refreshes queued OCR, extracted fields, errors and the open detail.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
