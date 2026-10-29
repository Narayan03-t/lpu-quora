const Question = require("../models/Question");
const Answer = require("../models/Answer");

/* =========================
   GET ALL QUESTIONS + ANSWERS
   ========================= */
exports.getQuestions = async (req, res) => {
  try {
    // 1️⃣ Get all questions (latest first)
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .lean(); // IMPORTANT for merging data

    // 2️⃣ Get all question IDs
    const questionIds = questions.map(q => q._id);

    // 3️⃣ Get all answers related to those questions (latest first)
    // const answers = await Answer.find({
    //   questionId: { $in: questionIds }
    // }).sort({ createdAt: -1 });


    // 3️⃣ Get all answers related to those questions (latest first)
const answers = await Answer.find({
  questionId: { $in: questionIds }
})
.populate("userId", "name")
.sort({ createdAt: -1 });





    // 4️⃣ Group answers by questionId
    const answerMap = {};
    
    answers.forEach(ans => {
      const qid = ans.questionId.toString();
      if (!answerMap[qid]) answerMap[qid] = [];
      answerMap[qid].push(ans);
    });

    // 5️⃣ Attach answers to questions
    const finalQuestions = questions.map(q => ({
      ...q,
      answers: answerMap[q._id.toString()] || []
    }));

    res.json(finalQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load questions" });
  }
};



/* =========================
   ADD QUESTION
   ========================= */
exports.askQuestion = async (req, res) => {
  await Question.create({
    ...req.body,
    userId: req.user._id
  });

  res.send("Question added");
};


/* =========================
   ADD ANSWER
   ========================= */
exports.addAnswer = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await Answer.create({
    text: req.body.text,
    questionId: req.params.id,
    userId: req.user._id
  });

  res.json({ message: "Answer added" });
};
