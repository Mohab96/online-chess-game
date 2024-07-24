const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const {
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../utils/statusCodes");

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
      HTTP_500_INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = getSettings;
