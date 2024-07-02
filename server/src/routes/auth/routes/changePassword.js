const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const hashPassword = require("../../../utils/hashPassword");
const verifyPassword = require("../../../utils/verifyPassword");
const prisma = require("../../../config/prismaClient");

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const player_id = req.playerId;

  const player = await prisma.player.findUnique({
    where: { id: player_id },
  });

  const is_valid = await verifyPassword(oldPassword, player.password);

  if (!is_valid) {
    return next(ApiError(res, "Invalid password", 400));
  }

  const hashed_password = await hashPassword(newPassword);

  await prisma.player.update({
    where: { id: player_id },
    data: { password: hashed_password },
  });

  return ApiSuccess(
    res,
    {
      email: player.email,
    },
    "Password has been changed successfully",
    200
  );
};

module.exports = changePassword;
