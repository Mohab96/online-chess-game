const jwt = require("jsonwebtoken");

const verifyToken = async (token, secret) => {
  return await jwt.verify(token, secret);
};

module.exports = verifyToken;
