/* 
  This file is used to verify the email of the user by checking 
  the OTP sent to the user's email using checkEmail endpoint.
*/

const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const { verifyOTP } = require("../../../utils/otpService");
const { HTTP_400_BAD_REQUEST } = require("../../../utils/statusCodes");

const verifyEmail = async (req, res, next) => {
  const value = { ...req.body };
  const isValid = verifyOTP(value.token, value.otpSecret);

  if (isValid) {
    return ApiSuccess(res, (message = "Email verified successfully"));
  } else {
    return ApiError(res, "OTP is Invalid", HTTP_400_BAD_REQUEST);
  }
};

module.exports = verifyEmail;
