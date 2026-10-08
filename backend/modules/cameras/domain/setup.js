"use strict";
const { isIPv4 } = require("node:net");
const { exactObject } = require("../../iot/application/inventoryService");
const { apiError } = require("../../../service/iotService");
const invalid = () => apiError("CAMERA_SETUP_INVALID", "Revisa marca, modelo, canal y conexión de la cámara", 422);
function privateHost(value) {
  if (typeof value !== "string" || !isIPv4(value)) return false;
  const [a, b] = value.split(".").map(Number);
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}
function cameraSetup(input) {
  exactObject(input, ["manufacturer", "model", "firmware", "sourceKind", "channel", "motionDeclaration", "connection"]);
  const text = (value, max, required = true) => {
    if (value === undefined && !required) return "";
    if (typeof value !== "string" || value.length > max || /[\x00-\x1f]/.test(value) || (required && !value.trim())) throw invalid();
    return value.trim();
  };
  const manufacturer = text(input.manufacturer, 80), model = text(input.model, 120), firmware = text(input.firmware, 80, false);
  if (!["IP_CAMERA", "DVR_NVR"].includes(input.sourceKind) || !Number.isInteger(input.channel) || input.channel < 1 || input.channel > 256 ||
      !["YES", "NO", "UNKNOWN"].includes(input.motionDeclaration)) throw invalid();
  exactObject(input.connection, ["host", "port", "path", "username", "password"]);
  const c = input.connection;
  if (!privateHost(c.host) || !Number.isInteger(c.port) || c.port < 1 || c.port > 65535 || typeof c.path !== "string" ||
      c.path.length > 1024 || !c.path.startsWith("/") || c.path.startsWith("//") || /[\s\x00-\x1f#@]/.test(c.path) ||
      typeof c.username !== "string" || c.username.length > 128 || typeof c.password !== "string" || c.password.length > 256 ||
      /[\x00-\x1f]/.test(c.username + c.password) || (c.password && !c.username)) throw invalid();
  const rtsp = new URL(`rtsp://${c.host}:${c.port}${c.path}`);
  rtsp.username = c.username; rtsp.password = c.password;
  return { metadata: { manufacturer, model, firmware, sourceKind: input.sourceKind, channel: input.channel,
    motionDeclaration: input.motionDeclaration }, rtspSource: rtsp.href };
}
module.exports = { cameraSetup, privateHost };
