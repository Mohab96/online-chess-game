const { expressjwt } = require("express-jwt");
const wrap = require("express-async-wrapper");
const endpoints = require("../utils/endpoints.js");
const verifyToken = require("../utils/verifyToken");
const { INVALIDATED_TOKENS } = require("../utils/redisUtils.js");
const { redisClient } = require("../config/connect_redis.js");
const { ApiError } = require("../utils/apiResponse.js");
const secret = process.env.JWT_SECRET;

const allowedRoutes = [
  { method: "GET", route: "/api/health" },
  { method: "GET", route: "/api/search/:query" },
  { method: "POST", route: `${endpoints.AUTH}/check-email` },
  { method: "POST", route: `${endpoints.AUTH}/login` },
  { method: "POST", route: `${endpoints.AUTH}/register` },
  { method: "POST", route: `${endpoints.AUTH}/resend-code` },
  { method: "POST", route: `${endpoints.AUTH}/reset-password` },
  { method: "POST", route: `${endpoints.AUTH}/verify-email` },
];

const isRevoked = wrap(async (req, token) => {
  if (req.headers.authorization) {
    const invalidated_tokens = await redisClient.get(INVALIDATED_TOKENS);
    const is_invalidated_token = invalidated_tokens
      .split("|")
      .includes(req.headers.authorization);

    if (is_invalidated_token) {
      return ApiError(
        res,
        "Unauthorized: token has been invalidated, please login again",
        HTTP_401_UNAUTHORIZED
      );
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = await verifyToken(token, secret);

    req.playerId = decoded.playerId;
  }
});

const authJwt = expressjwt({ secret, isRevoked, algorithms: ["HS256"] }).unless(
  {
    custom: (req) => {
      let allowed = false;

      allowedRoutes.forEach(({ method, route }) => {
        if (req.method === method && req.path === route) {
          allowed = true;
          return;
        }
      });

      return allowed;
    },
  }
);

module.exports = authJwt;
