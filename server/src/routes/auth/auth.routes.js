const express = require("express");
const authRouter = express.Router();

const changePassword = require("./routes/changePassword");
const checkEmail = require("./routes/checkEmail");
const forgotPassword = require("./routes/forgotPassword");
const login = require("./routes/login");
const logout = require("./routes/logout");
const register = require("./routes/register");
const resendCode = require("./routes/resendCode");
const resetPassword = require("./routes/resetPassword");
const verifyEmail = require("./routes/verifyEmail");
const getCurrentPlayer = require("./routes/getCurrentPlayer");

const emailSchema = require("./validators/changePassword-schema");
const checkEmailSchema = require("./validators/checkEmail-schema");
const loginSchema = require("./validators/login-schema");
const registerSchema = require("./validators/register-schema");
const resetPasswordSchema = require("./validators/resetPassword-schema");
const verifyEmailSchema = require("./validators/verifyEmail-schema");

const validateRequest = require("../../middlewares/validateRequest");

authRouter
  .route("/change-password")
  .post(validateRequest(emailSchema), changePassword);

authRouter
  .route("/check-email")
  .post(validateRequest(checkEmailSchema), checkEmail);

authRouter
  .route("/forgot-password")
  .post(validateRequest(checkEmailSchema), forgotPassword);
authRouter.route("/login").post(validateRequest(loginSchema), login);
authRouter.route("/logout").post(logout);
authRouter.route("/register").post(validateRequest(registerSchema), register);

authRouter
  .route("/resend-code")
  .post(validateRequest(checkEmailSchema), resendCode);

authRouter
  .route("/reset-password")
  .post(validateRequest(resetPasswordSchema), resetPassword);

authRouter
  .route("/verify-email")
  .post(validateRequest(verifyEmailSchema), verifyEmail);

authRouter.route("/me").get(getCurrentPlayer);

module.exports = authRouter;
