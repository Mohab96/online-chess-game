const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");

const getChat = async (req, res, next) => {
  const firstPlayerId = req.playerId;
  const secondPlayerId = +req.body["secondPlayerId"];

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            firstPlayerId: firstPlayerId,
            secondPlayerId: secondPlayerId,
          },
          {
            firstPlayerId: secondPlayerId,
            secondPlayerId: firstPlayerId,
          },
        ],
      },
      include: {
        messages: {
          orderBy: {
            sent_at: "asc",
          },
        },
      },
    });

    if (!chat) {
      const chat = await prisma.chat.create({
        data: {
          first_player: {
            connect: { id: firstPlayerId },
          },
          second_player: {
            connect: { id: secondPlayerId },
          },
        },
      });

      return ApiSuccess(res, chat);
    }

    return ApiSuccess(res, chat);
  } catch (error) {
    console.log(error.message);

    return next(
      ApiError(res, "An error occured while retrieving your chat", 500)
    );
  }
};

module.exports = getChat;
