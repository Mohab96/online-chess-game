const express = require("express");
const authRouter = express.Router();

const changePassword = require("./controllers/changePassword");
const checkEmail = require("./controllers/checkEmail");
const login = require("./controllers/login");
const logout = require("./controllers/logout");
const register = require("./controllers/register");
const resendCode = require("./controllers/resendCode");
const resetPassword = require("./controllers/resetPassword");
const verifyEmail = require("./controllers/verifyEmail");
const getCurrentPlayer = require("./controllers/getCurrentPlayer");

const changePasswordSchema = require("./validators/changePasswordSchema");
const checkEmailSchema = require("./validators/checkEmailSchema");
const loginSchema = require("./validators/loginSchema");
const registerSchema = require("./validators/registerSchema");
const resetPasswordSchema = require("./validators/resetPasswordSchema");
const verifyEmailSchema = require("./validators/verifyEmailSchema");

const validateRequest = require("../../middlewares/validateRequest");

authRouter
  .route("/change-password")
  .post(validateRequest(changePasswordSchema), changePassword);

authRouter
  .route("/check-email")
  .post(validateRequest(checkEmailSchema), checkEmail);

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
