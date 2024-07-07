const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");

const getSettings = async (req, res, next) => {
  try {
    const settings = await prisma.setting.findUnique({
      where: {
        playerId: req.playerId,
      },
    });

    return ApiSuccess(res, settings);
  } catch (error) {
    console.log(error.message);

    return ApiError(
      res,
      "An error occured while retrieving your settings",
      500
    );
  }
};

module.exports = getSettings;
