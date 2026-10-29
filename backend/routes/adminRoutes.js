

const router = require("express").Router();
const user = require("../middleware/userMiddleware");
const admin = require("../middleware/adminMiddleware");
const { verifyOtp } = require("../controllers/authController");
const {
  deleteQuestion,
  deleteAnswer
} = require("../controllers/adminController");

router.post("/verify-otp", verifyOtp); // otp
router.delete("/question/:id", user, admin, deleteQuestion);
router.delete("/answer/:id", user, admin, deleteAnswer);

module.exports = router;
