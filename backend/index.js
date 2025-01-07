"use strict";

const mongoose = require("mongoose");
var app = require("./app");
var port = 3993;
var conection = "mongodb://127.0.0.1:27017/cleaningService";
var { configurarCronJobs, testingCron } = require("./service/invoice_job");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const httpServer = createServer(app);

mongoose.set("strictQuery", true);
const connectBD = async () => {
  try {
    await mongoose.connect(conection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected!");
  } catch (error) {
    console.log(error);
  }
};

// configurarCronJobs();
// testingCron();
const io = new Server(httpServer);

io.sockets.on("connection", (socket) => {
  console.log("....................User connected");
  socket.on("disconnect", () => {
    console.log("....................User disconnected");
  });
});

httpServer.listen(port, () => {
  connectBD();
  console.log("Servidor corriendo.");
});
