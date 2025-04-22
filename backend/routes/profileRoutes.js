import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import extractUserData from "../middlewares/extractUserData.js";
import roleCheck from "../middlewares/roleCheck.js";
import { leaveInstitution } from "../controllers/user-profile/leaveInstituion.js";
import { deleteInstitution } from "../controllers/user-profile/deleteInstitution.js";
import { deleteProfile } from "../controllers/user-profile/deleteProfile.js";

const router = Router();

//Create routes for deleting user profile
router.delete("/delete-user-profile", verifyToken, extractUserData, deleteProfile);

//Create route for leaving the institution
router.delete("/leave-institution", verifyToken, extractUserData, leaveInstitution);

//Create route for deleting an institution
router.delete("/delete-institution", verifyToken, extractUserData, roleCheck('admin'), deleteInstitution);

//

export default router;