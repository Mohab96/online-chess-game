const generateToken = require("../../../utils/generateToken");
const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const verifyPassword = require("../../../utils/verifyPassword");
const prisma = require("../../../config/prismaClient");
// const io = require("../../../config/sockets");

const login = async (req, res, next) => {
  const { email, password, ip_address } = req.body;

  const player = await prisma.player.findUnique({
    where: { email: email },
  });

  if (!player) {
    return next(ApiError(res, "Invalid email", 400));
  }

  const is_valid = await verifyPassword(password, player.password);

  if (!is_valid) {
    return next(ApiError(res, "Invalid password", 400));
  }

  if (player.online) {
    return next(
      ApiError(res, "Player already logged in from other device", 400)
    );
  }

  await prisma.player.update({
    where: { email: email },
    data: { online: true, ip_address: ip_address },
  });

  // Notify the client that this player has logged in to notify his friends
  // io.emit("playerIsOnline", email);

  const payload = { playerId: player.id };
  const token = await generateToken(payload, process.env.JWT_SECRET);

  return ApiSuccess(res, { token: token }, "Logged in successfully");
};

module.exports = login;
