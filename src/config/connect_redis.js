const redis = require("redis");
const redisClient = redis.createClient(6379, "redis");

const connect_redis = async () => {
  try {
    await redisClient.connect();
    console.log(`Redis connected successfully to port 6379`);
  } catch (error) {
    console.error("Unable to connect to Redis:", error);
  }
};

module.exports = { connect_redis, redisClient };
