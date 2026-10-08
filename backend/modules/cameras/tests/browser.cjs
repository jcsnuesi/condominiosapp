"use strict";
// Local UI smoke: synthetic identity, loopback server, no database/hardware/AWS.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
function playwright() {
  try { return require("playwright"); } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw error;
    const cache = path.join(process.env.LOCALAPPDATA, "npm-cache", "_npx");
    for (const folder of fs.readdirSync(cache)) {
      const candidate = path.join(cache, folder, "node_modules", "playwright");
      if (fs.existsSync(path.join(candidate, "package.json"))) return require(candidate);
    }
    throw error;
  }
}
const root = path.resolve(__dirname, "../../../.."), build = path.join(root, "tmp/camera-frontend-build");
const cameraId = "c".repeat(24), gatewayId = "b".repeat(24), condoId = "a".repeat(24);
const access = { organization: { id: "organization", name: "Prueba local", status: "active" }, isOwnerAdmin: true,
  permissions: ["cameras.read", "cameras.manage", "cameras.live", "cameras.recordings.read", "iot.read"], scope: { mode: "ALL", condominiumIds: [] } };
const identity = { _id: "synthetic-admin", role: "ADMIN", name: "Prueba", lastname: "Local", avatar: "noimage.jpeg", first_password_changed: true };
const token = `local.${Buffer.from(JSON.stringify({ sub: identity._id, role: "ADMIN", exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url")}.test`;
function send(res, data, status = 200) { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(data)); }
async function run() {
  assert.ok(fs.existsSync(path.join(build, "index.html")), "Build Angular development into tmp/camera-frontend-build first");
  let cameras = [], posted;
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    if (url.pathname.startsWith("/api/")) {
      let data = { notifications: [], items: [], unreadCount: 0 };
      if (url.pathname === "/api/auth/me") data = { user: identity, access };
      if (url.pathname === "/api/cameras/contexts") data = { contexts: [{ label: "Condominio de prueba · Áreas comunes", scope: { scopeType: "COMMON_AREA", condominiumId: condoId } }] };
      if (url.pathname === "/api/iot/gateways") data = { gateways: [{ id: gatewayId, displayName: "Gateway local", status: "ACTIVE" }] };
      if (url.pathname === "/api/cameras" && req.method === "GET") data = { cameras, nextCursor: null };
      if (url.pathname === "/api/cameras" && req.method === "POST") {
        let body = ""; for await (const chunk of req) body += chunk;
        posted = JSON.parse(body);
        cameras = [{ id: cameraId, displayName: posted.displayName, gatewayId, scopeType: "COMMON_AREA", protocol: "RTSP", status: "PROVISIONING",
          equipment: { ...posted.setup, connection: undefined }, motionStatus: posted.setup.motionDeclaration === "NO" ? "UNAVAILABLE" : "UNVERIFIED",
          recordingMode: posted.setup.motionDeclaration === "NO" ? "NONE" : "EVENT", configurationVersion: 1, createdAt: new Date().toISOString() }];
        data = { camera: cameras[0] };
      }
      if (url.pathname === `/api/cameras/${cameraId}` && req.method === "PATCH") {
        let body = ""; for await (const chunk of req) body += chunk;
        cameras[0].status = JSON.parse(body).status; data = { camera: cameras[0] };
      }
      if (url.pathname.endsWith("/activate")) return send(res, { success: false, code: "CAMERA_NOT_READY", data: null, error: { message: "No stream" } }, 409);
      return send(res, { success: true, data, error: null, code: "OK" });
    }
    let file = path.resolve(build, `.${decodeURIComponent(url.pathname)}`);
    if (!file.startsWith(build + path.sep)) file = path.join(build, "index.html");
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(build, "index.html");
    const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" };
    res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" }); fs.createReadStream(file).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    const binaries = path.join(process.env.LOCALAPPDATA, "ms-playwright");
    const executablePath = fs.readdirSync(binaries).filter((folder) => /^chromium-\d+$/.test(folder)).sort().reverse()
      .map((folder) => path.join(binaries, folder, "chrome-win64", "chrome.exe")).find(fs.existsSync);
    browser = await playwright().chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
      cameras = []; posted = undefined;
      const context = await browser.newContext({ viewport });
      await context.route("**/*", async (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      await context.addCookies([{ name: "identity", value: JSON.stringify(identity), url: origin }, { name: "token", value: token, url: origin },
        { name: "access_context", value: JSON.stringify(access), url: origin }]);
      const page = await context.newPage();
      await page.goto(`${origin}/#/cameras`);
      await page.getByRole("button", { name: "Agregar cámara", exact: true }).click();
      await page.getByRole("button", { name: "Continuar", exact: true }).click();
      await page.getByRole("alert").filter({ hasText: "Indica un nombre" }).waitFor();
      await page.getByLabel("Nombre de la cámara").fill("Entrada de prueba");
      await page.getByRole("button", { name: "Continuar", exact: true }).click();
      await page.getByLabel("Marca del grabador").fill("Hikvision");
      await page.getByLabel("Modelo", { exact: true }).fill("Modelo de prueba");
      await page.getByLabel("Canal de la cámara en el grabador").fill("2");
      await page.getByRole("button", { name: "Continuar", exact: true }).click();
      await page.getByLabel("IP local del DVR/NVR").fill("192.168.1.20");
      await page.getByRole("button", { name: "Sugerir ruta principal" }).click();
      await page.waitForFunction(() => document.querySelector('input[name="streamPath"]')?.value === "/Streaming/Channels/201");
      assert.equal(await page.getByLabel("Ruta de video RTSP").inputValue(), "/Streaming/Channels/201");
      await page.getByLabel("Usuario del equipo").fill("local-test");
      await page.getByLabel("Contraseña del equipo").fill("synthetic-private-password");
      await page.getByLabel("Contraseña del equipo").blur(); await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(root, `tmp/camera-wizard-${viewport.width}.png`), fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `No horizontal overflow at ${viewport.width}px`);
      await page.getByRole("button", { name: "Continuar", exact: true }).click();
      const declaration = viewport.width === 1280 ? "NO" : "UNKNOWN";
      await page.getByLabel("¿El equipo ofrece eventos de movimiento?").selectOption(declaration);
      await page.getByRole("button", { name: "Guardar cámara", exact: true }).click();
      await page.getByText(declaration === "NO" ? "Solo video en vivo" : "Eventos de movimiento sin verificar", { exact: true }).waitFor();
      assert.equal(posted.setup.manufacturer, "Hikvision"); assert.equal(posted.setup.channel, 2);
      assert.equal(posted.setup.motionDeclaration, declaration); assert.equal(posted.setup.connection.password, "synthetic-private-password");
      assert.equal(await page.getByText("synthetic-private-password", { exact: true }).count(), 0);
      await page.getByRole("button", { name: "Deshabilitar", exact: true }).click();
      await page.getByRole("button", { name: "Reconectar", exact: true }).click();
      await page.getByRole("button", { name: "Comprobar video", exact: true }).click();
      await page.getByRole("alert").filter({ hasText: "Todavía no llega video" }).waitFor();
      await page.getByRole("button", { name: "Revisar configuración", exact: true }).click();
      await page.getByRole("button", { name: "Continuar", exact: true }).click();
      assert.equal(await page.getByLabel("Contraseña del equipo").inputValue(), "");
      await context.close();
    }
    process.stdout.write("Camera wizard desktop/mobile smoke passed; no hardware/AWS calls.\n");
  } finally { await browser?.close(); await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }); }
}
run().catch((error) => { process.stderr.write(`${error.stack}\n`); process.exitCode = 1; });
