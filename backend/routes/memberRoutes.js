import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import roleCheck from '../middlewares/roleCheck.js';
import extractUserData from '../middlewares/extractUserData.js';

//Controllers
import { getTeachers } from '../controllers/members/getTeachers.js';
import { getStudents } from '../controllers/members/getStudents.js';
import { removeTeacher } from '../controllers/members/removeTeacher.js';
import { removeStudent } from '../controllers/members/removeStudent.js';


const router = Router();


//Handle Teachers
router.get('/:institution_id/teachers', verifyToken, extractUserData, roleCheck('admin'), getTeachers);

router.post('/:institution_id/teachers/:teacher_id/remove', verifyToken, extractUserData, roleCheck('admin'), removeTeacher)



//Handle Students
router.post('/:institution_id/students/:student_id/remove', verifyToken, extractUserData, roleCheck('teacher'), removeStudent)

router.get('/:institution_id/students', verifyToken, extractUserData, roleCheck('teacher'), getStudents);


export default router;
