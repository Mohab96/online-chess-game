const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");

const updateSettings = async (req, res, next) => {
  const { sound_enabled, takebacks_enabled } = req.body;

  try {
    const old_settings = await prisma.setting.findUnique({
      where: {
        playerId: req.playerId,
      },
    });

    const settings = await prisma.setting.update({
      where: {
        id: old_settings.id,
      },
      data: {
        sound_enabled: sound_enabled,
        takebacks_enabled: takebacks_enabled,
      },
    });

    return ApiSuccess(res, settings);
  } catch (error) {
    console.log(error.message);

    return ApiError(res, "An error occured while updating your settings", 500);
  }
};

module.exports = updateSettings;
