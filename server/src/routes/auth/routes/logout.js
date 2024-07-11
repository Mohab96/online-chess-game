const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const { sendEvent } = require("../../../config/sockets");

const logout = async (req, res, next) => {
  const player = await prisma.player.findUnique({
    where: { id: req.playerId },
  });

  if (!player) {
    return next(ApiError(res, "Player not found", 404));
  }

  await prisma.player.update({
    where: { id: req.playerId },
    data: { online: false, ip_address: null },
  });

  // Notify the client that this player has logged out to notify his friends
  // io.emit("playerIsOffline", player.email);
  sendEvent("playerIsOffline", { email: player.email });

  return ApiSuccess(res, {}, "Logged out successfully", 200);
};

module.exports = logout;
