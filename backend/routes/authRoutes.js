

const router = require("express").Router();
const { register, login,  verifyOtp, googleAuth, forgotPassword, verifyResetOtp, resetPassword } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp); 
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
