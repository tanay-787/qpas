import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import roleCheck from '../middlewares/roleCheck.js';
import extractUserData from '../middlewares/extractUserData.js';
import { createInstitution } from '../controllers/institution/createInstitution.js';
import { getInstitutionByUid } from '../controllers/institution/getInstitutionByUid.js';
import { getInstitutionByMemberOf } from '../controllers/institution/getInstitutionByMemberOf.js';
import { getAllInstitutions } from '../controllers/institution/getAllInstitutions.js';
import { setFormDefinition, getFormDefinition } from '../controllers/verification-forms/index.js';
import { getTeachers } from '../controllers/institution/getTeachers.js';

const router = Router();

// Public: Fetch all institutions
router.get('/', getAllInstitutions);

// Admin-only: Create an institution
router.post('/create', verifyToken, extractUserData, createInstitution);

// Admin-only: Set form definition for an institution
router.post('/:institution_id/form-definition', verifyToken, extractUserData, roleCheck('admin'), setFormDefinition);

// Teacher-only: Get form definition for an institution
router.get('/:institution_id/teacher/form', verifyToken, extractUserData, getFormDefinition);

// Student-only: Get form definition for an institution
router.get('/:institution_id/student/form', verifyToken, extractUserData, getFormDefinition);

// Admin-only: Fetch institution by UID
router.get('/by-uid', verifyToken, extractUserData, roleCheck('admin'), getInstitutionByUid);

//Members-only
router.get('/by-memberOf', verifyToken, extractUserData, getInstitutionByMemberOf );

//Admin-only: Update institution(Add update controller)
router.patch('/update', verifyToken, extractUserData, roleCheck('admin'))

//Admin-only: Get Teachers
router.get('/:institution_id/members/teachers', verifyToken, extractUserData, roleCheck('admin'), getTeachers)

//Admin-only: Get Students
router.get('/:institution_id/members/students', verifyToken, extractUserData, roleCheck('admin'))
  
export default router;
