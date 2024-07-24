const generateToken = require("../../../utils/generateToken");
const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const verifyPassword = require("../../../utils/verifyPassword");
const prisma = require("../../../config/prismaClient");
const {
  getPlayerSocket,
  INVALIDATED_TOKENS,
} = require("../../../utils/redisUtils");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_401_UNAUTHORIZED,
} = require("../../../utils/statusCodes");
const { redisClient } = require("../../../config/connect_redis");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const player = await prisma.player.findUnique({
    where: { email: email },
  });

  if (!player) {
    return ApiError(res, "Invalid email", HTTP_400_BAD_REQUEST);
  }

  const is_valid = await verifyPassword(password, player.password);

  if (!is_valid) {
    return ApiError(res, "Invalid password", HTTP_400_BAD_REQUEST);
  }

  const is_invalidated_token = await redisClient
    .get(INVALIDATED_TOKENS)
    .split("|")
    .includes(token);

  if (is_invalidated_token) {
    return ApiError(
      res,
      "Unauthorized: token has been invalidated, please login again",
      HTTP_401_UNAUTHORIZED
    );
  }

  const socket = await redisClient.get(getPlayerSocket(player.id));

  if (socket) {
    return ApiError(
      res,
      "Player already logged in from another device",
      HTTP_400_BAD_REQUEST
    );
  }

  const payload = { playerId: player.id };
  const token = await generateToken(payload, process.env.JWT_SECRET);

  return ApiSuccess(res, { token: token }, "Logged in successfully");
};

module.exports = login;
