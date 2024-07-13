const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const { generateSecret, generateOTP } = require("../../../utils/otpService");
const emailService = require("../../../utils/emailService");
const generateToken = require("../../../utils/generateToken");
const prisma = require("../../../config/prismaClient");

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const isEmailExist = await prisma.player.findUnique({
    where: { email: email },
  });

  if (!isEmailExist) {
    return next(ApiError(res, "Email not registered", 404));
  }

  const otpSecret = generateSecret();
  const otp = generateOTP(otpSecret);

  await emailService.sendVerificationEmail(email, otp);

  const token = await generateToken(
    { otpSecret },
    process.env.VERIFICATION_SECRET_TOKEN,
    "2m"
  );

  return ApiSuccess(res, { token: token }, "Check your email for the OTP");
};

module.exports = forgotPassword;
