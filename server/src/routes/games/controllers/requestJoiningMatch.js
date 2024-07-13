const { ApiSuccess } = require("../../../utils/apiResponse");
const { redisClient } = require("../../../config/sockets");
const { READY_PLAYERS_POOL } = require("../../../utils/redisConventions");
const { HTTP_200_SUCCESS } = require("../../../utils/statusCodes");

const requestJoiningMatch = (req, res, next) => {
  const player_id = req.playerId;

  const current_queue = redisClient.get(READY_PLAYERS_POOL);
  current_queue.push(player_id);

  return ApiSuccess(
    res,
    {},
    "Player added successfully to the queue",
    HTTP_200_SUCCESS
  );
};

module.exports = requestJoiningMatch;
