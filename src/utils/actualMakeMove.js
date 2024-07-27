/* 
  This function is responsible for making a move in a game.
  It validates the if of the game and players then validates 
  the move itself and checks if it is the player's turn to make
  a move. Then it updates the game in the database and alerts
  the other player that a move was made. If the game is over
  it alerts the players accordingly and updates the statistics
  of the players. Then cleans the database from all objects
  related to the game (game, chat, messages, moves) and removes 
  the game from the ONGOING_GAMES list on redis.

  The function `add_game_to_redis_if_not_present` is used to add
  the game to the ONGOING_GAMES list in redis if it is accidently
  removed from it due to race conditions. It adds it if the game
  exists in the database but not in the ONGOING_GAMES list on redis.
*/

const { Chess } = require("chess.js");
const prisma = require("../config/prismaClient");
const { ApiSuccess, ApiError } = require("./apiResponse");
const {
  getPlayerSocket,
  getGameRoomName,
  ONGOING_GAMES,
} = require("./redisUtils");
const {
  HTTP_404_NOT_FOUND,
  HTTP_400_BAD_REQUEST,
  HTTP_200_SUCCESS,
} = require("./statusCodes");
const { redisClient } = require("../config/connect_redis");
const { removeElementFromString } = require("./removeElement");

const actualMakeMove = async (io, req, res) => {
  const player_id = req.playerId;
  const game_id = +req.params["gameId"];
  const { move_notation } = req.body;

  const player = prisma.player.findUnique({
    where: { id: player_id },
  });

  if (!player) {
    return ApiError(res, "Player not found", HTTP_404_NOT_FOUND);
  }

  const game = await prisma.game.findUnique({
    where: { id: game_id },
  });

  if (!game) {
    return ApiError(res, "Game not found", HTTP_404_NOT_FOUND);
  }

  const player_socket_id = await redisClient.get(getPlayerSocket(player_id));

  if (!player_socket_id) {
    return ApiError(
      res,
      "Connect your socket to be able to play",
      HTTP_400_BAD_REQUEST
    );
  }

  add_game_to_redis_if_not_present(game_id);

  if (
    (game.turn == 1 && player_id != game.firstPlayerId) ||
    (game.turn == 2 && player_id != game.secondPlayerId)
  ) {
    return ApiError(res, "Not your turn", HTTP_400_BAD_REQUEST);
  }

  // 2. Validate the move
  const board = new Chess(game.board);
  let move = undefined;

  try {
    move = board.move(move_notation);
  } catch (error) {
    return ApiError(res, "Invalid move", HTTP_400_BAD_REQUEST);
  }

  console.log(board.ascii());

  //   3. Update the game in the database
  const game_move = await prisma.move.create({
    data: {
      game: { connect: { id: game_id } },
      player: player_id == game.firstPlayerId ? 1 : 2,
      move_notation: move_notation,
    },
  });

  await prisma.game.update({
    where: { id: game_id },
    data: {
      board: move.after,
      moves: { connect: { id: game_move.id } },
      turn: player_id == game.firstPlayerId ? 2 : 1,
      last_move_at: new Date(),
    },
  });

  // 4. Alert the other player that a move was made
  // 5. Check if the game is draw or checkmate and alert the players accordingly

  const receiver_id =
    player_id == game.firstPlayerId ? game.secondPlayerId : game.firstPlayerId;

  const receiver_socket_id = await redisClient.get(
    getPlayerSocket(receiver_id)
  );

  const game_over = board.isCheckmate() || board.isDraw();

  if (!game_over) {
    io.sockets.sockets.get(receiver_socket_id).emit("move", {
      move_notation: move_notation,
      board: move.after,
    });

    return ApiSuccess(
      res,
      game_move,
      "Move made successfully",
      HTTP_200_SUCCESS
    );
  } else {
    const game_room = getGameRoomName(game_id);
    // update statistics
    if (board.isDraw()) {
      io.to(game_room).emit("draw");

      await prisma.playerStats.update({
        where: { playerId: game.firstPlayerId },
        data: { draws: { increment: 1 } },
      });

      await prisma.playerStats.update({
        where: { playerId: game.secondPlayerId },
        data: { draws: { increment: 1 } },
      });
    } else if (board.isCheckmate()) {
      let loser_id = null; // the player who lost
      let winner_id = null; // the player who won

      if (player_id == game.firstPlayerId) {
        loser_id = game.secondPlayerId;
        winner_id = game.firstPlayerId;
      } else {
        winner_id = game.secondPlayerId;
        loser_id = game.firstPlayerId;
      }

      const winner_socket_id = await redisClient.get(
        getPlayerSocket(winner_id)
      );

      const loser_socket_id = await redisClient.get(getPlayerSocket(loser_id));

      io.to(game_room).emit("checkmate", winner_id);

      io.sockets.sockets.get(winner_socket_id).emit("won");
      io.sockets.sockets.get(loser_socket_id).emit("lost");

      await prisma.playerStats.update({
        where: { playerId: winner_id },
        data: { wins: { increment: 1 } },
      });

      await prisma.playerStats.update({
        where: { playerId: loser_id },
        data: { losses: { increment: 1 } },
      });
    }

    io.sockets.sockets
      .get(getPlayerSocket(game.firstPlayerId))
      .leave(game_room);

    io.sockets.sockets
      .get(getPlayerSocket(game.secondPlayerId))
      .leave(game_room);

    let ongoing_games = await redisClient.get(ONGOING_GAMES);

    let new_ongoing_games = "";
    for (let i = 0; i < ongoing_games.length; i++) {
      if (ongoing_games[i] != `${game_id}`) {
        new_ongoing_games += `|${ongoing_games[i]}`;
      }
    }

    await redisClient.set(ONGOING_GAMES, new_ongoing_games);
    const game = await prisma.game.findUnique({ where: { id: game_id } });

    // remove all moves related to that game from the database
    await prisma.move.deleteMany({ where: { gameId: game_id } });

    // remove all messages in this chat
    await prisma.message.deleteMany({
      where: { chatId: game.chatId },
    });

    // remove chat related to that game from the database
    await prisma.chat.delete({ where: { id: game.chatId } });

    // remove game from database
    await prisma.game.delete({ where: { id: game_id } });

    let message = board.isDraw()
      ? "Draw!!"
      : `Player ${player_id} won the game!!`;

    return ApiSuccess(res, null, message, HTTP_200_SUCCESS);
  }
};

const add_game_to_redis_if_not_present = async (game_id) => {
  let ongoing_games = await redisClient.get(ONGOING_GAMES);

  if (ongoing_games[0 == "|"])
    ongoing_games = removeElementFromString(ongoing_games, 0);

  ongoing_games = ongoing_games.split("|");

  if (!ongoing_games.includes(`${game_id}`)) {
    ongoing_games += `|${game.id}`;
    await redisClient.set(ONGOING_GAMES, ongoing_games);
  }
};

module.exports = actualMakeMove;
