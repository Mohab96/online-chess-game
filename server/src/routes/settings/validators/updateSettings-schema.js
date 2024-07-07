const Joi = require("joi");

const updateSettingsSchema = Joi.object({
  sound_enabled: Joi.boolean().required(),
  takebacks_enabled: Joi.boolean().required(),
});

module.exports = updateSettingsSchema;
