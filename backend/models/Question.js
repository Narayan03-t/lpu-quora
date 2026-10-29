const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,
  desc: String,
  tag: String,
  userId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
