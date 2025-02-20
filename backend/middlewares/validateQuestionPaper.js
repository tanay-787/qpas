import { body, validationResult } from "express-validator";

// Validation rules (for non-file fields)
export const validateQuestionPaper = [
  body("name")
    .trim()
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters."),

  body("subject")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Subject is required."),

  body("degree")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Degree is required."),

  body("examinationType")
    .isIn(["Regular", "ATKT"])
    .withMessage("Examination type must be 'Regular' or 'ATKT'."),

  body("accessType")
    .isIn(["private", "public"])
    .withMessage("Access type must be 'private' or 'public'."),

  // Middleware to check validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware for file validation
export const validateFile = (req, res, next) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Question paper file is required" }] });
  }

  // Check file type (Only PDFs allowed)
  if (req.file.mimetype !== "application/pdf") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Only PDF files are allowed" }] });
  }

  // Check file size (Max: 3MB)
  const maxSize = 3 * 1024 * 1024; // 3MB
  if (req.file.size > maxSize) {
    return res
      .status(400)
      .json({ errors: [{ msg: "File size must be less than 3MB" }] });
  }

  next();
};
