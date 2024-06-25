const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { db_connection } = require("./db");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

app.use(cors());
app.use(express.json());
app.use(helmet());

const testDBConnection = async () => {
  try {
    await db_connection.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Connected To Port ${PORT}`);
  testDBConnection();
});

process.on("unhandledRejection", (err) => {
  console.error(`Database error ${err}`);
  server.close(() => {
    console.error(`Shutting down`);
    process.exit(1);
  });
});
