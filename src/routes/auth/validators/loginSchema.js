const Joi = require("joi");

const login = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

module.exports = login;
