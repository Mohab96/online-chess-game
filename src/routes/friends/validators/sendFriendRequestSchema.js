const Joi = require("joi");

const sendFriendRequestSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = sendFriendRequestSchema;
