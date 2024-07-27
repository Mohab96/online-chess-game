/* 
  When a plyser tries to register, this controller checks if the email is already registered
  and if not it checks if the email is valid and sends an OTP to the email then the user
  get the otpSecret returned in the response and sends the OTP sent to his mail to the verifyEmail
  endpoint to verify the email.
 */

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

  if (isEmailExist) {
    return ApiError(res, "Email is already registered", HTTP_400_BAD_REQUEST);
  }

  const otpSecret = generateSecret();
  const otp = generateOTP(otpSecret);

  await emailService.sendVerificationEmail(email, otp);

  return ApiSuccess(res, otpSecret, "Check your email for the OTP");
};

module.exports = checkEmail;
