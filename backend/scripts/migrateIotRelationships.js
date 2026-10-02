"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const {
  runIoTRelationshipMigration,
} = require("../service/iotRelationshipMigration");

async function main() {
  const apply = process.argv.includes("--apply");
  if (
    apply &&
    process.env.IOT_RELATIONSHIP_MIGRATION_CONFIRM !==
      "APPLY_IOT_OWNER_UNIT_BACKFILL"
  ) {
    throw new Error(
      "Apply requires IOT_RELATIONSHIP_MIGRATION_CONFIRM=APPLY_IOT_OWNER_UNIT_BACKFILL"
    );
  }
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI must be set; refusing to use an implicit database"
    );
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  try {
    const summary = await runIoTRelationshipMigration({ apply });
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  process.stderr.write(
    `${error.code || "IOT_RELATIONSHIP_MIGRATION_FAILED"}: ${error.message}\n`
  );
  process.exitCode = 1;
});
