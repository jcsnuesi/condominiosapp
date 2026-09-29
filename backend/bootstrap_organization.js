"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const Organization = require("./models/organization");
const Admin = require("./models/admin");
const Superuser = require("./models/super_user");
const AccessPolicy = require("./models/accessPolicy");
const AuthorizationAudit = require("./models/authorizationAudit");
const { STANDARD_POLICIES } = require("./service/permissionCatalog");

const mongoUri = process.env.MONGODB_URI || "mongodb://admin:adminpassword123@127.0.0.1:27017/condominios_iam?authSource=admin&replicaSet=rs0";
const organizationName = process.env.BOOTSTRAP_ORGANIZATION_NAME || "Condominios App";
const organizationEmail = (process.env.BOOTSTRAP_ORGANIZATION_EMAIL || "admin@condominios.local").toLowerCase();
const adminEmail = (process.env.BOOTSTRAP_ADMIN_EMAIL || organizationEmail).toLowerCase();
const superuserEmail = (process.env.BOOTSTRAP_SUPERUSER_EMAIL || "superuser@condominios.local").toLowerCase();
const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || crypto.randomBytes(18).toString("base64url");
const superuserPassword = process.env.BOOTSTRAP_SUPERUSER_PASSWORD || crypto.randomBytes(18).toString("base64url");

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function bootstrap() {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  try {
    const exists = await Organization.exists({ slug: slugify(organizationName) });
    if (exists) throw new Error("La organización inicial ya existe; el bootstrap no sobrescribe datos.");

    await mongoose.connection.transaction(async (session) => {
      let superuser = await Superuser.findOne({ email: superuserEmail }).session(session);
      if (!superuser) {
        [superuser] = await Superuser.create([{
          name: "System",
          lastname: "Administrator",
          gender: "n/a",
          email: superuserEmail,
          password: await bcrypt.hash(superuserPassword, 10),
          phone: "0000000000",
          role: "SUPERUSER",
        }], { session, ordered: true });
      }

      const [organization] = await Organization.create([{
        name: organizationName,
        slug: slugify(organizationName),
        email: organizationEmail,
        phone: [],
        address: { city: "Santo Domingo", state: "Distrito Nacional", country: "República Dominicana" },
        provisionedBy: superuser._id,
        status: "provisioning",
      }], { session, ordered: true });

      const [admin] = await Admin.create([{
        organizationId: organization._id,
        company: organizationName,
        phone: [],
        street_1: "N/A",
        city: "Santo Domingo",
        state: "Distrito Nacional",
        country: "República Dominicana",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        contact_person: [{
          name_contact: "Organization",
          lastname_contact: "Administrator",
          gender_contact: "n/a",
          email_contact: adminEmail,
          phone_contact: [],
          role_contact: "admin",
        }],
        role: "ADMIN",
        status: "active",
        verified: true,
        terms: true,
        first_password_changed: false,
      }], { session, ordered: true });

      await AccessPolicy.create(STANDARD_POLICIES.map((policy) => ({
        ...policy,
        organizationId: organization._id,
        isSystem: true,
        status: "active",
        createdBy: admin._id,
      })), { session, ordered: true });

      organization.ownerAdminId = admin._id;
      organization.status = "active";
      organization.provisionedAt = new Date();
      await organization.save({ session });
      await AuthorizationAudit.create([{
        organizationId: organization._id,
        actorId: superuser._id,
        actorRole: "SUPERUSER",
        action: "organization.bootstrap",
        targetType: "Organization",
        targetId: organization._id,
        after: { organizationId: organization._id, ownerAdminId: admin._id },
        ip: "bootstrap",
        userAgent: "bootstrap_organization.js",
      }], { session, ordered: true });
    });

    console.log(JSON.stringify({
      organization: organizationName,
      admin: { email: adminEmail, password: adminPassword },
      superuser: { email: superuserEmail, password: superuserPassword },
    }));
  } finally {
    await mongoose.disconnect();
  }
}

bootstrap().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
