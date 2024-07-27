/* 
  This controller is used to reset the password of the player.
  After calling checkEmail and receiving OTP in the mail and 
  otpSecret in the response, the player sends both of them along
  with the new password and email to this endpoint to reset 
  the password. The OTP is verified and the password is hashed
  and updated in the database.
*/

const { ApiSuccess } = require("../../../utils/apiResponse");
const hashPassword = require("../../../utils/hashPassword");
const prisma = require("../../../config/prismaClient");
const { verifyOTP } = require("../../../utils/otpService");
const { HTTP_400_BAD_REQUEST } = require("../../../utils/statusCodes");

const resetPassword = async (req, res) => {
  const { email, newPassword, otpSecret, otp } = req.body;

  const is_valid = verifyOTP(otp, otpSecret);

  if (!is_valid) {
    return ApiError(res, "OTP is Invalid", HTTP_400_BAD_REQUEST);
  }

  const password = await hashPassword(newPassword);

  await prisma.player.update({
    where: { email: email },
    data: { password: password },
  });

  return ApiSuccess(res, { email }, "Password has been changed successfully");
};

module.exports = resetPassword;
