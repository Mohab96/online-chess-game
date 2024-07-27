const bcrypt = require("bcrypt");

const verifyPassword = async (password, user_password) => {
  return await bcrypt.compare(password, user_password);
};

module.exports = verifyPassword;
