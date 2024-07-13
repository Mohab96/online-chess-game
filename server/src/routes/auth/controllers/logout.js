const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const { sendEvent } = require("../../../config/sockets");
const statusCodes = require("../../../utils/statusCodes");

const logout = async (req, res, next) => {
  const player = await prisma.player.findUnique({
    where: { id: req.playerId },
  });

  if (!player) {
    return next(ApiError(res, "Player not found", 404));
  }

  // TODO: invalidate the token

  // Notify the client that this player has logged out to notify his friends
  // io.emit("playerIsOffline", player.email);

  return ApiSuccess(
    res,
    {},
    "Logged out successfully",
    statusCodes.HTTP_200_SUCCESS
  );
};

module.exports = logout;
