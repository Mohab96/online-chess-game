const { ApiError, ApiSuccess } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
  HTTP_201_CREATED,
} = require("../../../utils/statusCodes");

const sendFriendRequest = async (req, res) => {
  // Player 1 wants to send friend request to player 2
  const player_1_id = req.playerId;
  const player_2_id = +req.body.id;

  if (player_1_id === player_2_id) {
    return ApiError(
      res,
      "You cannot send a friend request to yourself",
      HTTP_400_BAD_REQUEST
    );
  }

  const receiver = await prisma.player.findUnique({
    where: {
      id: player_2_id,
    },
  });

  if (!receiver) {
    return ApiError(res, "No player with this id was found", 404);
  } else {
    try {
      const same_player = await prisma.friendRequest.findFirst({
        where: {
          senderId: player_1_id,
          receiverId: player_2_id,
        },
      });

      if (same_player) {
        return ApiError(
          res,
          "You've already sent friend request to this player and waiting his response",
          HTTP_400_BAD_REQUEST
        );
      }

      const other_player_already_sent = await prisma.friendRequest.findFirst({
        where: {
          senderId: player_2_id,
          receiverId: player_1_id,
        },
      });

      if (other_player_already_sent) {
        return ApiError(
          res,
          "The other player has already sent you a friend request and waiting your response",
          HTTP_400_BAD_REQUEST
        );
      }
    } catch (error) {
      console.log(error.message);

      return ApiError(
        res,
        "An error occurred during sending friend request",
        HTTP_500_INTERNAL_SERVER_ERROR
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
        HTTP_201_CREATED
      );
    } catch (error) {
      console.log(error.message);

      return ApiError(
        res,
        "An error occurred during sending friend request",
        HTTP_500_INTERNAL_SERVER_ERROR
      );
    }
  }
};

module.exports = sendFriendRequest;
