const Joi = require("joi");

const verifyEmail = Joi.object({
  token: Joi.string().length(4).required(),
  otpSecret: Joi.string().required(),
});

module.exports = verifyEmail;
