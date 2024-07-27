const Joi = require("joi");

const deleteMessageSchema = Joi.object({
  secondPlayerId: Joi.number().required(),
  messageId: Joi.number().required(),
});

module.exports = deleteMessageSchema;
