const Joi = require("joi");

const makeMoveSchema = Joi.object({
  move_notation: Joi.string().required(),
});

module.exports = makeMoveSchema;
