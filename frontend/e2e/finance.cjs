"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
async function expectDisabled(page, locator) {
  await page.waitForFunction(element => element.matches(':disabled'), await locator.elementHandle());
  assert.ok(await locator.isDisabled());
}
function playwright() {
  if (process.env.PLAYWRIGHT_MODULE) return require(process.env.PLAYWRIGHT_MODULE);
  try { return require("playwright"); } catch {
    const cache = path.join(process.env.LOCALAPPDATA, "npm-cache", "_npx");
    const module = fs.readdirSync(cache).map(dir => path.join(cache, dir, "node_modules", "playwright")).find(dir => fs.existsSync(path.join(dir, "package.json")));
    if (!module) throw new Error("Playwright runtime missing");
    return require(module);
  }
}
const root = path.resolve("frontend/dist/finance-review");
const server = http.createServer((req, res) => {
  const candidate = path.resolve(root, "." + decodeURIComponent(req.url.split("?")[0]));
  if (!candidate.startsWith(root + path.sep) && candidate !== root) { res.writeHead(403).end(); return; }
  const file = fs.existsSync(candidate) && fs.statSync(candidate).isFile() ? candidate : path.join(root, "index.html");
  res.setHeader("Content-Type", file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : file.endsWith(".html") ? "text/html" : "application/octet-stream");
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await playwright().chromium.launch({ channel: "chrome", headless: true });
  const settings = { enabled: true, cashbookEnabled: true, reportsEnabled: true, lateFee: { enabled: false, mode: "fixed", value: 0, graceDays: 0 } };
  const writes = [];
  const errors = [];
  let failReport = false;
  let migrationReady = true;
  let failSettings = false;
  async function session(role) {
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const identity = { _id: role === "OWNER" ? "owner-1" : "admin-1", role, name: "Ana", lastname: "Perez", first_password_changed: true };
    const access = { organization: { id: "org-1", name: "Test", status: "active" }, isOwnerAdmin: role === "ADMIN", permissions: role === "ADMIN" ? ["finance.read", "finance.create", "finance.update"] : ["finance.read"], scope: { mode: "ALL", condominiumIds: [] } };
    const token = "test." + Buffer.from(JSON.stringify({ ...identity, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url") + ".test";
    await context.addCookies(Object.entries({ identity: JSON.stringify(identity), access_context: JSON.stringify(access), token }).map(([name, value]) => ({ name, value, url: origin })));
    const page = await context.newPage(); page.setDefaultTimeout(15000); page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === origin) return route.continue();
      const ok = data => route.fulfill({ json: { success: true, data, error: null } });
      if (url.pathname.endsWith("/auth/me")) return ok({ user: identity, access });
      if (!url.pathname.includes("/finance/")) return ok({});
      if (url.searchParams.get("format") === "csv") return route.fulfill({ contentType: "text/csv", body: "Date,Description,Cargo,Aplicacion,Balance\n2026-10-01,Cuota,5000,0,5000" });
      if (request.method() !== "GET") {
        const body = request.postDataJSON(); writes.push({ path: url.pathname, body });
        if (url.pathname.endsWith("/settings")) {
          if (failSettings) return route.fulfill({ status: 409, json: { success: false, error: { message: "Ejecute la revisión y migración de índices antes de activar finanzas" } } });
          Object.assign(settings, body); return ok(settings);
        }
        return ok({ _id: "result-1", docs: [], created: 1 });
      }
      if (url.pathname.endsWith("/options")) return ok({ docs: [{ _id: "condo-1", alias: "Residencial Test", mPayment: 5000, units: [{ ownerId: "owner-1", unitNumber: "A1", ownerName: "Ana Perez" }] }] });
      if (url.pathname.endsWith("/settings")) return ok({ settings, migrationReady });
      if (url.pathname.endsWith("/accounts")) return ok({ docs: [{ _id: "bank-1", bank: "Bank Test", accountLabel: "Principal", currency: "DOP" }] });
      if (url.pathname.endsWith("/receivables")) return ok({ docs: [{ _id: "invoice-1", invoice_number: "INV-1", unitNumber: "A1", ownerId: "owner-1", amount: 5000, balancePending: 5000, pendingMinor: 500000, currency: "DOP", chargeType: "monthly", bucket: "1-30" }], totals: [{ currency: "DOP", amountMinor: 500000, buckets: { current: 0, "1-30": 500000, "31-60": 0, "61-90": 0, "90+": 0 } }], total: 1, page: 1, limit: 50 });
      if (url.pathname.endsWith("/credits")) return ok({ docs: [{ _id: "credit-1", ownerId: "owner-1", unitNumber: "A1", currency: "DOP", amountMinor: 100000, availableMinor: 100000 }] });
      if (url.pathname.endsWith("/entries") || url.pathname.endsWith("/movements")) return ok({ docs: [], total: 0, page: 1, limit: 50 });
      if (url.pathname.endsWith("/budget")) return ok({ lines: [], revision: 0 });
      if (url.pathname.endsWith("/history")) return ok({ docs: [{ id: "charge-1", date: "2026-10-01", kind: "charge", description: "Monthly fee", debitMinor: 500000, creditMinor: 0, balanceMinor: 500000 }], total: 1, page: 1, openingMinor: 0, closingMinor: 500000, currentPendingMinor: 500000, currency: "DOP", credits: [{ _id: "credit-1", availableMinor: 100000, currency: "DOP" }], warnings: { undatedLegacyPayments: 0, undatedPayments: 0 } });
      if (url.pathname.endsWith("/report")) {
        if (failReport) return route.fulfill({ status: 403, json: { success: false, error: { message: "Reporte fuera de alcance" } } });
        return ok({ incomeMinor: 500000, expenseMinor: 20000, netMinor: 480000, currency: "DOP", rows: [{ id: "cash-1", date: "2026-10-01", kind: "income", category: "Cobros de cuotas", amountMinor: 500000, reference: "TRANSFER-1" }], banks: [], receivables: [], receivablesAsOf: "2026-10-03", budget: [], warnings: { undatedSuccessfulPayments: 0, legacyPaidWithoutTransactions: 0 } });
      }
      return ok({});
    });
    await page.goto(origin + "/#/finance");
    try { await page.getByRole("heading", { name: "Financial management", exact: true }).waitFor(); }
    catch (error) {
      const dir = path.resolve("tests/artifacts/finance"); fs.mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, "finance-load-failure.png"), fullPage: true });
      console.error({ url: page.url(), errors, body: (await page.locator("body").innerText()).slice(0, 1200) });
      throw error;
    }
    return { context, page, panel: page.locator("app-finance") };
  }
  try {
    const admin = await session("ADMIN"), panel = admin.panel;
    await panel.getByRole("button", { name: "Apply adjustment", exact: true }).click();
    await panel.getByLabel("Amount", { exact: true }).fill("500");
    await panel.getByLabel("Reason", { exact: true }).fill("Discount aprobado");
    await panel.getByRole("button", { name: "Record adjustment", exact: true }).click();
    await panel.getByRole("status").filter({ hasText: "Adjustment recorded" }).waitFor();
    assert.equal(writes.find(write => write.path.endsWith("/adjustments")).body.amount, 500);
    await panel.getByLabel("Type").first().selectOption("extraordinary");
    await panel.getByLabel("Description or reason").fill("Reparación ascensor");
    await panel.getByLabel("Select unit A1").check();
    await panel.getByLabel("Unit amount A1").fill("1250");
    await panel.getByRole("button", { name: "Record charges", exact: true }).click();
    await panel.getByRole("status").filter({ hasText: "Charges recorded" }).waitFor();
    const charge = writes.find(write => write.path.endsWith("/charges")); assert.equal(charge.body.units[0].amount, 1250); assert.equal(charge.body.chargeType, "extraordinary");
    await panel.getByRole("button", { name: "Settings", exact: true }).click();
    await panel.getByLabel("Enable a one-time charge per overdue invoice").check();
    await panel.getByLabel("Mode").selectOption("percent");
    const saveSettings = panel.getByRole("button", { name: "Save settings", exact: true });
    await panel.getByLabel("Amount or percentage").fill("101");
    await expectDisabled(admin.page, saveSettings);
    await panel.getByLabel("Amount or percentage").fill("0");
    await expectDisabled(admin.page, saveSettings);
    await panel.getByLabel("Amount or percentage").fill("2.3");
    failSettings = true;
    await saveSettings.click();
    await panel.getByRole("alert").filter({ hasText: "Data and index migration must be completed before enabling finance." }).waitFor();
    failSettings = false;
    await panel.getByRole("button", { name: "Save settings", exact: true }).click();
    await panel.getByRole("status").filter({ hasText: "Settings saved" }).waitFor();
    assert.equal(writes.find(write => write.path.endsWith("/settings")).body.lateFee.value, 2.3);
    await panel.getByLabel("Enable charges, adjustments, credits and history").uncheck();
    for (const label of ["Enable income and expenses", "Enable budget and reports", "Enable a one-time charge per overdue invoice"]) {
      await expectDisabled(admin.page, panel.getByLabel(label));
      assert.equal(await panel.getByLabel(label).isChecked(), false);
    }
    await panel.getByLabel("Enable charges, adjustments, credits and history").check();
    await panel.getByLabel("Enable income and expenses").check();
    await panel.getByLabel("Enable budget and reports").check();
    await panel.getByLabel("Grace days").fill("1.5");
    await expectDisabled(admin.page, saveSettings);
    await panel.getByLabel("Grace days").fill("0");
    await panel.getByRole("button", { name: "Budget", exact: true }).click();
    await panel.getByLabel("Category", { exact: true }).fill("Reparaciones");
    await panel.getByLabel("Amount", { exact: true }).fill("3000");
    await panel.getByRole("button", { name: "Add or update budget line", exact: true }).click();
    await panel.getByRole("button", { name: "Save annual budget", exact: true }).click();
    await panel.getByRole("status").filter({ hasText: "Budget saved" }).waitFor();
    assert.equal(writes.find(write => write.path.endsWith("/budget")).body.lines[0].amount, 3000);
    await panel.getByRole("button", { name: "Reports", exact: true }).click();
    await panel.getByRole("heading", { name: "Net cash flow" }).waitFor();
    failReport = true; await panel.getByRole("button", { name: "View", exact: true }).click();
    await panel.getByRole("alert").filter({ hasText: "The report is outside your access scope." }).waitFor();
    failReport = false; await panel.getByRole("button", { name: "View", exact: true }).click(); await panel.getByRole("heading", { name: "Net cash flow" }).waitFor();
    const artifactDir = path.resolve("tests/artifacts/finance"); fs.mkdirSync(artifactDir, { recursive: true });
    await admin.page.screenshot({ path: path.join(artifactDir, "finance-admin.png"), fullPage: true });
    await admin.page.setViewportSize({ width: 390, height: 844 });
    await admin.page.waitForFunction(() => getComputedStyle(document.querySelector('.layout-main-container')).marginLeft === '0px' && document.querySelector('app-finance').getBoundingClientRect().width > innerWidth * .7 && document.documentElement.scrollWidth <= innerWidth + 1);
    await admin.page.screenshot({ path: path.join(artifactDir, "finance-mobile.png"), fullPage: true });
    const mobile = await admin.page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, overflow: [...document.querySelectorAll('app-finance *')].filter(element => element.getBoundingClientRect().right > innerWidth + 1).slice(0, 12).map(element => ({ tag: element.tagName, className: element.className, width: element.getBoundingClientRect().width })) }));
    if (mobile.scrollWidth > mobile.width + 1) console.error(mobile);
    assert.ok(mobile.scrollWidth <= mobile.width + 1);
    await admin.context.close();
    const owner = await session("OWNER");
    await owner.panel.getByRole("heading", { name: "Current debt" }).waitFor();
    assert.equal(await owner.panel.getByRole("button", { name: "Settings", exact: true }).count(), 0);
    assert.equal(await owner.panel.getByRole("button", { name: "Record charges", exact: true }).count(), 0);
    const [download] = await Promise.all([owner.page.waitForEvent("download"), owner.panel.getByRole("button", { name: "Export CSV", exact: true }).click()]);
    assert.equal(download.suggestedFilename(), "history.csv");
    await owner.page.screenshot({ path: path.join(artifactDir, "finance-owner.png"), fullPage: true });
    await owner.context.close();
    Object.assign(settings, { enabled: false, cashbookEnabled: false, reportsEnabled: false, lateFee: { enabled: false, mode: "fixed", value: 0, graceDays: 0 } });
    migrationReady = false;
    const inactive = await session("ADMIN");
    await inactive.panel.getByRole("button", { name: "Settings", exact: true }).click();
    await expectDisabled(inactive.page, inactive.panel.getByLabel("Enable charges, adjustments, credits and history"));
    migrationReady = true;
    await inactive.panel.getByRole("button", { name: "Refresh", exact: true }).click();
    await inactive.panel.getByLabel("Enable charges, adjustments, credits and history").check();
    const inactiveSave = inactive.panel.getByRole("button", { name: "Save settings", exact: true });
    await expectDisabled(inactive.page, inactiveSave);
    await inactive.panel.getByLabel("I reviewed the data and balances for this condominium").check();
    await inactiveSave.click();
    await inactive.panel.getByRole("status").filter({ hasText: "Settings saved" }).waitFor();
    assert.ok(writes.filter(write => write.path.endsWith("/settings")).at(-1).body.reviewed);
    await inactive.context.close(); assert.deepEqual(errors, []);
    console.log("PASS: admin charges, adjustments, policy, budget, reports, error recovery, mobile layout and owner history/export.");
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
