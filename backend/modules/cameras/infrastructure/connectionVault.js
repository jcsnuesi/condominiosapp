"use strict";
const { createCipheriv, createDecipheriv, randomBytes, createHmac } = require("node:crypto");
const { apiError } = require("../../../service/iotService");
class CameraConnectionVault {
  constructor(key = process.env.CAMERA_CONNECTION_ENCRYPTION_KEY) {
    if (typeof key !== "string" || !/^[A-Za-z0-9+/]{43}=$/.test(key) || Buffer.from(key, "base64").length !== 32)
      throw apiError("CAMERA_SETUP_UNCONFIGURED", "El registro guiado necesita configuración segura del gateway", 503);
    this.key = Buffer.from(key, "base64");
  }
  fingerprint(value) { return createHmac("sha256", this.key).update(JSON.stringify(value)).digest("hex"); }
  seal(cameraId, source) {
    const iv = randomBytes(12), cipher = createCipheriv("aes-256-gcm", this.key, iv);
    cipher.setAAD(Buffer.from(`camera:${cameraId}`));
    const bytes = Buffer.concat([cipher.update(source, "utf8"), cipher.final()]);
    return ["v1", iv.toString("base64"), cipher.getAuthTag().toString("base64"), bytes.toString("base64")].join(".");
  }
  open(cameraId, sealed) {
    try {
      const [version, iv, tag, bytes, extra] = sealed.split(".");
      if (version !== "v1" || extra || !iv || !tag || !bytes) throw new Error();
      const decipher = createDecipheriv("aes-256-gcm", this.key, Buffer.from(iv, "base64"));
      decipher.setAAD(Buffer.from(`camera:${cameraId}`)); decipher.setAuthTag(Buffer.from(tag, "base64"));
      return Buffer.concat([decipher.update(Buffer.from(bytes, "base64")), decipher.final()]).toString("utf8");
    } catch { throw apiError("CAMERA_CONNECTION_UNAVAILABLE", "No se pudo recuperar la conexión protegida", 503); }
  }
}
module.exports = { CameraConnectionVault };
