const getPlayerSocket = (player_id) => {
  return `player#${player_id}`;
};

const getGameRoomName = (game_id) => {
  return `game#${game_id}`;
};

const READY_PLAYERS_POOL = "players_queue";
const ONGOING_GAMES = "ongoing_games";
const INVALIDATED_TOKENS = "invalidated_tokens";
const READ_WRITE_LOCK = "read_write_lock";

const { redisClient } = require("../config/connect_redis");

// const redis_get = async (key, lock) => {
//   while (is_locked(key)) {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   }

//   let value = await redisClient.get(key);

//   if (lock) {
//     // IDEA: the process that locks the key might crash before unlocking it
//     await redisClient.set(key, READ_WRITE_LOCK);
//   }

//   return value || "";
// };

// const is_locked = async (key) => {
//   return (await redisClient.get(key)) === READ_WRITE_LOCK;
// };

module.exports = {
  getPlayerSocket,
  getGameRoomName,
  // is_locked,
  // redis_get,
  READY_PLAYERS_POOL,
  ONGOING_GAMES,
  INVALIDATED_TOKENS,
  READ_WRITE_LOCK,
};
