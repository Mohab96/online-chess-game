const { ApiError, ApiSuccess } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../utils/statusCodes");

const acceptOrDeclineFriendRequest = async (req, res, next) => {
  // Accept or reject friend request sent to the currently authenticated user
  const friend_request_id = +req.params["id"];
  const { status } = req.body;

  if (status != "accepted" && status != "rejected") {
    return ApiError(
      res,
      "Please enter valid status, either accepted or rejected",
      HTTP_400_BAD_REQUEST
    );
  }

  try {
    const friend_request = await prisma.friendRequest.findFirst({
      where: {
        id: friend_request_id,
        receiverId: req.playerId,
      },
    });

    if (!friend_request) {
      return ApiError(
        res,
        "No friend request with this id was found or not sent to this user",
        404
      );
    }

    await prisma.friendRequest.update({
      where: {
        id: friend_request_id,
        receiverId: req.playerId,
      },
      data: {
        status: status,
      },
    });

    if (status === "accepted") {
      await prisma.player.update({
        where: { id: req.playerId },
        data: {
          friends: {
            connect: {
              id: friend_request.senderId,
            },
          },
        },
      });

      await prisma.player.update({
        where: { id: friend_request.senderId },
        data: {
          friends: {
            connect: {
              id: req.playerId,
            },
          },
        },
      });
    }

    return ApiSuccess(res, friend_request);
  } catch (error) {
    console.log(error.message);

    return ApiError(
      res,
      "An error occured while accepting/rejecting the friend request",
      HTTP_500_INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = acceptOrDeclineFriendRequest;
