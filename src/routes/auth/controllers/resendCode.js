/* 
  If a player tried to register (checkEmail) and took time (more than 2 minutes) to enter the OTP
  sent to his email, he can request a new OTP to be sent to his email using this controller.
 */

const { generateSecret, generateOTP } = require("../../../utils/otpService");
const { ApiSuccess } = require("../../../utils/apiResponse");
const emailService = require("../../../utils/emailService");

const resendCode = async (req, res) => {
  const { email } = req.body;

  const otpSecret = generateSecret();
  const otp = generateOTP(otpSecret);

  await emailService.sendVerificationEmail(email, otp);

  return ApiSuccess(res, { token: otpSecret }, "Check your email for the OTP");
};

module.exports = resendCode;
