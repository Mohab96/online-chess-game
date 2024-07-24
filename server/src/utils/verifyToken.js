const jwt = require("jsonwebtoken");

const verifyToken = async (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = verifyToken;
