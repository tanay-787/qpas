import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import roleCheck from '../middlewares/roleCheck.js';
import extractUserData from '../middlewares/extractUserData.js';
import { createInstitution } from '../controllers/institution/createInstitution.js';
import { getInstitutionById } from '../controllers/institution/getInstitutionById.js';
import { getAllInstitutions } from '../controllers/institution/getAllInstitutions.js';
import { checkUserDetails } from '../controllers/checkUserDetails.js';

const router = express.Router();

// Admin-only: Create an institution
router.post('/create', verifyToken, extractUserData, roleCheck('admin'), createInstitution);

// Admin-only: Fetch institution by UID
router.get('/admin-dashboard', verifyToken, extractUserData, roleCheck('admin'), getInstitutionById);

// Public: Fetch all institutions
router.get('/', getAllInstitutions);

// Authenticated: Check user details(FOR TESTING ONLY)
router.get('/check', verifyToken, extractUserData, checkUserDetails);


  
export default router;
