const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");

const updatePlayer = async (req, res, next) => {
  const { username, first_name, last_name, phone } = { ...req.body };
  const id = req.playerId;

  const player = await prisma.player.findUnique({
    where: {
      id: id,
    },
  });

  if (!player) {
    return next(ApiError(res, "Player not found", 404));
  }

  if (username && username != player.username) {
    const username_exists = await prisma.player.findUnique({
      where: {
        username: username,
      },
    });

    if (username_exists) {
      return next(
        ApiError(res, "Player with this username already exists", 400)
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
      return next(ApiError(res, "Player with this phone already exists", 400));
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
    next(ApiError(res, error.message, 500));
  }
};

module.exports = updatePlayer;
