const app = require("../config/server");
const http = require("http");
const socketIo = require("socket.io");

const ws_server = http.createServer(app);

const io = socketIo(ws_server, {
  cors: {
    origin: "*",
  },
});

module.exports = io;
