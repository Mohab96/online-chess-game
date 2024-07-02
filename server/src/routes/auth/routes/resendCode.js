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
