const express = require("express");
const mainRouter = express.Router();
const endpoints = require("../utils/endpoints.js");

const authRouter = require("../routes/auth/auth.routes");
const chatsRouter = require("../routes/chats/chats.routes");
const friendsRouter = require("../routes/friends/friends.routes");
const gamesRouter = require("../routes/games/games.routes");
const playersRouter = require("../routes/players/players.routes");
const settingsRouter = require("../routes/settings/settings.routes");

mainRouter.use(endpoints.AUTH, authRouter);
mainRouter.use(endpoints.CHATS, chatsRouter);
mainRouter.use(endpoints.FRIENDS, friendsRouter);
mainRouter.use(endpoints.GAMES, gamesRouter);
mainRouter.use(endpoints.PLAYERS, playersRouter);
mainRouter.use(endpoints.SETTINGS, settingsRouter);

module.exports = mainRouter;
