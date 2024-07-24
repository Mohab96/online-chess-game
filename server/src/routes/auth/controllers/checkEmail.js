const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const { generateSecret, generateOTP } = require("../../../utils/otpService");
const emailService = require("../../../utils/emailService");
const prisma = require("../../../config/prismaClient");
const { HTTP_400_BAD_REQUEST } = require("../../../utils/statusCodes");

const checkEmail = async (req, res, next) => {
  const { email } = req.body;

  const isEmailExist = await prisma.player.findUnique({
    where: { email: email },
  });

  if (!isEmailExist) {
    return ApiError(res, "Email is already registered", HTTP_400_BAD_REQUEST);
  }

  const otpSecret = generateSecret();
  const otp = generateOTP(otpSecret);

  await emailService.sendVerificationEmail(email, otp);

  return ApiSuccess(res, { token: otpSecret }, "Check your email for the OTP");
};

module.exports = checkEmail;
