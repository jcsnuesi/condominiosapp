"use strict";
// Browser smoke tests use fixtures and intercept every API request.
const playwrightPath = process.env.PLAYWRIGHT_MODULE || "../../tmp/schedule-tools/node_modules/playwright";
const { chromium } = require(playwrightPath);
const { expect } = require(`${playwrightPath}/test`);
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const build = path.resolve(__dirname, "../../tmp/platform-build");
const artifacts = path.resolve(__dirname, "../../tmp/platform-browser");
const { PLATFORM_PERMISSIONS } = require("../service/platformPermissions");
const plan = { _id: "plan-1", name: "Base", subjectType: "ORGANIZATION", status: "active", limits: { condominiums: 2, units: 50, unitsPerCondominium: 25, residences: null } };
let account = { id: "507f1f77bcf86cd799439012", subjectType: "ORGANIZATION", name: "Residencial Jardines", status: "active", compliance: "COMPLIANT", exceeded: [], usage: { condominiums: 1, units: 20, unitsPerCondominium: 20, residences: 0 }, membership: { plan: "Base", status: "ACTIVE", billingStatus: "MANUAL", endsAt: null, limits: plan.limits, reason: "Setup" } };
const stats = { generatedAt: "2026-10-07T18:00:00Z", accounts: 1, organizations: 1, personalOwners: 0, activeAccounts: 1, suspendedAccounts: 0, condominiums: 1, units: 20, residences: 0, compliant: 1, exceeded: 0, unprovisioned: 0, expired: 0, suspendedMemberships: 0, pastDue: 0, expiringSoon: 1, plans: [{ plan: "Base", accounts: 1 }] };
const server = http.createServer((req, res) => {
  const file = path.resolve(build, `.${new URL(req.url, "http://localhost").pathname}`);
  const safe = file.startsWith(build + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile();
  const target = safe ? file : path.join(build, "index.html");
  res.setHeader("Content-Type", target.endsWith(".js") ? "text/javascript" : target.endsWith(".css") ? "text/css" : target.endsWith(".html") ? "text/html" : "application/octet-stream");
  res.end(fs.readFileSync(target));
});
async function main() {
  fs.mkdirSync(artifacts, { recursive: true });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const readOnly of [false, true]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const identity = { _id: "507f1f77bcf86cd799439011", name: "Platform", lastname: "Preview", role: readOnly ? "PLATFORM_SUPERVISOR" : "PLATFORM_ADMIN", avatar: "default-avatar.png", first_password_changed: true };
      const access = { isPlatform: true, organization: null, isOwnerAdmin: false, scope: { mode: readOnly ? "SELECTED" : "ALL", condominiumIds: [], organizationIds: [account.id], ownerIds: [] }, permissions: readOnly ? ["platform.kpis.read", "platform.accounts.read", "platform.access.read"] : PLATFORM_PERMISSIONS };
      const token = `preview.${Buffer.from(JSON.stringify({ sub: identity._id, role: identity.role, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url")}.preview`;
      await context.addCookies([{ name: "identity", value: JSON.stringify(identity), url: base }, { name: "token", value: token, url: base }, { name: "access_context", value: JSON.stringify(access), url: base }]);
      const page = await context.newPage(); const errors = []; const writes = []; const paths = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.route("**/*", async route => {
        const request = route.request(); const url = new URL(request.url());
        if (url.origin === base && !url.pathname.startsWith("/api")) return route.continue();
        const apiPath = url.pathname.replace(/^\/api\//, "");
        paths.push(apiPath);
        let data = {};
        if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) {
          writes.push({ path: apiPath, body: request.postDataJSON() });
          if (apiPath.startsWith("platform/memberships/")) account = { ...account, membership: request.postDataJSON() };
        }
        if (apiPath === "auth/me") data = { user: identity, access };
        if (apiPath === "platform/kpis") data = stats;
        if (apiPath === "platform/accounts" || apiPath === "platform/scope-accounts") data = { rows: [account], total: 1, page: 1, pageSize: 25 };
        if (["platform/plans", "platform/membership-plans"].includes(apiPath)) data = [plan];
        if (apiPath === "platform/policies" || apiPath === "platform/supervisor-policies") data = { policies: [{ _id: "policy-1", name: "Auditor", description: "Consulta de cumplimiento", permissions: ["platform.kpis.read"], status: "active" }], permissions: PLATFORM_PERMISSIONS };
        if (apiPath === "platform/supervisors") data = [];
        if (apiPath.endsWith("/access/catalog")) data = { message: { permissions: ["dashboard.read", "condominiums.read"] } };
        if (apiPath.endsWith("/access/users")) data = { message: [{ _id: "staff-1", subjectModel: "Staff_Admin", name: "Ana", lastname: "Santos", email: "ana@example.test", accessGrant: null }] };
        if (apiPath.endsWith("/access/policies") || apiPath.endsWith("/access/condominiums")) data = { message: [] };
        await route.fulfill({ json: { success: true, data, error: null, code: "REQUEST_OK" } });
      });
      await page.goto(`${base}/index.html#/platform/kpis`);
      await expect(page.getByRole("heading", { name: "KPIs del SaaS", exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Cumplimiento de membresías", exact: true })).toBeVisible();
      await page.screenshot({ path: path.join(artifacts, readOnly ? "kpis-supervisor.png" : "kpis-desktop.png"), fullPage: true, animations: "disabled" });
      if (!readOnly) {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: path.join(artifacts, "kpis-mobile.png"), fullPage: true, animations: "disabled" });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "KPI page overflows mobile viewport");
        await page.setViewportSize({ width: 1440, height: 1000 });
      }
      await page.goto(`${base}/index.html#/platform/accounts`);
      await expect(page.getByRole("cell", { name: "Residencial Jardines Organización", exact: true })).toBeVisible();
      if (readOnly) { await expect(page.getByRole("button", { name: "Membresía", exact: true })).toHaveCount(0); await expect(page.getByRole("button", { name: "Suspender", exact: true })).toHaveCount(0); }
      else {
        await page.getByRole("button", { name: "Membresía", exact: true }).click();
        await expect(page.getByRole("button", { name: "Guardar membresía", exact: true })).toBeDisabled();
        await page.getByLabel("Motivo del cambio").fill("Ajuste de capacidad");
        await page.getByLabel("Unidades totales", { exact: true }).fill("30");
        await page.getByRole("button", { name: "Guardar membresía", exact: true }).click();
        await expect(page.getByRole("status").filter({ hasText: "Cambios guardados" })).toBeVisible();
        assert.equal(writes[0].body.limits.units, 30);
        await page.goto(`${base}/index.html#/platform/supervisors`);
        await page.getByRole("button", { name: "Crear supervisor", exact: true }).click();
        await page.getByLabel("Nombre", { exact: true }).fill("Auditor"); await page.getByLabel("Correo", { exact: true }).fill("auditor@example.test"); await page.getByLabel("Contraseña inicial", { exact: true }).fill("browser-test-password");
        try { await expect(page.getByRole("listbox").locator('option')).toHaveCount(1); }
        catch (error) { await page.screenshot({ path: path.join(artifacts, 'supervisor-form.png'), fullPage: true }); console.error('Fixture paths:', paths); throw error; }
        await page.getByRole("listbox").selectOption({ label: "Auditor" });
        await page.getByRole("checkbox", { name: "Residencial Jardines (Organización)", exact: true }).check();
        await page.getByRole("button", { name: "Guardar supervisor", exact: true }).click();
        await expect(page.getByRole("status").filter({ hasText: "Cambios guardados" })).toBeVisible();
        assert.deepEqual(writes[1].body.scope.organizationIds, [account.id]);
        await page.goto(`${base}/index.html#/platform/policies`); await page.getByRole("button", { name: "Nueva política", exact: true }).click();
        await page.getByLabel("Nombre", { exact: true }).fill("Cumplimiento"); await page.getByRole("checkbox", { name: "Consultar KPIs", exact: true }).check();
        await page.getByRole("button", { name: "Guardar política", exact: true }).click(); await expect(page.getByRole("status").filter({ hasText: "Cambios guardados" })).toBeVisible();
        assert.deepEqual(writes[2].body.permissions, ["platform.kpis.read"]);
      }
      await page.goto(`${base}/index.html#/platform/organizations/${account.id}/access`);
      await expect(page.getByRole("heading", { name: "Políticas y alcance", exact: true })).toBeVisible();
      if (readOnly) await expect(page.getByRole("button", { name: /Nueva política$/ })).toBeDisabled();
      assert.deepEqual(errors, [], "Browser runtime errors");
      await context.close();
    }
    console.log("PASS: desktop/mobile KPIs, membership editing, supervisor delegation, policy creation, read-only supervisor, organization policy editor; all APIs mocked.");
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
