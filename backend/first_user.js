"use strict";

const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const bcrypt = require("bcrypt");
const generatePassword = require("generate-password");
const mongoose = require("mongoose");
const Admin = require("./models/admin");

const saltRounds = 10;

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error(
    "MONGODB_URI no esta definida. Verifica backend/.env o exporta la variable antes de ejecutar first_user.js."
  );
}

function valueFromEnv(name, fallback) {
  return process.env[name] && process.env[name].trim()
    ? process.env[name].trim()
    : fallback;
}

function createPlainPassword() {
  return (
    process.env.FIRST_USER_PASSWORD ||
    generatePassword.generate({
      length: 14,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    })
  );
}

async function createFirstUser() {
  const plainPassword = createPlainPassword();
  const email = valueFromEnv(
    "FIRST_USER_EMAIL",
    "admin@condominios.local"
  ).toLowerCase();

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  // const adminCount = await Admin.countDocuments();

  // if (adminCount > 0) {
  //   console.log(
  //     "Ya existe al menos un usuario ADMIN. No se creo un nuevo usuario."
  //   );
  //   await mongoose.connection.close();
  //   return;
  // }

  const password = await bcrypt.hash(plainPassword, saltRounds);

  const user = await Admin.create({
    avatar: "noimage.jpeg",
    company: valueFromEnv(
      "FIRST_USER_COMPANY",
      "condominios app"
    ).toLowerCase(),
    rnc: valueFromEnv("FIRST_USER_RNC", "000000000"),
    phone: [valueFromEnv("FIRST_USER_PHONE", "0000000000")],
    street_1: valueFromEnv(
      "FIRST_USER_STREET_1",
      "default street"
    ).toLowerCase(),
    street_2: valueFromEnv("FIRST_USER_STREET_2", ""),
    city: valueFromEnv("FIRST_USER_CITY", "santo domingo").toLowerCase(),
    state: valueFromEnv("FIRST_USER_STATE", "distrito nacional").toLowerCase(),
    zipcode: valueFromEnv("FIRST_USER_ZIPCODE", "00000"),
    country: valueFromEnv(
      "FIRST_USER_COUNTRY",
      "republica dominicana"
    ).toLowerCase(),
    first_password_changed: false,
    email,
    password,
    contact_person: [
      {
        name_contact: valueFromEnv(
          "FIRST_USER_CONTACT_NAME",
          "admin"
        ).toLowerCase(),
        lastname_contact: valueFromEnv(
          "FIRST_USER_CONTACT_LASTNAME",
          "system"
        ).toLowerCase(),
        gender_contact: valueFromEnv(
          "FIRST_USER_CONTACT_GENDER",
          "n/a"
        ).toLowerCase(),
        email_contact: valueFromEnv(
          "FIRST_USER_CONTACT_EMAIL",
          email
        ).toLowerCase(),
        phone_contact: [valueFromEnv("FIRST_USER_CONTACT_PHONE", "0000000000")],
        role_contact: valueFromEnv(
          "FIRST_USER_CONTACT_ROLE",
          "admin"
        ).toLowerCase(),
      },
    ],
    role: "ADMIN",
    status: "active",
    verified: true,
    terms: true,
  });

  console.log("Primer usuario creado correctamente.");
  console.log(`user: ${user.email}`);
  console.log(`pass: ${(123456789).toString()}`);

  await mongoose.connection.close();
}

createFirstUser().catch(async (error) => {
  console.error("Error creando el primer usuario:", error.message);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  process.exitCode = 1;
});
