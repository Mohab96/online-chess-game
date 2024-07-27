const redis = require("redis");
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient(REDIS_PORT, "localhost");

const connect_redis = async () => {
  try {
    await redisClient.connect();
    console.log(`Redis connected successfully to port ${REDIS_PORT}`);
  } catch (error) {
    console.error("Unable to connect to Redis:", error);
  }
};

module.exports = { connect_redis, redisClient };
