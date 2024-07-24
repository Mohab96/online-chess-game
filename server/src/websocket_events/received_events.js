const { redisClient } = require("../config/connect_redis");
const { getPlayerSocket, getGameRoomName } = require("../utils/redisUtils");
const prisma = require("../config/prismaClient");

const listen_to_events = (io) => {
  io.on("connect", (socket) => {
    console.log(
      `Player #${socket.playerId} connected on socket with id #${socket.id}`
    );

    join_game_if_player_is_reconnecting(io, socket.playerId);

    socket.on("disconnect", () => {
      console.log(
        `Player #${socket.playerId} disconnected from socket with id #${socket.id}`
      );

      redisClient.del(getPlayerSocket(socket.playerId));
    });
  });
};

const join_game_if_player_is_reconnecting = async (io, player_id) => {
  const game = await prisma.game.findFirst({
    where: {
      OR: [{ firstPlayerId: player_id }, { secondPlayerId: player_id }],
    },
  });

  if (game) {
    const game_room = getGameRoomName(game.id);
    const player_socket_id = await redisClient.get(getPlayerSocket(player_id));
    io.sockets.sockets.get(player_socket_id).join(game_room);
  }
};

module.exports = listen_to_events;
