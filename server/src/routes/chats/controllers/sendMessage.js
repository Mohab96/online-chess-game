const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const statusCodes = require("../../../utils/statusCodes");

const sendMessage = async (req, res, next) => {
  const firstPlayerId = req.playerId;
  let { secondPlayerId, message } = req.body;
  secondPlayerId = +secondPlayerId;

  try {
    let chat = await prisma.chat.findFirst({
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
    });

    if (!chat || !chat.firstMessageId) {
      // First message in the chat
      if (!chat) {
        chat = await prisma.chat.create({
          data: {
            firstPlayerId: firstPlayerId,
            secondPlayerId: secondPlayerId,
          },
        });
      }

      const newMessage = await prisma.message.create({
        data: {
          belongsToChat: {
            connect: { id: chat.id },
          },
          content: message,
          sender: {
            connect: { id: firstPlayerId },
          },
        },
      });

      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          firstMessageId: newMessage.id,
          lastMessageId: newMessage.id,
        },
      });
    } else {
      // Not first message in the chat
      const lastMessage = await prisma.message.findFirst({
        where: {
          id: chat.lastMessageId,
        },
      });

      const newMessage = await prisma.message.create({
        data: {
          belongsToChatId: chat.id,
          senderId: firstPlayerId,
          content: message,
          previousMessageId: lastMessage.id,
        },
      });

      await prisma.message.update({
        where: {
          id: chat.lastMessageId,
        },
        data: {
          nextMessageId: newMessage.id,
        },
      });

      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          lastMessageId: newMessage.id,
        },
      });
    }

    // io.to(secondPlayerId).emit("newMessage", {
    //   chatId: chat.id,
    //   senderId: firstPlayerId,
    //   message: message,
    // });

    return ApiSuccess(
      res,
      message,
      "Message sent successfully",
      statusCodes.HTTP_200_SUCCESS
    );
  } catch (error) {
    console.log(error.message);

    return next(
      ApiError(res, "An error occured while retrieving your chat", 500)
    );
  }
};

module.exports = sendMessage;
