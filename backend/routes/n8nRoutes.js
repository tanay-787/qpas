import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import extractUserData from "../middlewares/extractUserData.js";
import { sendWelcomeEmail } from "../controllers/n8n-webhook-handlers/sendWelcomeEmail.js";


const router = Router();

router.post("/send-welcome-email", verifyToken, extractUserData, sendWelcomeEmail);

export default router;