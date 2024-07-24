const { redisClient } = require("../config/connect_redis");
const prisma = require("../config/prismaClient");
const {
  getPlayerSocket,
  getGameRoomName,
  ONGOING_GAMES,
} = require("./redisUtils");

const startMatch = async (io, player_1_id, player_2_id) => {
  const chat = await prisma.chat.create({
    data: {
      first_player: {
        connect: { id: player_1_id },
      },
      second_player: {
        connect: { id: player_2_id },
      },
    },
  });

  const game = await prisma.game.create({
    data: {
      first_player: {
        connect: { id: player_1_id },
      },
      second_player: {
        connect: { id: player_2_id },
      },
      chat: {
        connect: { id: chat.id },
      },
    },
  });

  let ongoing_games = await redisClient.get(ONGOING_GAMES);
  ongoing_games += `|${game.id}`;
  await redisClient.set(ONGOING_GAMES, ongoing_games);

  const player_1_socket_id = await redisClient.get(
    getPlayerSocket(player_1_id)
  );

  const player_2_socket_id = await redisClient.get(
    getPlayerSocket(player_2_id)
  );

  // Send event to these players that the game started
  const game_room = getGameRoomName(game.id);

  io.sockets.sockets.get(player_1_socket_id).emit("gameStarted", {
    game_id: game.id,
    game_room: game_room,
  });

  io.sockets.sockets.get(player_2_socket_id).emit("gameStarted", {
    game_id: game.id,
    game_room: game_room,
  });

  io.sockets.sockets.get(player_1_socket_id).join(game_room);
  io.sockets.sockets.get(player_2_socket_id).join(game_room);
};

module.exports = startMatch;
