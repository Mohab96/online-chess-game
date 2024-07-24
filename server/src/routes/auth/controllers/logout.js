const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const statusCodes = require("../../../utils/statusCodes");
const { INVALIDATED_TOKENS } = require("../../../utils/redisUtils");
const { redisClient } = require("../../../config/connect_redis");

const logout = async (req, res, next) => {
  const player = await prisma.player.findUnique({
    where: { id: req.playerId },
  });

  if (!player) {
    return ApiError(res, "Player not found", 404);
  }

  // IDEA: Make for every user a key that contains all his invalidated tokens
  let invalidated_tokens = await redisClient.get(INVALIDATED_TOKENS);
  invalidated_tokens += `|${req.headers.authorization.split(" ")[1]}`;
  await redisClient.set(INVALIDATED_TOKENS, invalidated_tokens);

  return ApiSuccess(
    res,
    {},
    "Logged out successfully",
    statusCodes.HTTP_200_SUCCESS
  );
};

module.exports = logout;
