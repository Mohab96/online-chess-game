const express = require("express");
const playersRouter = express.Router();
const validateRequest = require("../../middlewares/validateRequest");

const getPlayer = require("./routes/getPlayer");
const updatePlayer = require("./routes/updatePlayer");
const deletePlayer = require("./routes/deletePlayer");

const updatePlayerSchema = require("./validators/updatePlayer-schema");

playersRouter.route("/:id").get(getPlayer);

playersRouter.route("/:id").delete(deletePlayer);

playersRouter
  .route("/:id")
  .patch(validateRequest(updatePlayerSchema), updatePlayer);

module.exports = playersRouter;
