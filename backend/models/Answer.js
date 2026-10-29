// const mongoose = require("mongoose");

// const answerSchema = new mongoose.Schema({
//   text: String,
//   questionId: mongoose.Schema.Types.ObjectId,
//   userId: mongoose.Schema.Types.ObjectId
// }, { timestamps: true });

// module.exports = mongoose.model("Answer", answerSchema);




const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    text: String,

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);

