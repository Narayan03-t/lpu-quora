const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  password: process.env.REDIS_PASS,
});

redisClient.on("connect", () => console.log("✅ Redis Connected"));
redisClient.on("error", err => console.error("Redis Error", err));

redisClient.connect();
module.exports = redisClient;
