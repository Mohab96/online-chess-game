const express = require("express");
const gamesRouter = express.Router();

const validateRequest = require("../../middlewares/validateRequest");

const requestJoiningMatch = require("./controllers/requestJoiningMatch");
const makeMove = require("./controllers/makeMove");
const invitePlayerToJoinGame = require("./controllers/invitePlayerToJoinGame");

const makeMoveSchema = require("./validators/makeMoveSchema");

gamesRouter.post("/join", requestJoiningMatch);
gamesRouter.post("/:gameId/move", validateRequest(makeMoveSchema), makeMove);
gamesRouter.post("/invite/:playerId", invitePlayerToJoinGame);

module.exports = gamesRouter;
