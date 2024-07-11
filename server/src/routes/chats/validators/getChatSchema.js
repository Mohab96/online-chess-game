const Joi = require("joi");

const getChatSchema = Joi.object({
  secondPlayerId: Joi.number().required(),
});

module.exports = getChatSchema;
