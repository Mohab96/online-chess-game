const { redisClient } = require("../../../config/connect_redis");
const { ApiSuccess } = require("../../../utils/apiResponse");
const { READY_PLAYERS_POOL } = require("../../../utils/redisUtils");
const { HTTP_200_SUCCESS } = require("../../../utils/statusCodes");

const requestJoiningMatch = async (req, res) => {
  const player_id = req.playerId;

  let current_queue = await redisClient.get(READY_PLAYERS_POOL);

  if (!current_queue) {
    current_queue = `|${player_id}`;
  } else {
    current_queue += `|${player_id}`;
  }

  await redisClient.set(READY_PLAYERS_POOL, current_queue);

  return ApiSuccess(
    res,
    {},
    "Player added successfully to the queue",
    HTTP_200_SUCCESS
  );
};

module.exports = requestJoiningMatch;
