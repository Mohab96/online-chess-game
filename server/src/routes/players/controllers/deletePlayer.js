const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");

const deletePlayer = async (req, res, next) => {
  const id = req.playerId;

  try {
    await prisma.playerStats.delete({
      where: {
        playerId: id,
      },
    });

    await prisma.setting.delete({
      where: {
        playerId: id,
      },
    });

    await prisma.player.delete({
      where: {
        id: id,
      },
    });

    return ApiSuccess(res, {}, "Player deleted successfully", 204);
  } catch (error) {
    return next(
      ApiError(res, "An error occured while deleting the player"),
      500
    );
  }
};

module.exports = deletePlayer;
