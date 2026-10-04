// Chrome UI regression with an isolated OWNER and mocked API. Backend concurrency
// and access control are covered by bank-reconciliation.integration.test.js.
// Build frontend/dist/invoice-voucher-review before running this file.
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
const root = path.resolve('frontend/dist/invoice-voucher-review');
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(4321, '127.0.0.1', resolve));
  const browser = await playwright().chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
    const identity = { _id: 'owner-test', role: 'OWNER', name: 'Voucher', lastname: 'Test', first_password_changed: true };
    const access = { permissions: ['finance.read'], scope: { mode: 'ALL', condominiumIds: [] } };
    const token = 'test.' + Buffer.from(JSON.stringify({ ...identity, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url') + '.test';
    await context.addCookies(Object.entries({ identity: JSON.stringify(identity), token, access_context: JSON.stringify(access) })
      .map(([name, value]) => ({ name, value, url: 'http://127.0.0.1:4321' })));
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let receipts = [], posts = 0, deletes = 0, accounts = true, multiple = false, fail = false, deleteFail = false;
    const invoice = { _id: 'invoice-test', ownerId: { ...identity, propertyDetails: [{ addressId: 'condo-test', condominium_unit: 'A1' }] }, condominiumId: { _id: 'condo-test', alias: 'Palmera' }, amount: 1000, currency: 'DOP', issueDate: '2026-10-01', status: 'active', paymentStatus: 'pending' };
    await page.route('**/*', async route => {
      const req = route.request(), url = new URL(req.url());
      if (url.origin === 'http://127.0.0.1:4321') return route.continue();
      const ok = data => route.fulfill({ json: { success: true, data, error: null } });
      if (url.pathname.endsWith('/auth/me')) return ok({ user: identity, access });
      if (url.pathname.includes('/get-invoicesByCondo/')) return ok({ invoices: [{ ...invoice, attachments: [...receipts] }, ...(multiple ? [{ ...invoice, _id: 'invoice-other', amount: 2000, attachments: [] }] : [])] });
      if (url.pathname.endsWith('/payments/bank-accounts')) return ok({ docs: accounts ? [{ _id: 'bank-test', condominiumId: 'condo-test', bank: 'Test Bank', accountLabel: 'Receiving 1234', currency: 'DOP' }] : [] });
      if (url.pathname.endsWith('/payments/receipts') && req.method() === 'GET') return ok({ docs: receipts.filter(r => r.invoiceId === url.searchParams.get('invoiceId')) });
      if (url.pathname.endsWith('/payments/receipts') && req.method() === 'POST') {
        posts++;
        const multipart = req.postDataBuffer().toString();
        assert.match(multipart, /invoice-test/); assert.match(multipart, /bank-test/);
        if (fail) return route.fulfill({ status: 500, json: { success: false, error: { message: 'Upload failed for test' } } });
        if (multipart.includes('duplicate.png')) return route.fulfill({ status: 409, json: { success: false, error: { message: 'Duplicate voucher' } } });
        const receipt = { _id: 'receipt-' + posts, invoiceId: invoice._id, reconciliationStatus: 'pending', originalName: /filename="([^"]+)"/.exec(multipart)[1] };
        receipts.push(receipt);
        return ok(receipt);
      }
      if (/\/payments\/receipts\/[^/]+$/.test(url.pathname) && req.method() === 'DELETE') {
        deletes++;
        if (deleteFail) return route.fulfill({ status: 409, json: { success: false, error: { message: 'Unable to delete voucher for test' } } });
        const id = url.pathname.split('/').pop();
        receipts = receipts.filter(receipt => receipt._id !== id);
        return ok({ deletedId: id });
      }
      if (/\/payments\/receipts\/[^/]+\/file$/.test(url.pathname)) {
        assert.ok([token, 'Bearer ' + token].includes(req.headers().authorization));
        return route.fulfill({ contentType: 'application/pdf', headers: { 'Content-Disposition': 'attachment; filename="voucher.pdf"' }, body: '%PDF-1.4 voucher download' });
      }
      return ok({ docs: [] });
    });
    const modal = page.getByRole('dialog', { name: 'Upload Voucher', exact: true });
    const open = async () => {
      await page.getByRole('button', { name: 'More actions', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Upload Voucher' }).click();
      await modal.waitFor();
    };
    const upload = (name, mimeType = 'image/png', buffer = Buffer.from('synthetic')) => modal.locator('input[type=file]').setInputFiles({ name, mimeType, buffer });
    await page.goto('http://127.0.0.1:4321/#/invoice-history/owner-test');
    await page.getByText('Palmera', { exact: true }).first().waitFor();
    await open();
    await modal.getByText('0/3', { exact: true }).waitFor();
    await modal.locator('#voucher-account option[value="bank-test"]').waitFor({ state: 'attached' });
    await upload('invalid.txt', 'text/plain');
    await modal.getByRole('alert').filter({ hasText: 'Use a PDF' }).waitFor(); assert.equal(posts, 0);
    await upload('large.png', 'image/png', Buffer.alloc(8 * 1024 * 1024 + 1));
    await modal.getByRole('alert').filter({ hasText: '8 MiB' }).waitFor(); assert.equal(posts, 0);
    fail = true; await upload('retry.png');
    await modal.getByRole('alert').filter({ hasText: 'Upload failed for test' }).waitFor();
    fail = false; await upload('voucher.pdf', 'application/pdf');
    await modal.getByText('1/3', { exact: true }).waitFor();
    await modal.getByRole('status').filter({ hasText: 'uploaded successfully' }).waitFor();
    await upload('duplicate.png');
    await modal.getByRole('alert').filter({ hasText: 'Duplicate voucher' }).waitFor();
    assert.equal(receipts.length, 1);
    await upload('voucher.png'); await modal.getByText('2/3', { exact: true }).waitFor();
    await upload('voucher.jpg', 'image/jpeg'); await modal.getByText('3/3', { exact: true }).waitFor();
    assert.equal(await modal.locator('input[type=file]').isDisabled(), true);
    await modal.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Attachments for Palmera: 3' }).click();
    const attachments = page.getByRole('dialog', { name: 'Attachments', exact: true });
    await attachments.getByText('Invoice invoice-test', { exact: true }).waitFor();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      attachments.getByRole('button', { name: 'Download voucher.pdf', exact: true }).click(),
    ]);
    assert.equal(download.suggestedFilename(), 'voucher.pdf');
    assert.match(fs.readFileSync(await download.path(), 'utf8'), /%PDF-1.4/);
    const deletion = page.getByRole('dialog', { name: 'Delete voucher', exact: true });
    await attachments.getByRole('button', { name: 'Delete voucher.pdf', exact: true }).click();
    await deletion.getByRole('button', { name: 'Cancel', exact: true }).click();
    await deletion.waitFor({ state: 'hidden' });
    assert.equal(deletes, 0); assert.equal(receipts.length, 3);
    deleteFail = true;
    await attachments.getByRole('button', { name: 'Delete voucher.pdf', exact: true }).click();
    await deletion.getByRole('button', { name: 'Delete voucher', exact: true }).click();
    await deletion.getByRole('alert').filter({ hasText: 'Unable to delete voucher for test' }).waitFor();
    assert.equal(receipts.length, 3);
    deleteFail = false;
    await deletion.getByRole('button', { name: 'Delete voucher', exact: true }).click();
    await deletion.waitFor({ state: 'hidden' });
    await attachments.getByRole('status').filter({ hasText: 'Voucher deleted' }).waitFor();
    await page.getByRole('button', { name: 'Attachments for Palmera: 2' }).waitFor();
    assert.equal(receipts.length, 2);
    await attachments.getByRole('button', { name: 'Upload correct voucher', exact: true }).click();
    await modal.getByText('2/3', { exact: true }).waitFor();
    assert.equal(await modal.locator('input[type=file]').isEnabled(), true);
    await upload('voucher.pdf', 'application/pdf');
    await modal.getByText('3/3', { exact: true }).waitFor();
    await modal.getByRole('button', { name: 'Delete voucher.jpg', exact: true }).click();
    await deletion.getByRole('button', { name: 'Delete voucher', exact: true }).click();
    await deletion.waitFor({ state: 'hidden' });
    await modal.getByText('2/3', { exact: true }).waitFor();
    await upload('voucher.jpg', 'image/jpeg');
    await modal.getByText('3/3', { exact: true }).waitFor();
    await modal.getByRole('button', { name: 'Close', exact: true }).click();
    receipts[0].reconciliationStatus = 'confirmed';
    await page.reload();
    await page.getByRole('button', { name: 'Attachments for Palmera: 3' }).click();
    await attachments.getByText('Reconciled', { exact: true }).waitFor();
    assert.equal(await attachments.getByRole('button', { name: 'Delete ' + receipts[0].originalName, exact: true }).count(), 0);
    await attachments.getByRole('button', { name: 'Close' }).click();
    await page.reload();
    await page.getByRole('button', { name: 'Attachments for Palmera: 3' }).waitFor();
    await page.getByRole('button', { name: 'More actions', exact: true }).click();
    await page.getByRole('menuitem', { name: 'See details' }).click();
    const details = page.getByRole('dialog');
    await details.getByRole('button', { name: 'Download voucher.pdf' }).waitFor();
    await details.getByText('Pending', { exact: true }).waitFor();
    await details.getByRole('button', { name: 'Close' }).click();
    accounts = false; receipts = []; await open();
    await modal.getByText(/No receiving bank account is configured/).waitFor();
    assert.equal(await modal.locator('input[type=file]').isDisabled(), true);
    await modal.getByRole('button', { name: 'Close' }).click();
    accounts = true; multiple = true; await page.reload();
    await open(); await modal.getByText('Choose date, unit and amount', { exact: true }).waitFor();
    await modal.getByRole('combobox').click();
    await page.getByRole('option', { name: /10\/01\/2026.*Unit A1.*1000/ }).click();
    await page.getByRole('option').first().waitFor({ state: 'hidden' });
    await modal.getByText('0/3', { exact: true }).waitFor();
    await page.screenshot({ path: 'invoice-voucher-owner-review.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS Chrome OWNER: upload, validation, limits, download, deletion/cancel/error/retry in both dialogs, replacement, confirmed protection, reload, details and missing account.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
