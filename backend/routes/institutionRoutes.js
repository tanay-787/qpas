import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import roleCheck from '../middlewares/roleCheck.js';
import extractUserData from '../middlewares/extractUserData.js';
import { createInstitution } from '../controllers/institution/createInstitution.js';
import { getInstitutionById } from '../controllers/institution/getInstitutionById.js';
import { getAllInstitutions } from '../controllers/institution/getAllInstitutions.js';
import { checkUserDetails } from '../controllers/checkUserDetails.js';
import { setFormDefinition, getFormDefinition } from '../controllers/verification-forms/index.js';

const router = Router();

// Public: Fetch all institutions
router.get('/', getAllInstitutions);

// Admin-only: Create an institution
router.post('/create', verifyToken, extractUserData, roleCheck('admin'), createInstitution);

// Admin-only: Set form definition for an institution
router.post('/:institution_id/form', verifyToken, extractUserData, roleCheck('admin'), setFormDefinition);

// Admin-only: Get form definition for an institution
router.get('/:institution_id/form', verifyToken, extractUserData, roleCheck('admin'), getFormDefinition);

// Admin-only: Fetch institution by UID
router.get('/admin-dashboard', verifyToken, extractUserData, roleCheck('admin'), getInstitutionById);

// Authenticated: Check user details(FOR TESTING ONLY)
router.get('/check', verifyToken, extractUserData, checkUserDetails);


  
export default router;
