const READY_PLAYERS_POOL = "players_queue";
const ONGOING_GAMES = "ongoing_games";
const INVALIDATED_TOKENS = "invalidated_tokens";
const READ_WRITE_LOCK = "read_write_lock";

const getPlayerSocket = (player_id) => {
  return `player#${player_id}`;
};

const getGameRoomName = (game_id) => {
  return `game#${game_id}`;
};

module.exports = {
  getPlayerSocket,
  getGameRoomName,
  READY_PLAYERS_POOL,
  ONGOING_GAMES,
  INVALIDATED_TOKENS,
  READ_WRITE_LOCK,
};
