import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import extractUserData from "../middlewares/extractUserData.js";
import roleCheck from "../middlewares/roleCheck.js";
import {
  validateQuestionPaper,
  validateFile,
} from "../middlewares/validateQuestionPaper.js";

// Import all controllers
import {
  createQuestionPaper,
  uploadMiddleware,
} from "../controllers/question-papers/createQuestionPaper.js";
import { getAllQuestionPapers } from "../controllers/question-papers/getAllQuestionPapers.js";
import { getTeacherQuestionPapers } from "../controllers/question-papers/getTeacherQuestionPapers.js";
import { updateQuestionPaper } from "../controllers/question-papers/updateQuestionPaper.js";
import { deleteQuestionPaper } from "../controllers/question-papers/deleteQuestionPaper.js";
import { updateQuestionPaperAccess } from "../controllers/question-papers/updateQuestionPaperAccess.js";
import { getQuestionPapersByInstitution } from "../controllers/question-papers/getQuestionPapersByInstitution.js";

const router = Router();

// Public routes
router.get("/public", getAllQuestionPapers);

// Protected routes - require authentication
router.use(verifyToken);
router.use(extractUserData);

// Get all question papers for an institution
router.get("/:institution_id", getQuestionPapersByInstitution);

// Get teacher's question papers
router.get("/:institution_id/teacher", roleCheck("teacher"), getTeacherQuestionPapers);

// Create a new question paper
router.post(
  "/:institution_id/create",
  roleCheck("teacher"),
  uploadMiddleware,
  validateFile,
  validateQuestionPaper,
  createQuestionPaper
);

// Update question paper
router.put(
  "/:institution_id/update/:qp_id",
  roleCheck("teacher"),
  updateQuestionPaper
);

// Delete question paper
router.delete(
  "/:institution_id/delete/:qp_id",
  roleCheck("teacher"),
  deleteQuestionPaper
);

export default router;
