const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { 
    type: String, 
    required: function() { return this.authProvider === 'local'; } 
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  googleId: String,
  avatar: String,
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);



