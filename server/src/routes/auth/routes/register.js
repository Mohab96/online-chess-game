const prisma = require("../../../config/prismaClient");
const { ApiSuccess, ApiError } = require("../../../utils/apiResponse");
const hashPassword = require("../../../utils/hashPassword");

const register = async (req, res, next) => {
  const { username, email, password, first_name, last_name, phone } = req.body;

  // Check if the email is already registered
  const email_exists = await prisma.player.findUnique({
    where: {
      email: email,
    },
  });

  if (email_exists) {
    return next(ApiError(res, "Email is already registered", 400));
  }

  // Check if the username is already taken
  const username_exists = await prisma.player.findUnique({
    where: {
      username: username,
    },
  });

  if (username_exists) {
    return next(ApiError(res, "Username is already registered", 400));
  }

  // Check if the phone number is already registered
  if (phone) {
    const phone_exists = await prisma.player.findUnique({
      where: {
        phone: phone,
      },
    });

    if (phone_exists)
      return next(ApiError(res, "Phone is already registered", 400));
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

    return ApiSuccess(res, player, "Player registered successfully", 201);
  } catch (error) {
    console.log(error);

    return next(ApiError(res, "An error occurred during registration", 500));
  }
};

module.exports = register;
