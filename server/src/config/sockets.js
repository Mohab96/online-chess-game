// const io = require("../config/server");
const http = require("http");
const socketIo = require("socket.io");
const prisma = require("./prismaClient");
let io;

const connect_db = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const startServer = (server) => {
  const ws_server = http.createServer(server);

  io = socketIo(ws_server, {
    origin: "*",
  });

  ws_server.listen(3000, "127.0.0.1", () => {
    console.log(`Server connected successfully to port ${3000}`);
    connect_db();
  });

  io.on("connect", (socket) => {
    console.log(socket);
    console.log(`Client with id #${socket.id} connected`);
  });

  io.on("disconnect", (socket) => {
    console.log(`Client with id #${socket.id} disconnected`);
  });

  process.on("unhandledRejection", (err) => {
    console.error(err);
    ws_server.close(() => {
      console.error(`Shutting down`);
      process.exit(1);
    });
  });
};

const sendEvent = (event, params = {}) => {
  io.emit(event, params);
};

/* 

Example for client side:
const socket = require("socket.io-client")("ws://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to the server");
  socket.emit("message", "Hello from client");
});

*/

module.exports = { startServer, sendEvent };
