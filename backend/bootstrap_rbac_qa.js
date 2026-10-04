"use strict";

/**
 * Creates one isolated QA organization for the RBAC Playwright audit.
 * It never updates an existing organization. Passwords must be supplied via
 * environment variables and are intentionally never printed or persisted.
 */

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const Organization = require("./models/organization");
const Admin = require("./models/admin");
const StaffAdmin = require("./models/staff_admin");
const Staff = require("./models/staff");
const Condominium = require("./models/condominio");
const AccessPolicy = require("./models/accessPolicy");
const AccessGrant = require("./models/accessGrant");
const AuthorizationAudit = require("./models/authorizationAudit");
const { PERMISSIONS } = require("./service/permissionCatalog");

const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb://admin:adminpassword123@127.0.0.1:27017/condominios_iam?authSource=admin&replicaSet=rs0";
const runId = String(
  process.env.QA_RUN_ID ||
    new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14)
);
const domain = process.env.QA_EMAIL_DOMAIN || "qa.condominios.local";
const prefix = `rbac-${runId}`.toLowerCase();
const organizationName = `QA RBAC ${runId}`;
const requiredPasswords = [
  "QA_ADMIN_PASSWORD",
  "QA_STAFF_ADMIN_PASSWORD",
  "QA_STAFF_PASSWORD",
];

function requiredPassword(name) {
  const value = process.env[name];
  if (!value || value.length < 12)
    throw new Error(`${name} must contain at least 12 characters`);
  return value;
}

async function main() {
  const [adminPassword, staffAdminPassword, staffPassword] =
    requiredPasswords.map(requiredPassword);
  const emails = {
    admin: `${prefix}-admin@${domain}`,
    staffAdmin: `${prefix}-staff-admin@${domain}`,
    staff: `${prefix}-staff@${domain}`,
  };
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10_000 });
  try {
    if (await Organization.exists({ slug: prefix }))
      throw new Error(
        `QA organization ${prefix} already exists; choose another QA_RUN_ID.`
      );
    await mongoose.connection.transaction(async (session) => {
      const [organization] = await Organization.create(
        [
          {
            name: organizationName,
            slug: prefix,
            email: emails.admin,
            phone: ["8090000000"],
            address: {
              city: "Santo Domingo",
              state: "Distrito Nacional",
              country: "República Dominicana",
            },
            registrationSource: "BOOTSTRAP",
            status: "provisioning",
          },
        ],
        { session }
      );
      const [admin] = await Admin.create(
        [
          {
            organizationId: organization._id,
            company: organizationName,
            phone: ["8090000000"],
            street_1: "QA Avenue 1",
            city: "Santo Domingo",
            state: "Distrito Nacional",
            country: "República Dominicana",
            email: emails.admin,
            password: await bcrypt.hash(adminPassword, 10),
            role: "ADMIN",
            status: "active",
            verified: true,
            terms: true,
            contact_person: [
              {
                name_contact: "QA",
                lastname_contact: "Admin",
                gender_contact: "n/a",
                email_contact: emails.admin,
                phone_contact: ["8090000000"],
                role_contact: "admin",
              },
            ],
          },
        ],
        { session }
      );
      const [condominium] = await Condominium.create(
        [
          {
            organizationId: organization._id,
            alias: `QA Condo ${runId}`,
            typeOfProperty: "Condominium",
            phone: "8090000000",
            street_1: "QA Avenue 1",
            sector_name: "QA",
            availableUnits: ["QA-101"],
            city: "Santo Domingo",
            province: "Distrito Nacional",
            country: "República Dominicana",
            socialAreas: ["QA Lounge"],
            mPayment: 1,
            paymentDate: new Date(),
            invoiceDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdBy: admin._id,
          },
        ],
        { session }
      );
      const [operationsPolicy, readOnlyPolicy] = await AccessPolicy.create(
        [
          {
            organizationId: organization._id,
            key: "QA_OPERATIONS",
            name: "QA Operations",
            description: "All operational permissions for staff_admin QA.",
            permissions: PERMISSIONS,
            isSystem: true,
            status: "active",
            createdBy: admin._id,
          },
          {
            organizationId: organization._id,
            key: "QA_READ_ONLY",
            name: "QA Read Only",
            description: "Read-only scope verification for staff QA.",
            permissions: PERMISSIONS.filter((permission) =>
              permission.endsWith(".read")
            ),
            isSystem: true,
            status: "active",
            createdBy: admin._id,
          },
        ],
        { session, ordered: true }
      );
      const [staffAdmin] = await StaffAdmin.create(
        [
          {
            organizationId: organization._id,
            createdBy: admin._id,
            name: "QA",
            lastname: "Staff Admin",
            gender: "n/a",
            email: emails.staffAdmin,
            password: await bcrypt.hash(staffAdminPassword, 10),
            phone: "8090000001",
            position: "Operations",
            status: "active",
            role: "STAFF_ADMIN",
            permissions: ["read", "create", "update", "delete"],
          },
        ],
        { session }
      );
      const [staff] = await Staff.create(
        [
          {
            organizationId: organization._id,
            createdBy: admin._id,
            condo_id: condominium._id,
            name: "QA",
            lastname: "Staff",
            gender: "n/a",
            email: emails.staff,
            password: await bcrypt.hash(staffPassword, 10),
            phone: "8090000002",
            position: "Reception",
            status: "active",
            role: "STAFF",
            permissions: ["read"],
          },
        ],
        { session }
      );
      await AccessGrant.create(
        [
          {
            organizationId: organization._id,
            subjectModel: "Staff_Admin",
            subjectId: staffAdmin._id,
            policyIds: [operationsPolicy._id],
            overrides: { allow: [], deny: [] },
            scope: { mode: "ALL", condominiumIds: [] },
            updatedBy: admin._id,
          },
          {
            organizationId: organization._id,
            subjectModel: "Staff",
            subjectId: staff._id,
            policyIds: [readOnlyPolicy._id],
            overrides: { allow: [], deny: [] },
            scope: { mode: "SELECTED", condominiumIds: [condominium._id] },
            updatedBy: admin._id,
          },
        ],
        { session, ordered: true }
      );
      organization.ownerAdminId = admin._id;
      organization.provisionedBy = admin._id;
      organization.status = "active";
      organization.provisionedAt = new Date();
      await organization.save({ session });
      await AuthorizationAudit.create(
        [
          {
            organizationId: organization._id,
            actorId: admin._id,
            actorRole: "ADMIN",
            action: "qa.rbac.bootstrap",
            targetType: "Organization",
            targetId: organization._id,
            after: {
              runId,
              adminId: admin._id,
              staffAdminId: staffAdmin._id,
              staffId: staff._id,
              condominiumId: condominium._id,
            },
            ip: "bootstrap",
            userAgent: "bootstrap_rbac_qa.js",
          },
        ],
        { session }
      );
    });
    console.log(
      JSON.stringify({
        runId,
        organization: organizationName,
        emails,
        roles: ["ADMIN", "STAFF_ADMIN", "STAFF"],
        note: "Passwords intentionally omitted",
      })
    );
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
