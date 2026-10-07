"use strict";
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const dgram = require("node:dgram");
const tls = require("node:tls");

async function main() {
  assert.equal((await fetch("http://call-service:4000/health")).status, 200);
  const request = Buffer.alloc(20);
  request.writeUInt16BE(1, 0);
  request.writeUInt32BE(0x2112a442, 4);
  crypto.randomBytes(12).copy(request, 8);
  const udp = dgram.createSocket("udp4");
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("TURN UDP timeout")), 5000);
      udp.once("error", reject);
      udp.once("message", (response) => {
        clearTimeout(timer);
        try {
          assert.equal(response.readUInt16BE(0), 0x0101);
          assert.deepEqual(response.subarray(8, 20), request.subarray(8, 20));
          resolve();
        } catch (error) { reject(error); }
      });
      udp.send(request, 3478, "coturn");
    });
  } finally { udp.close(); }
  await new Promise((resolve, reject) => {
    // The smoke test uses a self-signed certificate, never a production key.
    const socket = tls.connect({ host: "coturn", port: 5349, rejectUnauthorized: false });
    socket.setTimeout(5000, () => socket.destroy(new Error("TURN TLS timeout")));
    socket.once("error", reject);
    socket.once("secureConnect", () => { socket.end(); resolve(); });
  });
  console.log("PASS: call-service /health, coturn UDP STUN and TLS handshake");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
