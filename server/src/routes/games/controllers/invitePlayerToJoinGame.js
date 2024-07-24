const { redisClient } = require("../../../config/connect_redis");
const prisma = require("../../../config/prismaClient");
const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const { getPlayerSocket } = require("../../../utils/redisUtils");
const startMatch = require("../../../utils/startMatch");
const {
  HTTP_404_NOT_FOUND,
  HTTP_400_BAD_REQUEST,
} = require("../../../utils/statusCodes");
const { socket_wrapper } = require("../../../config/sockets");

const invitePlayerToJoinGame = async (req, res) => {
  const first_player_id = req.playerId;
  const second_player_id = +req.params["playerId"];

  if (first_player_id === second_player_id) {
    return ApiError(res, "You can't invite yourself to join a game");
  }

  const second_player = await prisma.player.findUnique({
    where: { id: second_player_id },
  });

  if (!second_player) {
    return ApiError(res, "Player not found", HTTP_404_NOT_FOUND);
  }

  const player_1_socket_id = await redisClient.get(
    getPlayerSocket(first_player_id)
  );

  const player_2_socket_id = await redisClient.get(
    getPlayerSocket(second_player_id)
  );

  if (player_2_socket_id) {
    socket_wrapper(startMatch, first_player_id, second_player_id);
    return ApiSuccess(res, {}, "Game started successfully");
  } else {
    return ApiError(res, "Player is not online", HTTP_400_BAD_REQUEST);
  }
};

module.exports = invitePlayerToJoinGame;
// NOT_TESTED
