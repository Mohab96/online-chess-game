const jwt = require("jsonwebtoken");

const generateToken = async (payload, tokenType, period = "7d") => {
  return jwt.sign(payload, tokenType, { expiresIn: period });
};

module.exports = generateToken;
