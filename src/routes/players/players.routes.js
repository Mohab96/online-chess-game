const express = require("express");
const playersRouter = express.Router();
const validateRequest = require("../../middlewares/validateRequest");

const getPlayer = require("./controllers/getPlayer");
const updatePlayer = require("./controllers/updatePlayer");
const deletePlayer = require("./controllers/deletePlayer");

const updatePlayerSchema = require("./validators/updatePlayerSchema");

playersRouter.route("/").get(getPlayer);

playersRouter.route("/").delete(deletePlayer);

playersRouter
  .route("/")
  .patch(validateRequest(updatePlayerSchema), updatePlayer);

module.exports = playersRouter;
