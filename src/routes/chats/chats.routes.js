const express = require("express");
const chatsRouter = express.Router();
const validateRequest = require("../../middlewares/validateRequest");

const getChat = require("./controllers/getChat");
const sendMessage = require("./controllers/sendMessage");

const getChatSchema = require("./validators/getChatSchema");
const sendMessageSchema = require("./validators/sendMessageSchema");

chatsRouter.get("/get", validateRequest(getChatSchema), getChat);

chatsRouter.post("/send", validateRequest(sendMessageSchema), sendMessage);

module.exports = chatsRouter;
