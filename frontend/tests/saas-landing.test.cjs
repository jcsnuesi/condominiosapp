"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { accountDestination } = require("../src/app/demo/components/saas-landing/account-destination.ts");

function token(user, exp = 2000) {
  return `header.${Buffer.from(JSON.stringify({ sub: user._id, role: user.role, exp })).toString("base64url")}.signature`;
}

test("account navigation respects session expiry, role and account context", () => {
  const admin = { _id: "admin", role: "ADMIN", organizationId: "org" };
  assert.deepEqual(accountDestination(admin, token(admin), { onboardingRequired: true }, 1000), ["/onboarding"]);
  assert.deepEqual(accountDestination(admin, token(admin), { onboardingRequired: false }, 1000), ["/start", "admin"]);
  for (const role of ["OWNER", "STAFF_ADMIN", "STAFF", "FAMILY"]) {
    const user = { _id: role, role, organizationId: "org" };
    assert.deepEqual(accountDestination(user, token(user), null, 1000), ["/start", role]);
  }
  const personal = { _id: "owner", role: "OWNER", organizationId: null };
  assert.deepEqual(accountDestination(personal, token(personal), null, 1000), ["/smart-home"]);
  assert.equal(accountDestination(admin, token(admin, 1000), null, 1000), null);
  assert.equal(accountDestination(admin, token(personal), null, 1000), null);
  assert.equal(accountDestination(admin, "invalid", null, 1000), null);
  assert.equal(accountDestination(null, "", null, 1000), null);
  assert.equal(accountDestination({ _id: "old", role: "SUPERUSER" }, token({ _id: "old", role: "SUPERUSER" }), null, 1000), null);
});

function playwright() {
  try { return { ...require("playwright"), expect: require("playwright/test").expect }; } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw error;
    const cache = path.join(process.env.LOCALAPPDATA, "npm-cache", "_npx");
    const candidate = fs.readdirSync(cache).map(name => path.join(cache, name, "node_modules", "playwright"))
      .find(dir => fs.existsSync(path.join(dir, "package.json")));
    if (!candidate) throw error;
    return { ...require(candidate), expect: require(path.join(candidate, "test")).expect };
  }
}

