const express = require("express");
const settingsRouter = express.Router();
const validateRequest = require("../../middlewares/validateRequest");

const getSettings = require("./controllers/getSettings");
const updateSettings = require("./controllers/updateSettings");

const updateSettingsSchema = require("./validators/updateSettings-schema");

settingsRouter.get("/", getSettings);
settingsRouter.patch(
  "/",
  validateRequest(updateSettingsSchema),
  updateSettings
);

module.exports = settingsRouter;
