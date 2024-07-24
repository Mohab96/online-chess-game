const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");

const getCurrentPlayer = async (req, res, next) => {
  const player_id = req.playerId;

  const player = await prisma.player.findUnique({
    where: { id: player_id },
  });

  if (player) {
    return ApiSuccess(res, player);
  } else {
    return ApiError(res, "Player not found", 404);
  }
};

module.exports = getCurrentPlayer;
