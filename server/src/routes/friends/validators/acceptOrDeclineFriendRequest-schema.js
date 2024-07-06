const Joi = require("joi");

const acceptOrDeclineFriendRequest = Joi.object({
  status: Joi.string().required(),
});

module.exports = acceptOrDeclineFriendRequest;
