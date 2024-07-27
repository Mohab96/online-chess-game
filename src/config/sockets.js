const http = require("http");
const socketIo = require("socket.io");
const listen_to_events = require("../websocket_events/received_events");
let io;

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const connect_database = require("./connect_db");

const { getPlayerSocket, INVALIDATED_TOKENS } = require("../utils/redisUtils");
const { connect_redis, redisClient } = require("./connect_redis");

const verifyToken = require("../utils/verifyToken");
const start_cronjobs = require("./start_cronjobs");

const startServer = async (server) => {
  const ws_server = http.createServer(server);

  io = socketIo(ws_server, {
    origin: "*",
  });

  setup_websockets();
  listen_to_events(io);
  start_cronjobs(io);

  ws_server.listen(SERVER_PORT, "localhost", async () => {
    console.log(`Server connected successfully to port ${SERVER_PORT}`);

    await connect_database();
    await connect_redis();
  });

  process.on("unhandledRejection", (err) => {
    console.error(err.message);
  });
};

/* 
  Authentication middleware for websockets
 */
const setup_websockets = () => {
  io.use(async (socket, next) => {
    const token = socket.handshake.query.token;

    if (token) {
      try {
        const decoded = await verifyToken(token, JWT_SECRET);

        let is_invalidated_token = await redisClient.get(INVALIDATED_TOKENS);
        is_invalidated_token = is_invalidated_token.split("|").includes(token);

        if (is_invalidated_token) {
          return next(
            new Error(
              "Unauthorized: token has been invalidated, please login again"
            )
          );
        }

        socket.playerId = decoded.playerId;
      } catch (error) {
        console.log(error.message);

        return next(new Error("Unauthorized: invalid token format"));
      }

      redisClient.set(getPlayerSocket(socket.playerId), socket.id);
      next();
    } else {
      return next(new Error("Unauthorized: no token was found"));
    }
  });
};

/* 
  In some cases when I export io, a circular dependency arises,
  so I created a wrapper function to pass the io object to the
  functions that need it.
 */
const socket_wrapper = (func, ...args) => {
  return func(io, ...args);
};

/* 

Example for client side:

const token = "your jwt here";

const io = require("socket.io-client")("ws://localhost:3000", {
  query: {
    token: <token>,
  },
});

socket.on("connect", () => {
  console.log("Connected to the server");
});

*/

module.exports = {
  startServer,
  socket_wrapper,
  io,
};
