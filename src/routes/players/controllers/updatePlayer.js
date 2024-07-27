const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../utils/statusCodes");

const updatePlayer = async (req, res) => {
  const { username, first_name, last_name, phone } = { ...req.body };
  const id = req.playerId;

  const player = await prisma.player.findUnique({
    where: {
      id: id,
    },
  });

  if (!player) {
    return ApiError(res, "Player not found", 404);
  }

  if (username && username != player.username) {
    const username_exists = await prisma.player.findUnique({
      where: {
        username: username,
      },
    });

    if (username_exists) {
      return ApiError(
        res,
        "Player with this username already exists",
        HTTP_400_BAD_REQUEST
      );
    }
  }

  if (phone && phone != player.phone) {
    const phone_exists = await prisma.player.findUnique({
      where: {
        phone: phone,
      },
    });

    if (phone_exists) {
      return ApiError(
        res,
        "Player with this phone already exists",
        HTTP_400_BAD_REQUEST
      );
    }
  }

  try {
    await prisma.player.update({
      where: {
        id: id,
      },
      data: {
        username: username ? username : player.username,
        first_name: first_name ? first_name : player.first_name,
        last_name: last_name ? last_name : player.last_name,
        phone: phone ? phone : player.phone,
      },
    });

    return ApiSuccess(res, player, "Player updated successfully");
  } catch (error) {
    return ApiError(res, error.message, HTTP_500_INTERNAL_SERVER_ERROR);
  }
};

module.exports = updatePlayer;
