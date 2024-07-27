const express = require("express");
const friendsRouter = express.Router();
const validateRequest = require("../../middlewares/validateRequest");

const sendFriendRequest = require("./controllers/sendFriendRequest");
const listFriendRequests = require("./controllers/listFriendRequests");
const acceptOrDeclineFriendRequest = require("./controllers/acceptOrDeclineFriendRequest");

const acceptOrDeclineFriendRequestSchema = require("./validators/acceptOrDeclineFriendRequestSchema");
const sendFriendRequestSchema = require("./validators/sendFriendRequestSchema");

friendsRouter
  .route("/")
  .post(validateRequest(sendFriendRequestSchema), sendFriendRequest);

friendsRouter.route("/").get(listFriendRequests);

friendsRouter
  .route("/:id")
  .patch(
    validateRequest(acceptOrDeclineFriendRequestSchema),
    acceptOrDeclineFriendRequest
  );

module.exports = friendsRouter;
