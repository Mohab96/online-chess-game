const express = require("express");
const friendsRouter = express.Router();
const validateRequest = require("../../middlewares/validateRequest");

const sendFriendRequest = require("./routes/sendFriendRequest");
const listFriendRequests = require("./routes/listFriendRequests");
const acceptOrDeclineFriendRequest = require("./routes/acceptOrDeclineFriendRequest");

const acceptOrDeclineFriendRequestSchema = require("./validators/acceptOrDeclineFriendRequest-schema");

friendsRouter.route("/").post(sendFriendRequest);

friendsRouter.route("/").get(listFriendRequests);

friendsRouter
  .route("/:id")
  .patch(
    validateRequest(acceptOrDeclineFriendRequestSchema),
    acceptOrDeclineFriendRequest
  );

module.exports = friendsRouter;
