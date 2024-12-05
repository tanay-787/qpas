import { Router } from 'express';
import verifyToken from '../middlewares/auth.js';
import roleCheck from '../middlewares/roleCheck.js';
import { createInstitution, getInstitutions, checkUserDetails } from '../controllers/institutionController.js';

const router = Router();

router.post('/', verifyToken, roleCheck('admin'), createInstitution);
router.get('/', verifyToken, roleCheck('admin'), getInstitutions);
router.get('/user', verifyToken, checkUserDetails);

export default router;
