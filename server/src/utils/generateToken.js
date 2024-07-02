const jwt = require("jsonwebtoken");

const generateToken = async (payload, tokenType, period = "100y") => {
  return await jwt.sign(payload, tokenType, { expiresIn: period });
};

module.exports = generateToken;
