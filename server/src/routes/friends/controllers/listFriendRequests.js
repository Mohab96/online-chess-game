const { ApiError, ApiSuccess } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const sendFriendRequest = require("./sendFriendRequest");
const {
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../utils/statusCodes");

const listFriendRequests = async (req, res, next) => {
  // List of friend requests sent/recieved by currently authenticated user
  const filter = req.query["type"];

  try {
    let friend_requests_list;

    if (filter === "sent") {
      friend_requests_list = await prisma.friendRequest.findMany({
        where: {
          senderId: req.playerId,
        },
      });
    } else if (filter === "received") {
      friend_requests_list = await prisma.friendRequest.findMany({
        where: {
          receiverId: req.playerId,
        },
      });
    } else if (filter === "pending") {
      friend_requests_list = await prisma.friendRequest.findMany({
        where: {
          receiverId: req.playerId,
          AND: {
            status: "pending",
          },
        },
      });
    } else {
      friend_requests_list = await prisma.friendRequest.findMany({
        where: {
          OR: [{ senderId: req.playerId }, { receiverId: req.playerId }],
        },
      });
    }

    return ApiSuccess(res, friend_requests_list);
  } catch (error) {
    console.log(error.message);

    return ApiError(
      res,
      "An error occured while retrieving the list of friend requests",
      HTTP_500_INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = listFriendRequests;
