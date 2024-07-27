/* 
  This is the function that is actually responsible for sending
  messages between two players. It searches for a chat between
  the currently authenticated player and the player with the id
  provided in the request body. If the chat does not exist, it
  will be created. If the chat does not exist or has no messages
  yet, the message index will be set to 1 and also the index of
  the first and last messages in chat will be set to 1. If the
  chat already exists, the message index will be equal to the 
  index of the last message in the chat plus 1 and the index of 
  the last message in the chat will be updated. The message will
  be sent to the receiver using the socket id stored in redis.
*/

const { redisClient } = require("../config/connect_redis");
const prisma = require("../config/prismaClient");
const { ApiSuccess, ApiError } = require("./apiResponse");
const { getPlayerSocket } = require("./redisUtils");
const {
  HTTP_200_SUCCESS,
  HTTP_500_INTERNAL_SERVER_ERROR,
  HTTP_400_BAD_REQUEST,
} = require("./statusCodes");

const actualSendMessage = async (io, req, res) => {
  const firstPlayerId = req.playerId;
  let { secondPlayerId, message } = req.body;
  secondPlayerId = +secondPlayerId;

  if (firstPlayerId === secondPlayerId) {
    return ApiError(
      res,
      "You cannot send a message to yourself",
      HTTP_400_BAD_REQUEST
    );
  }

  const receiver_socket_id = await redisClient.get(
    getPlayerSocket(secondPlayerId)
  );

  try {
    let chat = await prisma.chat.findFirst({
      where: {
        firstPlayerId: Math.min(firstPlayerId, secondPlayerId),
        secondPlayerId: Math.max(firstPlayerId, secondPlayerId),
      },
    });

    let newMessage;

    if (!chat || chat.first_message_index == -1) {
      // First message in the chat
      if (!chat) {
        chat = await prisma.chat.create({
          data: {
            first_player: {
              connect: { id: Math.min(firstPlayerId, secondPlayerId) },
            },
            second_player: {
              connect: { id: Math.max(firstPlayerId, secondPlayerId) },
            },
          },
        });
      }

      await prisma.$transaction(
        async (tx) => {
          newMessage = await tx.message.create({
            data: {
              chatId: chat.id,
              senderId: firstPlayerId,
              content: message,
              index: 1,
            },
          });

          await tx.chat.update({
            where: {
              id: chat.id,
            },
            data: {
              first_message_index: 1,
              last_message_index: 1,
            },
          });
        },
        {
          maxWait: 5000,
          timeout: 10000,
        }
      );
    } else {
      // Not first message in the chat

      await prisma.$transaction(
        async (tx) => {
          const lastMessage = await tx.message.findFirst({
            where: {
              chatId: chat.id,
              index: chat.last_message_index,
            },
          });

          newMessage = await tx.message.create({
            data: {
              chatId: chat.id,
              senderId: firstPlayerId,
              content: message,
              index: lastMessage.index + 1,
            },
          });

          await tx.chat.update({
            where: {
              id: chat.id,
            },
            data: {
              last_message_index: newMessage.index,
            },
          });
        },
        {
          maxWait: 5000,
          timeout: 10000,
        }
      );
    }

    io.sockets.sockets.get(receiver_socket_id).emit("message", {
      sender_id: firstPlayerId,
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

module.exports = actualSendMessage;