test("published build: public routes, responsive interactions and registration choices", { timeout: 120000 }, async () => {
  const root = path.resolve(process.env.LANDING_BUILD || "frontend/dist/saas-landing-production");
  assert.ok(fs.existsSync(path.join(root, "index.html")), "Compile the review build first");
  const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".ttf": "font/ttf", ".woff2": "font/woff2" };
  const server = http.createServer((req, res) => {
    const name = path.resolve(root, "." + decodeURIComponent(new URL(req.url, "http://local").pathname));
    if (!name.startsWith(root + path.sep) && name !== root) { res.writeHead(403).end(); return; }
    const file = name === root ? path.join(root, "index.html") : name;
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
    res.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browserRoot = path.join(process.env.LOCALAPPDATA, "ms-playwright");
  const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH || fs.readdirSync(browserRoot)
    .filter(name => /^chromium-\d+$/.test(name)).sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))
    .map(name => path.join(browserRoot, name, "chrome-win64", "chrome.exe")).find(file => fs.existsSync(file));
  let browser;
  const artifacts = path.resolve("e2e-reports/saas-landing");
  fs.mkdirSync(artifacts, { recursive: true });
  try {
    const { chromium, expect } = playwright();
    browser = await chromium.launch({ headless: true, executablePath });
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    const landingFailures = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => {
      if (response.status() >= 400 && /\/assets\/landing\//.test(response.url())) landingFailures.push(response.url());
    });
    for (const width of [1440, 1024, 768, 390, 360, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + "/#/");
      await page.reload();
      await page.getByRole("heading", { level: 1, name: /Más orden para tu comunidad/ }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
      assert.equal(await page.locator('.hero-photo img').getAttribute('fetchpriority'), 'high');
      assert.notEqual(await page.locator('.hero-photo img').getAttribute('loading'), 'lazy');
      await page.screenshot({ path: path.join(artifacts, `landing-${width}.png`), fullPage: true });
      await page.screenshot({ path: path.join(artifacts, `landing-${width}-viewport.png`) });
      assert.equal(await page.locator(".layout-sidebar").count(), 0);
      assert.ok(await page.title().then(title => title.includes("CondominiosApp")));
      assert.ok(await page.locator('meta[name="description"]').getAttribute("content"));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px`);
      const heroButton = page.locator(".hero-actions").getByRole("link", { name: "Crear cuenta" });
      assert.ok(await heroButton.evaluate(el => el.getBoundingClientRect().bottom <= innerHeight), `CTA above fold at ${width}px`);
      for (const link of await page.getByRole("link", { name: /Crear cuenta/ }).all()) {
        assert.match(await link.getAttribute("href"), /#\/auth\/register$/);
      }
      for (const name of ["Reservas", "Documentos", "Smart Home", "Finanzas"]) {
        const tab = page.getByRole("tab", { name, exact: true });
        await tab.click();
        await expect(tab).toHaveAttribute("aria-selected", "true");
        await expect(page.getByRole("tabpanel")).toHaveCount(1);
      }
      await page.getByRole("tab", { name: "Finanzas", exact: true }).focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("tab", { name: "Reservas", exact: true })).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("End");
      await expect(page.getByRole("tab", { name: "Smart Home", exact: true })).toHaveAttribute("aria-selected", "true");
      await expect(page).toHaveURL(/vista=home/);
      await page.reload();
      await expect(page.getByRole("tab", { name: "Smart Home", exact: true })).toHaveAttribute("aria-selected", "true");
      for (const summary of await page.locator("summary").all()) {
        await summary.focus();
        await page.keyboard.press("Enter");
        assert.ok(await summary.evaluate(el => el.parentElement.open));
        await page.keyboard.press("Enter");
      }
      if (width <= 960) {
        const toggle = page.getByRole("button", { name: /^(Menú|Cerrar menú)$/ });
        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: "Servicios", exact: true }).focus();
        await page.keyboard.press('Escape');
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(toggle).toBeFocused();
        await toggle.click();
        await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: "Servicios", exact: true }).click();
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(page).toHaveURL(/#\/#servicios$/);
      }
      await page.goto(base + "/#/");
      await page.reload();
      await page.getByRole("heading", { level: 1, name: /Más orden para tu comunidad/ }).waitFor();
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("main")).toBeFocused();
      await page.locator("#como-comenzar").screenshot({ path: path.join(artifacts, `journey-${width}.png`), style: '.site-header, .skip-link { visibility: hidden !important; }' });
      // Las capturas de página completa han provocado la carga de imágenes diferidas.
      assert.ok(await page.locator('.saas-page img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)), 'Every landing image loads');
      assert.ok(await page.evaluate(() => document.fonts.check('700 16px "Landing Manrope"')), 'Local heading font loads');
    }
    await page.goto(base + "/#/landing");
    await page.getByRole("heading", { level: 1, name: /Más orden para tu comunidad/ }).waitFor();
    await expect(page).toHaveURL(base + "/#/");
    await page.locator(".hero-actions").getByRole("link", { name: "Crear cuenta" }).click();
    const requests = [];
    await page.route("**/api/**", async route => {
      assert.equal(new URL(route.request().url()).origin, base, "API requests must use the frontend origin, never the visitor's loopback address");
      requests.push(new URL(route.request().url()).pathname);
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: {} }) });
    });
    await page.getByRole("button", { name: /Administrar condominios/ }).click();
    await page.getByRole("heading", { name: "Crea tu acceso" }).waitFor();
    await page.getByLabel("Nombre", { exact: true }).fill("Lucía");
    await page.getByLabel("Apellido", { exact: true }).fill("Méndez");
    await page.getByLabel("Correo electrónico", { exact: true }).fill("landing-admin@example.invalid");
    await page.getByLabel(/^Teléfono/).fill("8095550100");
    await page.getByLabel(/^Contraseña/).fill("ReviewAccount123!");
    await page.getByRole("button", { name: /Continuar/ }).click();
    await page.getByRole("heading", { name: "Tu organización" }).waitFor();
    for (const [name, value] of [["Nombre de la organización", "Administración Jardines"], ["Dirección", "Calle Jardines 12"], ["Ciudad", "Santo Domingo"], ["Provincia", "Distrito Nacional"]]) {
      await page.getByLabel(name, { exact: true }).fill(value);
    }
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Crear cuenta ADMIN" }).click();
    await page.getByRole("heading", { name: "Revisa tu correo" }).waitFor();
    assert.ok(requests.includes("/api/auth/admin/register"));
    await page.goto(base + "/#/auth/register");
    await page.reload();
    await page.getByRole("link", { name: /Gestionar mi vivienda/ }).click();
    await page.getByRole("heading", { name: "Crea tu cuenta personal" }).waitFor();
    await page.getByLabel("Nombre", { exact: true }).fill("Rafael");
    await page.getByLabel("Apellido", { exact: true }).fill("Núñez");
    await page.getByLabel("Correo electrónico", { exact: true }).fill("landing-owner@example.invalid");
    await page.getByLabel("Teléfono", { exact: true }).fill("8095550101");
    await page.getByLabel("Contraseña (12 a 128 caracteres)", { exact: true }).fill("ReviewAccount123!");
    await page.getByLabel("Nombre de tu vivienda", { exact: true }).fill("Casa Jardines");
    await page.getByRole("button", { name: "Crear cuenta personal", exact: true }).click();
    await page.getByRole("heading", { name: "Revisa tu correo" }).waitFor();
    assert.ok(requests.includes("/api/iot/owners/register"));
    for (const type of ["admin", "owner"]) {
      await page.goto(base + `/#/auth/verify/${type}/${"a".repeat(64)}`);
      await page.reload();
      await page.getByRole("button", { name: "Verificar mi cuenta" }).click();
      await page.getByRole("heading", { name: "Tu cuenta está lista" }).waitFor();
    }
    await page.goto(base + "/#/auth/login");
    await page.getByRole("link", { name: "Conocer CondominiosApp" }).click();
    await page.getByRole("heading", { level: 1, name: /Más orden para tu comunidad/ }).waitFor();
    assert.deepEqual(errors, [], "No browser runtime errors");
    assert.deepEqual(landingFailures, [], 'No broken landing assets');
    await context.close();
    for (const [user, access, destination] of [
      [{ _id: "admin", role: "ADMIN", organizationId: "org" }, { onboardingRequired: true }, "/onboarding"],
      [{ _id: "admin", role: "ADMIN", organizationId: "org" }, { onboardingRequired: false }, "/start/admin"],
      [{ _id: "owner", role: "OWNER" }, {}, "/smart-home"],
      [{ _id: "resident", role: "OWNER", organizationId: "org" }, {}, "/start/resident"],
    ]) {
      const session = await browser.newContext();
      await session.addCookies(Object.entries({ identity: JSON.stringify(user), token: token(user, Math.floor(Date.now()/1000) + 3600), access_context: JSON.stringify(access) }).map(([name, value]) => ({ name, value, url: base })));
      const account = await session.newPage();
      await account.goto(base + "/#/");
      const link = account.getByRole("link", { name: "Ir a mi cuenta" });
      await link.waitFor({ state: "attached" });
      assert.equal(await link.getAttribute("href"), "#" + destination);
      await session.close();
    }
    console.log(`Screenshots: ${artifacts}`);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
