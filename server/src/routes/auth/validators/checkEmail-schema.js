const Joi = require("joi");

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = emailSchema;
