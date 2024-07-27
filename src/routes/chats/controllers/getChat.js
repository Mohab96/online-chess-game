/* 
  This endpoint is used to get a chat between two players.
  Between the currently authentcaited player and the player
  with the id provided in the request body.If the chat does
  not exist, it will be created and returned. If the chat
  exists, it will be returned along with the messages in it.
  If a range query parameter is provided, the messages in
  the range will be returned. 

  format: /chats/getChat?range=from_to
  If from is less than 0 it will be set to 1.
  If to is greater than the last message index, it will be
  set to the last message index.
*/

const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const {
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../utils/statusCodes");

const getChat = async (req, res) => {
  const firstPlayerId = req.playerId;
  const secondPlayerId = +req.body["secondPlayerId"];
  const range = req.query["range"];

  try {
    if (range) {
      try {
        let [from, to] = range.split("_");
        from = +from;
        to = +to;

        const chat = await prisma.chat.findFirst({
          where: {
            firstPlayerId: Math.min(firstPlayerId, secondPlayerId),
            secondPlayerId: Math.max(firstPlayerId, secondPlayerId),
          },
        });

        from = Math.max(from, 1);
        to = Math.min(to, +chat.last_message_index);

        const messages = await prisma.message.findMany({
          where: {
            chatId: chat.id,
            index: {
              gte: from,
              lte: to,
            },
          },
          orderBy: {
            index: "asc",
          },
        });

        return ApiSuccess(res, messages);
      } catch (error) {
        console.log(error.message);

        return ApiError(
          res,
          "An error occured while retrieving your chat",
          HTTP_500_INTERNAL_SERVER_ERROR
        );
      }
    }

    const chat = await prisma.chat.findFirst({
      where: {
        firstPlayerId: Math.min(firstPlayerId, secondPlayerId),
        secondPlayerId: Math.max(firstPlayerId, secondPlayerId),
      },
      include: {
        messages: {
          orderBy: {
            index: "asc",
          },
        },
      },
    });

    if (!chat) {
      const chat = await prisma.chat.create({
        data: {
          first_player: {
            connect: { id: Math.min(firstPlayerId, secondPlayerId) },
          },
          second_player: {
            connect: { id: Math.max(firstPlayerId, secondPlayerId) },
          },
        },
      });

      return ApiSuccess(res, chat);
    }

    return ApiSuccess(res, chat);
  } catch (error) {
    console.log(error.message);

    return ApiError(
      res,
      "An error occured while retrieving your chat",
      HTTP_500_INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = getChat;
