"use strict";

const dotenv = require("dotenv");
dotenv.config();
const mongoUri = process.env.MONGODB_URI?.trim();
if (!mongoUri || !/^mongodb(?:\+srv)?:\/\//.test(mongoUri)) {
  console.error(
    "MONGODB_URI debe estar definida en el entorno del backend y comenzar con mongodb:// o mongodb+srv://. Configurala como variable de runtime en Coolify."
  );
  process.exit(1);
}
const mongoose = require("mongoose");
var app = require("./app");
var port = 3993;
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const {
  initializeNotificationRealtime,
} = require("./service/notificationRealtime");
const {
  dropLegacyStaffAdminGovernmentIdIndex,
  ensureOwnerPersonalIdIndexAllowsMissing,
} = require("./service/databaseMigrations");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (
      process.env.FRONTEND_ORIGINS ||
      "http://localhost:4200,http://localhost:9090"
    )
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
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    const removedLegacyIndex = await dropLegacyStaffAdminGovernmentIdIndex();
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
    console.error(`No se pudo iniciar el backend (${error.name || "Error"}). Comprueba MongoDB, MONGODB_URI y las migraciones de inicio.`);
    throw error;
  }
};

connectBD().then(() => {
  httpServer.listen(port, () => {
    console.log("Servidor corriendo.");
  });
}).catch(() => process.exit(1));
