import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import extractUserData from "../middlewares/extractUserData.js";


const router = Router();

//Create routes for deleting user profile
router.delete("/delete-user-profile", verifyToken, extractUserData, deleteUserProfile);

//Create route for leaving the institution
router.delete("/leave-institution", verifyToken, extractUserData, leaveInstitution);

//Create route for deleting an institution
router.delete("/delete-institution", verifyToken, extractUserData, deleteInstitution);

//

export default router;