const { io } = require("socket.io-client");

const socket = io("http://localhost:3993");

socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});
