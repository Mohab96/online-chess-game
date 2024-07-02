const Joi = require("joi");

const restPasswordSchema = Joi.object({
  email: Joi.string().required().email(),
  newPassword: Joi.string().required().min(8),
  confirmPassword: Joi.ref("newPassword"),
});

module.exports = restPasswordSchema;
