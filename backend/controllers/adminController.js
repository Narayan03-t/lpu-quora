const Question = require("../models/Question");
const Answer = require("../models/Answer");

exports.deleteQuestion = async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  await Answer.deleteMany({ questionId: req.params.id });
  res.send("Question deleted");
};



exports.deleteAnswer = async (req, res) => {
  try {
    await Answer.findByIdAndDelete(req.params.id);
    res.json({ message: "Answer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete answer" });
  }
};

