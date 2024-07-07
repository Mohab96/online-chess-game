const express = require("express");
const settingsRouter = express.Router();
const validateRequest = require("../../middlewares/validateRequest");

const getSettings = require("./routes/getSettings");
const updateSettings = require("./routes/updateSettings");

const updateSettingsSchema = require("./validators/updateSettings-schema");

settingsRouter.get("/", getSettings);
settingsRouter.patch(
  "/",
  validateRequest(updateSettingsSchema),
  updateSettings
);

module.exports = settingsRouter;
