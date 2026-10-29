const { body, validationResult } = require("express-validator");

/* ---------------- COMMON ERROR HANDLER ---------------- */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

/* ---------------- AUTH VALIDATORS ---------------- */
exports.registerValidator = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

  body("email")
    .isEmail().withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  handleValidation
];

exports.loginValidator = [
  body("email")
    .isEmail().withMessage("Valid email is required"),

  body("password")
    .notEmpty().withMessage("Password is required"),

  handleValidation
];

/* ---------------- QUESTION VALIDATORS ---------------- */
exports.questionValidator = [
  body("title")
    .notEmpty().withMessage("Question title is required")
    .isLength({ min: 5 }).withMessage("Title must be at least 5 characters"),

  body("desc")
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("tag")
    .notEmpty().withMessage("Tag is required"),

  handleValidation
];




exports.answerValidator = [
  body("text")
    .notEmpty().withMessage("Answer text is required")
    .isLength({ min: 3 }).withMessage("Answer must be at least 3 characters"),

  handleValidation
];
