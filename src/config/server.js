const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const authMiddleware = require("../middlewares/authentication");
const mainRouter = require("./router");
const { startServer } = require("./sockets");
require("./../routes/miscRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(morgan("combined"));
app.use(cors());
app.use(authMiddleware);
app.use(helmet());
app.use(express.json());

app.use(mainRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

startServer(app);
