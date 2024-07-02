const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");

const getPlayer = async (req, res, next) => {
  const id = +req.params["id"];

  const player = await prisma.player.findUnique({
    where: {
      id: id,
    },
  });

  if (!player) {
    return next(ApiError(res, "Player not found", 404));
  }

  return ApiSuccess(res, player);
};

module.exports = getPlayer;
