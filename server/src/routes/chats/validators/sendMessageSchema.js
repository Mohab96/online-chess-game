const Joi = require("joi");

const sendMessageSchema = Joi.object({
  secondPlayerId: Joi.number().required(),
  message: Joi.string().required(),
});

module.exports = sendMessageSchema;
