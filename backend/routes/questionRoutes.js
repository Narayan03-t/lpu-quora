const router = require("express").Router();
const user = require("../middleware/userMiddleware");
const {
  questionValidator,
  answerValidator
} = require("../utils/validator");
const {
  getQuestions,
  askQuestion,
  addAnswer
} = require("../controllers/questionController");

router.get("/", getQuestions);
router.post("/", user, questionValidator, askQuestion);
router.post("/:id/answer", user, answerValidator, addAnswer);

module.exports = router;

