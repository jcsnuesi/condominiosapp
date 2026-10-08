"use strict";
const http = require("node:http");
const fs = require("node:fs/promises");
async function startProxy(config) {
  const target = new URL(config.apiOrigin);
  if (target.protocol !== "https:" || target.username || target.password || target.search || target.hash ||
    typeof config.serviceKey !== "string" || config.serviceKey.length < 32) throw new Error("MEDIA_AUTH_CONFIG_INVALID");
  const server = http.createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== "/auth") { res.writeHead(403); res.end(); return; }
    try {
      let body = "", bytes = 0;
      for await (const chunk of req) { bytes += chunk.length; if (bytes > 8192) throw new Error("MEDIA_AUTH_TOO_LARGE"); body += chunk; }
      const upstream = await fetch(`${target.href.replace(/\/$/, "")}/internal/camera-media/auth`, {
        method: "POST", headers: { "content-type": "application/json", "x-comunard-media-key": config.serviceKey },
        body, redirect: "error", signal: AbortSignal.timeout(5000) });
      res.writeHead(upstream.ok ? 200 : 403); res.end();
    } catch { res.writeHead(403); res.end(); }
  });
  server.requestTimeout = 5000;
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(8090, "127.0.0.1", resolve); });
  return server;
}
if (require.main === module) {
  (async () => {
    const file = process.argv[2], info = await fs.lstat(file);
    if (!info.isFile() || info.isSymbolicLink() || info.size > 16384) throw new Error("MEDIA_AUTH_CONFIG_INVALID");
    await startProxy(JSON.parse(await fs.readFile(file, "utf8")));
  })().catch(() => { process.stderr.write("MEDIA_AUTH_PROXY_START_FAILED\n"); process.exitCode = 1; });
}
module.exports = { startProxy };
