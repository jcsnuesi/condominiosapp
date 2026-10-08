"use strict";
// Every API is a fixture. No production account or PayPal request is reachable.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "../../tmp/schedule-tools/node_modules/playwright");
const { expect } = require(`${process.env.PLAYWRIGHT_MODULE || "../../tmp/schedule-tools/node_modules/playwright"}/test`);
const http = require("node:http"), fs = require("node:fs"), path = require("node:path"), assert = require("node:assert/strict");
const build = path.resolve(__dirname, "../../tmp/saas-platform-build"), artifacts = path.resolve(__dirname, "../../tmp/saas-browser");
const orgId = "507f1f77bcf86cd799439012", userId = "507f1f77bcf86cd799439011";
const free = { _id: "507f1f77bcf86cd799439013", name: "Gratis", subjectType: "ORGANIZATION", kind: "FREE", status: "active", priceMinor: 0, modules: ["dashboard"], isDefaultFree: true, limits: { condominiums: 1, units: 2, unitsPerCondominium: 2, residences: null } };
const paid = { ...free, _id: "507f1f77bcf86cd799439014", name: "Mensual", kind: "PAID", priceMinor: 1000, isDefaultFree: false, paypalPlanId: "P-FIXTURE" };
const account = { id: orgId, subjectType: "ORGANIZATION", name: "Organización de prueba", status: "active", membership: null, usage: {}, exceeded: [], compliance: "UNPROVISIONED" };
const server = http.createServer((req, res) => {
  const file = path.resolve(build, `.${new URL(req.url, "http://localhost").pathname}`);
  const target = file.startsWith(build + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile() ? file : path.join(build, "index.html");
  res.setHeader("Content-Type", target.endsWith(".js") ? "text/javascript" : target.endsWith(".css") ? "text/css" : target.endsWith(".html") ? "text/html" : "application/octet-stream"); res.end(fs.readFileSync(target));
});
async function main() {
  fs.mkdirSync(artifacts, { recursive: true }); await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`; const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const platform of [true, false]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const identity = { _id: userId, name: "Fixture", lastname: "Review", role: platform ? "PLATFORM_ADMIN" : "ADMIN", first_password_changed: true, avatar: "default-avatar.png" };
      const access = { isPlatform: platform, isOwnerAdmin: !platform, organizationId: platform ? null : orgId, organization: platform ? null : { _id: orgId, name: account.name }, permissions: platform ? require("../service/platformPermissions").PLATFORM_PERMISSIONS : ["dashboard.read"], scope: { mode: "ALL", organizationIds: [], ownerIds: [], condominiumIds: [] } };
      const makeToken = pending => `fixture.${Buffer.from(JSON.stringify({ sub: userId, role: identity.role, exp: Math.floor(Date.now()/1000)+3600, mfaPending: pending })).toString("base64url")}.fixture`;
      await context.addCookies([{ name: "identity", value: JSON.stringify(identity), url: base }, { name: "token", value: makeToken(false), url: base }, { name: "access_context", value: JSON.stringify(access), url: base }]);
      const page = await context.newPage(), errors = [], writes = []; let subscription = null, enrolled = false;
      page.on("pageerror", e => errors.push(e.message));
      page.on("console", message => { if (message.type() === "error" && /ERROR|NG\d+/.test(message.text())) errors.push(message.text()); });
      await page.route("**/*", async route => {
        const req = route.request(), url = new URL(req.url());
        if (url.origin === base && !url.pathname.startsWith("/api")) return route.continue();
        const api = url.pathname.replace(/^\/api\//, ""); const body = ["POST","PUT","PATCH"].includes(req.method()) ? req.postDataJSON() : null;
        if (body) writes.push({ api, body }); let data = {};
        if (api === "auth/me") data = { user: identity, access };
        if (["platform/accounts", "platform/support/accounts", "platform/communications/accounts", "platform/lifecycle/accounts"].includes(api)) data = { rows: [account], total: 1, page: 1 };
        if (["platform/plans", "platform/membership-plans"].includes(api)) data = [free, paid];
        if (api === "platform/migrations/preview") data = { rows: [{ name: account.name, exceeded: ["units"], removedModules: ["iot"] }], expiresAt: Date.now()+600000, token: "signed-fixture" };
        if (api === "platform/migrations/apply") data = { migrated: 1 };
        if (api === "platform/security") data = { enabled: enrolled };
        if (api === "platform/security/setup") data = { secret: "JBSWY3DPEHPK3PXP" };
        if (api === "platform/security/enroll") { enrolled = true; data = { token: makeToken(false), recoveryCodes: ["ONE-TIME-RECOVERY"] }; }
        if (["platform/support", "platform/communications", "platform/lifecycle", "platform/billing", "platform/audit"].includes(api)) data = { rows: [], charges: [], total: 0 };
        if (api === "platform/exports") data = [];
        if (api === "platform/configuration") data = { retentionDays: 90, supportEmail: "support@example.test", maintenanceMessage: "" };
        if (api === "platform/health") data = { database: "CONNECTED", backup: { state: "NOT_CONFIGURED" } };
        if (api === "platform/communications/preview") data = { ...body, audience: { mode: body.mode, accounts: body.accounts }, cutoff: new Date().toISOString(), recipientCount: 1, token: "notice-preview" };
        if (api === "platform-announcements") data = [];
        if (api === "saas/subscription" && req.method() === "POST") { subscription = { _id: "sub-fixture", planId: paid._id, state: "PENDING", paidThrough: null, graceUntil: null, approvalUrl: "https://www.sandbox.paypal.com/fixture" }; data = subscription; }
        if (api === "saas/subscription" && req.method() === "GET") data = { membership: { plan: free.name }, subscription, plans: [free, paid], charges: [], checkoutEnabled: true };
        if (api === "saas/subscription/cancel") { subscription = null; data = { cancelled: true }; }
        await route.fulfill({ json: { success: true, data, error: null, code: "REQUEST_OK" } });
      });
      if (platform) {
        await page.goto(`${base}/index.html#/platform/migrations`);
        try { await expect(page.getByRole("heading", { name: "Migración revisada a la capa gratis" })).toBeVisible(); }
        catch (e) { console.error("Migration URL", page.url(), "Runtime errors", errors, "Text", await page.locator("body").innerText()); await page.screenshot({ path: path.join(artifacts, "migration-error.png"), fullPage: true, animations: "disabled" }); throw e; }
        await page.getByLabel("Plan gratuito").selectOption(free._id);
        await page.getByRole("checkbox", { name: /Organización de prueba/ }).check(); await page.getByRole("button", { name: "Previsualizar cambios" }).click();
        await expect(page.getByText("Módulos retirados: iot")).toBeVisible(); await expect(page.getByRole("button", { name: "Confirmar migración revisada" })).toBeDisabled();
        await page.getByLabel("Motivo", { exact: true }).fill("Lote revisado"); await page.getByRole("button", { name: "Confirmar migración revisada" }).click(); await expect(page.getByRole("status")).toContainText("1 cuentas migradas");
        assert.equal(writes.find(row => row.api === "platform/migrations/apply").body.token, "signed-fixture");
        await page.goto(`${base}/index.html#/platform/security`); await page.getByRole("button", { name: "Configurar MFA" }).click(); await expect(page.getByText("JBSWY3DPEHPK3PXP")).toBeVisible();
        await page.getByLabel("Código de autenticador o recuperación").fill("123456"); await page.getByRole("button", { name: "Confirmar configuración" }).click(); await expect(page.getByRole("heading", { name: "Códigos de recuperación" })).toBeVisible();
        for (const [route, title] of [["billing","Facturación del SaaS"],["support","Soporte de plataforma"],["communications","Avisos de plataforma"],["configuration","Configuración global"],["health","Operación técnica"],["lifecycle","Ciclo de vida de organizaciones"]]) {
          await page.goto(`${base}/index.html#/platform/${route}`); await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
          if (route === "communications") { await page.getByLabel("Cuenta", { exact: true }).selectOption(orgId); await page.getByLabel("Título", { exact: true }).fill("Mantenimiento"); await page.getByLabel("Aviso", { exact: true }).fill("Aviso de prueba"); await page.getByLabel("Vigencia hasta").fill("2027-01-01"); await page.getByRole("button", { name: "Previsualizar destinatarios" }).click(); await expect(page.getByText("1 cuentas destinatarias")).toBeVisible(); await page.getByRole("button", { name: "Publicar este aviso" }).click(); await expect(page.getByRole("status")).toBeVisible(); }
          await page.setViewportSize({ width: 390, height: 844 }); await page.screenshot({ path: path.join(artifacts, "latest-mobile.png"), fullPage: true, animations: "disabled" }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} overflows mobile`); await page.screenshot({ path: path.join(artifacts, `${route}-mobile.png`), fullPage: true, animations: "disabled" }); await page.setViewportSize({ width: 1440, height: 1000 });
        }
      } else {
        await page.goto(`${base}/index.html#/subscription`); await expect(page.getByRole("heading", { name: "Mi suscripción a Comunard" })).toBeVisible();
        await page.getByRole("button", { name: "Contratar con PayPal" }).click(); await expect(page.getByRole("link", { name: "Completar contratación en PayPal" })).toBeVisible();
        await page.getByRole("button", { name: "Cancelar renovación" }).click(); assert.ok(!writes.some(row => row.api.endsWith("/cancel"))); await page.getByRole("button", { name: "Confirmar cancelación" }).click(); await expect(page.getByRole("button", { name: "Contratar con PayPal" })).toBeVisible();
        await page.setViewportSize({ width: 390, height: 844 }); await page.screenshot({ path: path.join(artifacts, "latest-mobile.png"), fullPage: true, animations: "disabled" }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "subscription overflows mobile"); await page.screenshot({ path: path.join(artifacts, "subscription-mobile.png"), fullPage: true, animations: "disabled" });
      }
      assert.deepEqual(errors, [], "Angular runtime errors"); await context.close();
    }
    console.log("SaaS browser flows passed (desktop/mobile, all APIs intercepted)");
  } finally { await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(e => { console.error(e); process.exitCode = 1; server.close(); });



