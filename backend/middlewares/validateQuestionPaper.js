import { body, validationResult } from "express-validator";

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

    body("stream")
        .optional()
        .trim()
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage("Stream must be a valid string (max 50 characters)."),

    body("semester")
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be a number between 1 and 8."),
    
    body("year")
        .optional()
        .trim()
        .isString()
        .isLength({ min: 1, max: 5 })
        .withMessage("Year must be a string (max 5 characters)."),

    body("documentUrl")
        .optional()
        .isURL()
        .withMessage("Invalid document URL."),

    body("accessType")
        .isIn(["private", "public"])
        .withMessage("Access type must be 'private' or 'public'."),

    // Middleware to return errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Continue if no validation errors
    }
];
