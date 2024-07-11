const express = require("express");
const chatsRouter = express.Router();
const validateRequest = require("../../middlewares/validateRequest");

const getChat = require("./routes/getChat");
const sendMessage = require("./routes/sendMessage");
const deleteMessage = require("./routes/deleteMessage");

const getChatSchema = require("./validators/getChatSchema");
const sendMessageSchema = require("./validators/sendMessageSchema");
const deleteMessageSchema = require("./validators/deleteMessageSchema");

chatsRouter.get("/get", validateRequest(getChatSchema), getChat);

chatsRouter.post("/send", validateRequest(sendMessageSchema), sendMessage);

chatsRouter.delete(
  "/delete",
  validateRequest(deleteMessageSchema),
  deleteMessage
);

module.exports = chatsRouter;
