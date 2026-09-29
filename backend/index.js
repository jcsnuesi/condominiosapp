"use strict";

const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
var app = require("./app");
var port = 3993;
var conection =
  process.env.MONGODB_URI ||
  "mongodb://admin:adminpassword123@mongodb:27017/condominios_iam?authSource=admin&replicaSet=rs0";
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { initializeNotificationRealtime } = require("./service/notificationRealtime");
const {
  dropLegacyStaffAdminGovernmentIdIndex,
  ensureOwnerPersonalIdIndexAllowsMissing,
} = require("./service/databaseMigrations");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (process.env.FRONTEND_ORIGINS || "http://localhost:4200,http://localhost:9090")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    methods: ["GET", "POST"],
  },
});

initializeNotificationRealtime(io);

mongoose.set("strictQuery", true);
const connectBD = async () => {
  try {
    await mongoose.connect(conection, {
      serverSelectionTimeoutMS: 5000,
    });

    const removedLegacyIndex =
      await dropLegacyStaffAdminGovernmentIdIndex();
    if (removedLegacyIndex) {
      console.log("Removed legacy Staff Admin government ID index.");
    }

    const updatedOwnerPersonalIdIndex =
      await ensureOwnerPersonalIdIndexAllowsMissing();
    if (updatedOwnerPersonalIdIndex) {
      console.log("Updated Owner Personal ID index to allow missing values.");
    }

    console.log("MongoDB connected!");
  } catch (error) {
    console.log(error);
  }
};

httpServer.listen(port, () => {
  connectBD();
  console.log("Servidor corriendo.");
});
