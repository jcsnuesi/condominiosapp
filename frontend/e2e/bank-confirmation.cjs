// Run from repository root after building frontend/dist/ocr-flow-review.
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
    const identity = { _id: 'admin-test', role: 'ADMIN', name: 'Bank', lastname: 'Test', first_password_changed: true };
    const access = { permissions: ['finance.read', 'finance.update', 'finance.create'], scope: { mode: 'ALL', condominiumIds: [] } };
    const token = 'test.' + Buffer.from(JSON.stringify({ ...identity, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url') + '.test';
    await context.addCookies(Object.entries({ identity: JSON.stringify(identity), token, access_context: JSON.stringify(access) })
      .map(([name, value]) => ({ name, value, url: origin })));
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let receipt = { _id: 'receipt-test', invoiceId: 'invoice-test', bankAccountId: 'account-test', ocrStatus: 'ready', reconciliationStatus: 'pending', fields: { amount: '48000.00', currency: 'DOP', date: '2026-09-27', reference: '12345678' } };
    const movement = { _id: 'movement-test', amount: '48928.83', currency: 'DOP', date: '2026-09-27', reference: '12345678', description: 'Abono de prueba', direction: 'credit' };
    let candidates = [];
    let excluded = [];
    let confirmed = 0;
    let queries = 0;
    let corrections = 0;
    const statement = { _id: 'statement-test', bankAccountId: 'account-test', status: 'ready', rows: [movement] };
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      const ok = data => route.fulfill({ json: { success: true, data, error: null } });
      if (url.pathname.endsWith('/auth/me')) return ok({ user: identity, access });
      if (url.pathname.endsWith('/bank-accounts')) return ok({ docs: [{ _id: 'account-test', bank: 'Banco de prueba', accountLabel: 'Receptora', currency: 'DOP', condominiumId: 'condo-test' }] });
      if (url.pathname.endsWith('/receipts/receipt-test/candidates')) { queries++; return ok({ docs: candidates, excluded }); }
      if (url.pathname.endsWith('/receipts/receipt-test/fields')) {
        const { note, ...fields } = route.request().postDataJSON();
        assert.ok(note.trim().length >= 10);
        assert.equal(Number(fields.amount), 48928.83);
        corrections++;
        receipt = { ...receipt, fields };
        candidates = [{ movement, eligible: true, referenceMatches: true, reasons: ['reference_match'] }];
        return ok(receipt);
      }
      if (url.pathname.endsWith('/receipts/receipt-test/confirm')) {
        assert.equal(route.request().postDataJSON().movementId, 'movement-test');
        confirmed++;
        receipt = { ...receipt, reconciliationStatus: 'confirmed' };
        return ok(receipt);
      }
      if (url.pathname.endsWith('/receipts/receipt-test')) return ok(receipt);
      if (url.pathname.endsWith('/receipts')) return ok({ docs: [receipt] });
      if (url.pathname.endsWith('/statements/statement-test/commit')) {
        assert.equal(route.request().postDataJSON().reviewed, true);
        candidates = [{ movement, eligible: true, referenceMatches: true, reasons: ['reference_match'] }];
        return ok({ ...statement, status: 'committed', reviewedRows: statement.rows });
      }
      if (url.pathname.endsWith('/statements/statement-test')) return ok(statement);
      if (url.pathname.endsWith('/statements')) return ok({ docs: [statement] });
      if (url.pathname.endsWith('/monitor/options')) return ok([]);
      if (url.pathname.endsWith('/payments/providers')) return ok([]);
      return ok({ docs: [], total: 0 });
    });
    await page.goto(`${origin}/#/payment-monitor`);
    const panel = page.getByRole('region', { name: 'Transferencias bancarias' });
    await panel.getByRole('button', { name: /Factura .*OCR: ready/ }).click();
    const confirm = panel.getByRole('button', { name: 'Confirmar contra movimiento bancario' });
    const expectDisabled = async disabled => {
      await confirm.and(page.locator(disabled ? ':disabled' : ':enabled')).waitFor();
      assert.equal(await confirm.isDisabled(), disabled);
    };
    await panel.getByText(/Importe y revise el estado/).waitFor();
    await expectDisabled(true);
    assert.equal(await panel.getByLabel('Cuenta receptora del condominio').inputValue(), 'account-test');
    // An imported credit 16 days away must explain the rejection, not disappear.
    excluded = [{ movement: { ...movement, date: '2026-09-11', reference: '123456789 PAGO' }, eligible: false, dayDifference: 16, reasons: ['date_outside_window', 'reference_requires_review'] }];
    await panel.getByRole('button', { name: 'Buscar movimientos nuevamente' }).click();
    await panel.getByRole('heading', { name: 'Movimientos importados descartados' }).waitFor();
    await panel.getByText(/16 días de diferencia; máximo 5 días/).waitFor();
    await expectDisabled(true);
    assert.equal(await panel.getByRole('radio').count(), 0);
    excluded = [];
    // Reproduce the screenshot: edited amount with a short correction reason.
    await panel.getByText('Corregir datos extraídos', { exact: true }).click();
    await panel.getByLabel('Monto', { exact: true }).fill('48928.83');
    await panel.getByLabel('Motivo de corrección', { exact: true }).fill('sdsdfsdf');
    await panel.getByText('Motivo de corrección: 8/10 caracteres mínimos.', { exact: true }).waitFor();
    const save = panel.getByRole('button', { name: 'Guardar corrección auditada' });
    await save.and(page.locator(':disabled')).waitFor();
    await expectDisabled(true);
    assert.equal(corrections, 0);
    await panel.getByLabel('Motivo de corrección', { exact: true }).fill('Monto corregido según el comprobante original');
    await save.click();
    await panel.getByText('Corrección guardada. La búsqueda de movimientos utiliza los datos actualizados.', { exact: true }).waitFor();
    assert.equal(corrections, 1);
    await panel.getByRole('radio').check();
    await expectDisabled(false);
    candidates = [];
    await panel.getByRole('button', { name: 'Buscar movimientos nuevamente' }).click();
    await panel.getByText(/Importe y revise el estado/).waitFor();
    // A ready receipt must discover movements imported elsewhere on refresh.
    candidates = [{ movement, eligible: true, referenceMatches: true, reasons: ['reference_match'] }];
    await panel.getByRole('button', { name: 'Buscar movimientos nuevamente' }).click();
    await panel.getByRole('radio').waitFor();
    await expectDisabled(true);
    await panel.getByRole('radio').check();
    await expectDisabled(false);
    // Refreshing must invalidate a selection that is no longer available.
    candidates = [];
    await panel.getByRole('button', { name: 'Buscar movimientos nuevamente' }).click();
    await panel.getByText(/Importe y revise el estado/).waitFor();
    await expectDisabled(true);
    // Import in this panel must refresh candidates without reopening the receipt.
    await panel.getByText('Importar estado de cuenta CSV / PDF', { exact: true }).click();
    await panel.getByRole('button', { name: /Importación .*ready/ }).click();
    await panel.getByRole('checkbox', { name: /Revisé estos movimientos/ }).check();
    await panel.getByRole('button', { name: 'Importar movimientos revisados' }).click();
    await panel.getByRole('radio').waitFor();
    await panel.getByRole('radio').check();
    await expectDisabled(false);
    // Different references require the same minimum note enforced by the API.
    candidates = [{ movement: { ...movement, reference: '87654321' }, eligible: true, referenceMatches: false, reasons: ['reference_requires_review'] }];
    await panel.getByRole('button', { name: 'Buscar movimientos nuevamente' }).click();
    await panel.getByText(/La referencia falta o es distinta/).waitFor();
    await panel.getByLabel('Nota de revisión').fill('dddd');
    await expectDisabled(true);
    await panel.getByLabel('Nota de revisión').fill('Verificado contra el estado original');
    await confirm.click();
    await panel.getByText('Pago conciliado contra el movimiento bancario.', { exact: true }).waitFor();
    assert.equal(confirmed, 1);
    assert.ok(queries >= 5);
    assert.deepEqual(errors, []);
    console.log('PASS: candidates refresh after import/manual refresh, stale selections clear, confirmation requires a movement and reference review.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
