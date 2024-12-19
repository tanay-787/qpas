import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import extractUserData from '../middlewares/extractUserData.js';
import roleCheck from '../middlewares/roleCheck.js';
import { addToWaitingLobby } from '../controllers/waitingLobby/addToWaitingLobby.js';
import { getPendingRequests } from '../controllers/waitingLobby/getPendingRequests.js';
import { updateRequestStatus } from '../controllers/waitingLobby/updateRequestStatus.js';

const router = Router();

// Add a user to the waiting lobby of a specific institution
router.post('/:institution_id/join', verifyToken, extractUserData, addToWaitingLobby);

// Fetch all pending requests for teachers (Admin only)
router.get('/:institution_id/teachers', verifyToken, extractUserData, roleCheck('admin'), getPendingRequests);

// Fetch all pending requests for students (Teacher only)
router.get('/:institution_id/students', verifyToken, extractUserData, roleCheck('teacher'), getPendingRequests);

// Approve or reject a teacher's request (Admin only)
router.patch('/:institution_id/teachers/:id', verifyToken, extractUserData, roleCheck('admin'), updateRequestStatus);

// Approve or reject a student's request (Teacher only)
router.patch('/:institution_id/students/:id', verifyToken, extractUserData, roleCheck('teacher'), updateRequestStatus);

export default router;
