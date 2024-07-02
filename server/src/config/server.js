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

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

app.use(cors());
app.use(authMiddleware);
app.use(helmet());
app.use(express.json());

mainRouter.route("/health").get((req, res) => {
  return ApiSuccess(res, {}, "Server is running successfully!");
});

app.use(mainRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const testDBConnection = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server connected successfully to port ${PORT}`);
  testDBConnection();
});

process.on("unhandledRejection", (err) => {
  console.error(`Database error ${err}`);
  server.close(() => {
    console.error(`Shutting down`);
    process.exit(1);
  });
});

module.export = app;
