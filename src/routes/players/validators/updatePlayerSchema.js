const Joi = require("joi");

const updatePlayerSchema = Joi.object({
  username: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  phone: Joi.string().min(10).max(11),
});

module.exports = updatePlayerSchema;
