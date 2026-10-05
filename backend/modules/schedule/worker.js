"use strict";
require("dotenv").config();
const fs = require("node:fs/promises");
const mongoose = require("mongoose");
const { Schedule } = require("./infrastructure/models");
const { InternalSchedulerExecutor } = require("./application/executor");
const notices = require("./application/notifications");
const { cleanup } = require("../maintenance/evidence-cleanup");
const interval = Number(process.env.SCHEDULE_WORKER_INTERVAL_MS || 1800000);
const heartbeat =
  process.env.SCHEDULE_WORKER_HEARTBEAT || "/tmp/schedule-worker-heartbeat";
let running = false,
  stopped = false,
  timer,
  lastCleanup = 0;
async function tick() {
  if (running || stopped) return;
  running = true;
  const started = Date.now();
  let processed = 0,
    errors = 0;
  try {
    await mongoose.connection.db.admin().ping();
    await fs.writeFile(heartbeat, String(Date.now()));
    if (
      process.env.DISABLE_SCHEDULED_JOBS !== "true" &&
      process.env.SCHEDULE_MODULE_ENABLED !== "false"
    ) {
      const executor = new InternalSchedulerExecutor();
      const schedules = await Schedule.find({
        isActive: true,
        nextActionAt: { $lte: new Date() },
      })
        .select("_id")
        .sort({ nextActionAt: 1 })
        .limit(200)
        .lean();
      for (const schedule of schedules) {
        if (stopped) break;
        try {
          if (await executor.execute(schedule._id)) processed++;
        } catch {
          errors++;
        }
        await fs.writeFile(heartbeat, String(Date.now()));
      }
      for (let i = 0; i < 500 && !stopped && (await notices.processOne()); i++)
        await fs.writeFile(heartbeat, String(Date.now()));
      if (Date.now() - lastCleanup > 86400000) {
        await cleanup();
        lastCleanup = Date.now();
      }
    }
    await fs.writeFile(heartbeat, String(Date.now()));
    console.log(
      JSON.stringify({
        event: "schedule.tick",
        processed,
        errors,
        durationMs: Date.now() - started,
      })
    );
  } catch {
    console.error(JSON.stringify({ event: "schedule.tick.failed" }));
  } finally {
    running = false;
  }
}
async function start() {
  if (!Number.isInteger(interval) || interval < 1000 || interval > 86400000)
    throw new Error("Invalid SCHEDULE_WORKER_INTERVAL_MS");
  if (!/^mongodb(?:\+srv)?:\/\//.test(process.env.MONGODB_URI || ""))
    throw new Error("MONGODB_URI required");
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    autoIndex: false,
    autoCreate: false,
  });
  if (process.env.SCHEDULE_MODULE_ENABLED !== "false") {
    const models = Object.values(require("./infrastructure/models")).filter(
      (m) => m?.modelName
    );
    for (const Model of models) {
      const existing = await mongoose.connection.db
        .listCollections({ name: Model.collection.name })
        .toArray();
      if (!existing[0]?.options?.validator)
        throw new Error(
          "Run schedule:migrate:apply before starting the worker"
        );
      const indexes = await Model.collection.indexes();
      for (const [keys, options] of Model.schema
        .indexes()
        .filter(([, options]) => options.unique)) {
        if (
          !indexes.some(
            (i) =>
              i.unique &&
              JSON.stringify(i.key) === JSON.stringify(keys) &&
              JSON.stringify(i.partialFilterExpression) ===
                JSON.stringify(options.partialFilterExpression)
          )
        )
          throw new Error("Required schedule unique index missing");
      }
    }
    const indexes = await ScheduleTaskIndexes();
    if (!indexes)
      throw new Error("Schedule unique indexes missing; run migration");
  }
  await tick();
  timer = setInterval(tick, interval);
}
async function ScheduleTaskIndexes() {
  const indexes =
    await require("./infrastructure/models").ScheduleTask.collection.indexes();
  return (
    indexes.some((i) => i.unique && i.key.runKey) &&
    indexes.some(
      (i) => i.unique && i.key.scheduleId && i.partialFilterExpression?.isOpen
    )
  );
}
async function stop() {
  stopped = true;
  clearInterval(timer);
  while (running) await new Promise((resolve) => setTimeout(resolve, 100));
  await mongoose.disconnect();
}
if (require.main === module) {
  for (const signal of ["SIGTERM", "SIGINT"])
    process.once(signal, () => stop().then(() => process.exit(0)));
  start().catch(() => {
    console.error(
      "Schedule worker startup failed; check configuration and migration"
    );
    process.exit(1);
  });
}
module.exports = { tick, start, stop };
