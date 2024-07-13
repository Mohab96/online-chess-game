const { ApiError, ApiSuccess } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");

const sendFriendRequest = async (req, res, next) => {
  // Player 1 wants to send friend request to player 2
  const player_1_id = req.playerId;
  const player_2_id = +req.body.id;

  if (player_1_id === player_2_id) {
    return next(
      ApiError(res, "You cannot send a friend request to yourself", 400)
    );
  }

  const receiver = await prisma.player.findUnique({
    where: {
      id: player_2_id,
    },
  });

  if (!receiver) {
    return next(ApiError(res, "No player with this id was found", 404));
  } else {
    try {
      const same_player = await prisma.friendRequest.findFirst({
        where: {
          senderId: player_1_id,
          receiverId: player_2_id,
        },
      });

      if (same_player) {
        return next(
          ApiError(
            res,
            "You've already sent friend request to this player and waiting his response",
            400
          )
        );
      }

      const other_player_already_sent = await prisma.friendRequest.findFirst({
        where: {
          senderId: player_2_id,
          receiverId: player_1_id,
        },
      });

      if (other_player_already_sent) {
        return next(
          ApiError(
            res,
            "The other player has already sent you a friend request and waiting your response",
            400
          )
        );
      }
    } catch (error) {
      console.log(error.message);

      return next(
        ApiError(res, "An error occurred during sending friend request", 500)
      );
    }

    try {
      const friend_request = await prisma.friendRequest.create({
        data: {
          sender: {
            connect: { id: player_1_id },
          },
          receiver: {
            connect: { id: player_2_id },
          },
        },
      });

      return ApiSuccess(
        res,
        friend_request,
        "Friend request sent successfully",
        201
      );
    } catch (error) {
      console.log(error.message);

      return next(
        ApiError(res, "An error occurred during sending friend request", 500)
      );
    }
  }
};

module.exports = sendFriendRequest;
