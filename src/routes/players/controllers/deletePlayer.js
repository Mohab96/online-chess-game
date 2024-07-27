const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const {
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../utils/statusCodes");

const deletePlayer = async (req, res) => {
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
    return ApiError(
      res,
      "An error occured while deleting the player",
      HTTP_500_INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = deletePlayer;
