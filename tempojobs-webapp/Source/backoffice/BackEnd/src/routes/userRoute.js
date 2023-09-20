import { Router } from "express";
const router = Router();

import authController from "../controllers/authController.js";
import {validateToken, checkAdminRole, checkUserRole} from "../middlewares/validateTokenHandler.js";

// ------------------- Validate token ----------------------
router.use(validateToken, checkUserRole);

// ------------------- User APIs ---------------------------
router.route('/').get(validateToken, authController.getCurrentUser);

export default router;