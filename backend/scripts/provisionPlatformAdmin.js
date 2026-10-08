"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/platformUser");

async function provision({ env = process.env, userModel = User, accountModels, hash = bcrypt.hash } = {}) {
  if (await userModel.exists({ role: "PLATFORM_ADMIN" })) return false;
  const email = String(env.PLATFORM_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = env.PLATFORM_ADMIN_PASSWORD || "";
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 12 || password.length > 128) throw new Error("Configura PLATFORM_ADMIN_EMAIL y PLATFORM_ADMIN_PASSWORD (12–128 caracteres)");
  const models = accountModels || [...new Set(Object.values(require("../service/authorization").ACCOUNT_MODELS))];
  for (const Model of models) if (await Model.exists({ email })) {
    if (await userModel.exists({ role: "PLATFORM_ADMIN" })) return false;
    throw new Error("El correo ya está registrado; no se modificó ninguna cuenta");
  }
  try {
    await userModel.create({ email, password: await hash(password, 12), name: env.PLATFORM_ADMIN_NAME || "Administración SaaS", lastname: env.PLATFORM_ADMIN_LASTNAME || "", phone: env.PLATFORM_ADMIN_PHONE || "", role: "PLATFORM_ADMIN", status: "active", scope: { mode: "ALL" } });
  } catch (error) {
    // El índice único permite que varios contenedores arranquen simultáneamente.
    if (error.code === 11000 && await userModel.exists({ role: "PLATFORM_ADMIN" })) return false;
    throw error;
  }
  return true;
}

async function main() {
  require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
  if (!process.env.MONGODB_URI) throw new Error("Configura MONGODB_URI");
  await mongoose.connect(process.env.MONGODB_URI);
  await User.init();
  const created = await provision();
  console.log(created ? "Administrador de plataforma creado. Inicia sesión desde la plataforma." : "El administrador de plataforma ya existe. Bootstrap completado sin cambios.");
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
module.exports = { provision };
