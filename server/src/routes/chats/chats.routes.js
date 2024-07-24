const express = require("express");
const chatsRouter = express.Router();
const validateRequest = require("../../middlewares/validateRequest");

const getChat = require("./controllers/getChat");
const sendMessage = require("./controllers/sendMessage");
const deleteMessage = require("./controllers/deleteMessage");

const getChatSchema = require("./validators/getChatSchema");
const sendMessageSchema = require("./validators/sendMessageSchema");
const deleteMessageSchema = require("./validators/deleteMessageSchema");

chatsRouter.get("/get", validateRequest(getChatSchema), getChat);

chatsRouter.post("/send", validateRequest(sendMessageSchema), sendMessage);

// This endpoint will be disabled until further invistigation is done
// chatsRouter.delete(
//   "/delete",
//   validateRequest(deleteMessageSchema),
//   deleteMessage
// );

module.exports = chatsRouter;
