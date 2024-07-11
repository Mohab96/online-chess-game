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
const { startServer } = require("./sockets");

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

startServer(app);
