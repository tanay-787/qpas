import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import extractUserData from '../middlewares/extractUserData.js';
import roleCheck from '../middlewares/roleCheck.js';
import { validateQuestionPaper } from '../middlewares/validateQuestionPaper.js';
import { createQuestionPaper } from '../controllers/questionPaper/createQuestionPaper.js';

const router = Router();

// Fetch all question papers for an institution (Teacher only)
router.get('/public');


// Fetch all question papers for an institution
router.get('/:institution_id', verifyToken, extractUserData);

// Create a new question paper
router.post('/:institution_id/create', verifyToken, extractUserData, roleCheck('teacher'), validateQuestionPaper, createQuestionPaper);

router.delete('/:institution_id/delete/:qp_id', verifyToken, extractUserData, roleCheck('teacher'));

router.patch('/:institution_id/update/:qp_id', verifyToken, extractUserData, roleCheck('teacher'));

//add docURl to questionpaper



export default router;
