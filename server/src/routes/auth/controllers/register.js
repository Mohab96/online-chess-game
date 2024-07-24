const prisma = require("../../../config/prismaClient");
const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const hashPassword = require("../../../utils/hashPassword");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
  HTTP_201_CREATED,
} = require("../../../utils/statusCodes");

const register = async (req, res, next) => {
  const { username, email, password, first_name, last_name, phone } = req.body;

  // Check if the email is already registered
  const email_exists = await prisma.player.findUnique({
    where: {
      email: email,
    },
  });

  if (email_exists) {
    return ApiError(res, "Email is already registered", HTTP_400_BAD_REQUEST);
  }

  // Check if the username is already taken
  const username_exists = await prisma.player.findUnique({
    where: {
      username: username,
    },
  });

  if (username_exists) {
    return ApiError(
      res,
      "Username is already registered",
      HTTP_400_BAD_REQUEST
    );
  }

  // Check if the phone number is already registered
  if (phone) {
    const phone_exists = await prisma.player.findUnique({
      where: {
        phone: phone,
      },
    });

    if (phone_exists)
      return ApiError(res, "Phone is already registered", HTTP_400_BAD_REQUEST);
  }

  hashed_password = await hashPassword(password);

  // Trnasaction
  //    Create playerStats object
  //    Create playerSettings object
  //    Create player object

  try {
    let player;

    await prisma.$transaction(
      async (tx) => {
        player = await tx.player.create({
          data: {
            username: username,
            email: email,
            password: hashed_password,
            first_name: first_name,
            last_name: last_name,
            phone: phone,
          },
        });

        await tx.playerStats.create({
          data: {
            playerId: player.id,
          },
        });

        await tx.setting.create({
          data: {
            playerId: player.id,
          },
        });
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

    return ApiSuccess(
      res,
      player,
      "Player registered successfully",
      HTTP_201_CREATED
    );
  } catch (error) {
    console.log(error.message);

    return ApiError(
      res,
      "An error occurred during registration",
      HTTP_500_INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = register;
