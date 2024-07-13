const getPlayersSocket = (player_id) => {
  return `player#${player_id}`;
};

const READY_PLAYERS_POOL = "players_queue";

module.exports = {
  getPlayersSocket,
  READY_PLAYERS_POOL,
};
