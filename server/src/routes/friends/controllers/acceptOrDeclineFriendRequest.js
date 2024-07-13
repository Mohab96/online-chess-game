const { ApiError, ApiSuccess } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");

const acceptOrDeclineFriendRequest = async (req, res, next) => {
  // Accept or reject friend request sent to the currently authenticated user
  const friend_request_id = +req.params["id"];
  const { status } = req.body;

  if (status != "accepted" && status != "rejected") {
    return next(
      ApiError(
        res,
        "Please enter valid status, either accepted or rejected",
        400
      )
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
      return next(
        ApiError(
          res,
          "No friend request with this id was found or not sent to this user",
          404
        )
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

    return next(
      ApiError(
        res,
        "An error occured while accepting/rejecting the friend request",
        500
      )
    );
  }
};

module.exports = acceptOrDeclineFriendRequest;
