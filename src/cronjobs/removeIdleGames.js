/* 
  Games here have no time limits, so this cronjob removes any game that started more than 24 hours ago.
  It is called every 24 hours.
*/

const { redisClient } = require("../config/connect_redis");
const prisma = require("../config/prismaClient");
const { ONGOING_GAMES } = require("../utils/redisUtils");
const { removeElementFromString } = require("../utils/removeElement");

const removeIdleGames = async () => {
  console.log("Removing idle games");

  const ongoing_games = await redisClient.get(ONGOING_GAMES);

  if (!ongoing_games) return;

  if (ongoing_games[0] == "|")
    ongoing_games = removeElementFromString(ongoing_games, 0);

  ongoing_games = ongoing_games.split("|");

  for (let i = 0; i < ongoing_games.length; i++) {
    const game_id = ongoing_games[i];

    const game = await prisma.game.findUnique({
      where: { id: +game_id },
    });

    if (!game) {
      let new_ongoing_games;
      for (let i = 0; i < ongoing_games.length; i++) {
        if (ongoing_games[i] != `${game_id}`) {
          new_ongoing_games += `|${ongoing_games[i]}`;
        }
      }

      await redisClient.set("ONGOING_GAMES", new_ongoing_games);
    } else {
      const game_start_time = game.started_at;
      const current_time = new Date();

      const time_difference = current_time - game_start_time;
      if (time_difference > 24 * 60 * 60 * 1000) {
        const game_room = getGameRoomName(game_id);

        const player_1_socket_id = getPlayerSocket(game.firstPlayerId);
        const player_2_socket_id = getPlayerSocket(game.secondPlayerId);

        io.sockets.sockets.get(player_1_socket_id).leave(game_room);
        io.sockets.sockets.get(player_2_socket_id).leave(game_room);

        let new_ongoing_games;
        for (let i = 0; i < ongoing_games.length; i++) {
          if (ongoing_games[i] != `${game_id}`) {
            new_ongoing_games += `|${ongoing_games[i]}`;
          }
        }

        await redisClient.set("ONGOING_GAMES", new_ongoing_games);

        // remove game from database
        await prisma.game.delete({ where: { id: game_id } });

        // remove all moves related to that game from the database
        await prisma.move.deleteMany({ where: { gameId: game_id } });

        console.log(`Game ${game_id} removed successfully`);
      }
    }
  }
};

module.exports = removeIdleGames;
// NOT_TESTED
