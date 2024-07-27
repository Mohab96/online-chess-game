/* 
  This is called when the player is logged in.
  This controller is used to change the password of the player by supplying 
  the old and new passwords in the request body and the token in the 
  Authorization header. It first verifies the old password and then hashes
  the new password and updates the player's password in the database.
*/

const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const hashPassword = require("../../../utils/hashPassword");
const verifyPassword = require("../../../utils/verifyPassword");
const prisma = require("../../../config/prismaClient");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_200_SUCCESS,
} = require("../../../utils/statusCodes");

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const player_id = req.playerId;

  const player = await prisma.player.findUnique({
    where: { id: player_id },
  });

  const is_valid = await verifyPassword(oldPassword, player.password);

  if (!is_valid) {
    return ApiError(res, "Invalid password", HTTP_400_BAD_REQUEST);
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
    HTTP_200_SUCCESS
  );
};

module.exports = changePassword;
