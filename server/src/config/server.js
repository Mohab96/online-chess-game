const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

app.use(cors());
app.use(express.json());
app.use(helmet());

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
