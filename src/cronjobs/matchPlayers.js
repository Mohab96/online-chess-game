/* 
  This cronjob is responsible for matching players that are ready to play.
  It is called every 30 seconds and checks if there are enough players 
  (more than 2) in the pool to match. If so, it check if the number of 
  players in the pool is even or odd. If it is even, it shuffles the players,
  removes any duplicates and then matches them in pairs. If it is odd, it 
  removes the last player from the pool and matches the rest of the players 
  in pairs.
 */

const { redisClient } = require("../config/connect_redis");
const { READY_PLAYERS_POOL } = require("../utils/redisUtils");
const {
  removeElementFromString,
  removeElementFromList,
} = require("../utils/removeElement");
const shuffle = require("../utils/shuffle");
const startMatch = require("../utils/startMatch");

const matchPlayers = async (io) => {
  // Pool of players that requested to join a match and
  // have been picked from the queue and ready to play

  let pool = await redisClient.get(READY_PLAYERS_POOL);

  if (!pool) return;

  if (pool[0] == "|") {
    pool = removeElementFromString(pool, 0);
  }

  pool = pool.split("|");
  pool = Array.from(new Set(pool));
  console.log("Pool: ", pool);

  if (pool.length < 2) {
    console.log("Not enough players to match");
    return;
  } else {
    if (pool.length % 2 == 1) {
      console.log("Odd number of players in the pool");
      await redisClient.set(READY_PLAYERS_POOL, `|${pool[pool.length - 1]}`);
      pool = removeElementFromList(pool, pool.length - 1);
    } else {
      console.log("Even number of players in the pool");

      // Here I am sure the pool contains even number of players
      pool = shuffle(pool);

      await redisClient.set(READY_PLAYERS_POOL, "");

      for (let i = 0; i < pool.length; i += 2) {
        const player_1_id = +pool[i];
        const player_2_id = +pool[i + 1];

        startMatch(io, player_1_id, player_2_id);

        console.log(`Matched players ${player_1_id} and ${player_2_id}`);
      }
    }
  }
};

module.exports = matchPlayers;
