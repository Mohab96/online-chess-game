const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const { verifyOTP } = require("../../../utils/otpService");

const verifyEmail = async (req, res, next) => {
  const value = { ...req.body };
  const isValid = verifyOTP(value.token, value.otpSecret);

  if (isValid) {
    return ApiSuccess(res, (message = "Email verified successfully"));
  } else {
    return next(ApiError(res, "OTP is Invalid", 400));
  }
};

module.exports = verifyEmail;
