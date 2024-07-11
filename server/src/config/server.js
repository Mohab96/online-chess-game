const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const prisma = require("./prismaClient");
const authMiddleware = require("../middlewares/authentication");
const mainRouter = require("./router");
const { ApiSuccess } = require("../utils/apiResponse");
const http = require("http");
const socketIo = require("socket.io");

const ws_server = http.createServer(app);

const io = socketIo(ws_server, {
  origin: "*",
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

app.use(cors());
app.use(authMiddleware);
app.use(helmet());
app.use(express.json());

mainRouter.route("/health").get((req, res) => {
  return ApiSuccess(res, { message: "Server is running successfully!" });
});

app.use(mainRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const connect_db = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

ws_server.listen(PORT, "127.0.0.1", () => {
  console.log(`Server connected successfully to port ${PORT}`);
  connect_db();
});

process.on("unhandledRejection", (err) => {
  console.error(`Database error ${err}`);
  ws_server.close(() => {
    console.error(`Shutting down`);
    process.exit(1);
  });
});

module.exports = io;
