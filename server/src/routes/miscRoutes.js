const prisma = require("../config/prismaClient");
const mainRouter = require("../config/router");
const { ApiSuccess } = require("../utils/apiResponse");

mainRouter.route("/api/health").get((req, res) => {
  return ApiSuccess(res, { message: "Server is running successfully!" });
});

mainRouter.route("/api/search/:query").get((req, res) => {
  const username = req.params["query"];

  const players = prisma.player.findMany({
    where: {
      username: {
        contains: username,
      },
    },
  });

  if (!players) {
    return ApiSuccess(res, {}, "No players found");
  }

  return ApiSuccess(res, { player: players });
});
// NOT_TESTED
