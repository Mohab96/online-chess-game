const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const {
  HTTP_500_INTERNAL_SERVER_ERROR,
  HTTP_200_SUCCESS,
} = require("../../../utils/statusCodes");
const { getPlayerSocket } = require("../../../utils/redisUtils");
const { redisClient } = require("../../../config/connect_redis");
const { io } = require("../../../config/sockets");

const sendMessage = async (req, res) => {
  const firstPlayerId = req.playerId;
  let { secondPlayerId, message } = req.body;
  secondPlayerId = +secondPlayerId;

  const receiver_socket_id = await redisClient.get(
    getPlayerSocket(secondPlayerId)
  );

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

    let newMessage;

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

      newMessage = await prisma.message.create({
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

      newMessage = await prisma.message.create({
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

    io.sockets.sockets.get(receiver_socket_id).emit("message", {
      sender_id: sender_id,
      message: message,
    });

    return ApiSuccess(
      res,
      newMessage,
      "Message sent successfully",
      HTTP_200_SUCCESS
    );
  } catch (error) {
    console.log(error.message);

    return ApiError(
      res,
      "An error occured while sending your message",
      HTTP_500_INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = sendMessage;
