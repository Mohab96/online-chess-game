const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const prisma = require("../../../config/prismaClient");
const io = require("../../../config/server");

const deleteMessage = async (req, res, next) => {
  const firstPlayerId = req.playerId;
  const { secondPlaterId, messageId } = req.body;

  try {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return next(ApiError(res, "Message not found", 404));
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    if (message.senderId !== firstPlayerId) {
      return next(
        ApiError(
          res,
          "Unauthorized: Only the sender can delete the message",
          401
        )
      );
    }

    if (message.nextMessageId && !message.previousMessageId) {
      // First message in the chat
      const nextMessage = await prisma.message.findUnique({
        where: {
          id: message.nextMessageId,
        },
      });

      await prisma.chat.update({
        where: {
          id: message.belongsToChatId,
        },
        data: {
          firstMessageId: nextMessage.id,
        },
      });

      await prisma.message.update({
        where: {
          id: nextMessage.id,
        },
        data: {
          previousMessageId: null,
        },
      });
    } else if (!message.nextMessageId && message.previousMessageId) {
      // Last message in the chat
      const previousMessage = await prisma.message.findUnique({
        where: {
          id: message.previousMessageId,
        },
      });

      await prisma.chat.update({
        where: {
          id: message.belongsToChatId,
        },
        data: {
          lastMessageId: previousMessage.id,
        },
      });

      await prisma.message.update({
        where: {
          id: previousMessage.id,
        },
        data: {
          nextMessageId: null,
        },
      });
    } else if (message.nextMessageId && message.previousMessageId) {
      // Message in the middle of the chat
      const nextMessage = await prisma.message.findUnique({
        where: {
          id: message.nextMessageId,
        },
      });

      const previousMessage = await prisma.message.findUnique({
        where: {
          id: message.previousMessageId,
        },
      });

      await prisma.message.update({
        where: {
          id: nextMessage.id,
        },
        data: {
          previousMessageId: previousMessage.id,
        },
      });

      await prisma.message.update({
        where: {
          id: previousMessage.id,
        },
        data: {
          nextMessageId: nextMessage.id,
        },
      });
    }

    // io.to(secondPlayerId).emit("deleteMessage", {
    //   chatId: chat.id,
    //   id: messageId,
    // });

    return ApiSuccess(res, message, "Message deleted successfully", 200);
  } catch (error) {
    console.log(error.message);

    return next(
      ApiError(res, "An error occured while deleting your message", 500)
    );
  }
};

module.exports = deleteMessage;
