const { ApiSuccess } = require("../../../utils/apiResponse");
const hashPassword = require("../../../utils/hashPassword");
const prisma = require("../../../config/prismaClient");

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const password = await hashPassword(newPassword);

  await prisma.player.update({
    where: { email: email },
    data: { password: password },
  });

  return ApiSuccess(res, { email }, "Password has been changed successfully");
};

module.exports = resetPassword;
