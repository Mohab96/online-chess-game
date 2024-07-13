// const io = require("../config/server");
const http = require("http");
const socketIo = require("socket.io");
const prisma = require("./prismaClient");
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redis = require("redis");
const redisClient = redis.createClient(REDIS_PORT, "localhost");
const verifyToken = require("../utils/verifyToken");
const { getPlayersSocket } = require("../utils/redisConventions");
const secret = process.env.JWT_SECRET;
let io;

const connect_database = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const connect_redis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully to port 6379");
  } catch (error) {
    console.error("Unable to connect to Redis:", error);
  }
};

const startServer = async (server) => {
  const ws_server = http.createServer(server);

  io = socketIo(ws_server, {
    origin: "*",
  });

  setup_websockets();

  ws_server.listen(SERVER_PORT, "localhost", async () => {
    console.log(`Server connected successfully to port ${SERVER_PORT}`);
    await connect_database();
    await connect_redis();
  });

  process.on("unhandledRejection", (err) => {
    console.error(err);
    ws_server.close(() => {
      console.error(`Shutting down`);
      process.exit(1);
    });
  });
};

const setup_websockets = () => {
  // Websockets authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.query.token;

    if (token) {
      const decoded = await verifyToken(token, secret);

      socket.playerId = decoded.playerId;

      redisClient.set(getPlayersSocket(socket.playerId), socket.id);
      next();
    } else {
      next(new Error("Unauthorized: no token was found"));
    }
  });

  io.on("connect", (socket) => {
    console.log(
      `Player #${socket.playerId} connected on socket with id #${socket.id}`
    );

    socket.on("disconnect", () => {
      console.log(
        `Player #${socket.playerId} disconnected from socket with id #${socket.id}`
      );

      redisClient.del(getPlayersSocket(socket.playerId));
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

module.exports = { startServer, sendEvent, redisClient };
