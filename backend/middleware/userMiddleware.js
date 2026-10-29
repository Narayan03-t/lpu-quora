const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("No token");

    const blocked = await redisClient.exists(`token:${token}`);
    if (blocked) throw new Error("Token blocked");

 const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(payload.id);


    next();
  } catch {
    res.status(401).send("Unauthorized");
  }
};


