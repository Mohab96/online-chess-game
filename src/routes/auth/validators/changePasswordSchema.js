const Joi = require("joi");

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().min(8),
  newPassword: Joi.string().required().min(8),
  confirmPassword: Joi.ref("newPassword"),
});

module.exports = changePasswordSchema;
