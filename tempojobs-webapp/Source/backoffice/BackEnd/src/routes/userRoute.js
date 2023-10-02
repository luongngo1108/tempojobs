import { Router } from "express";
const router = Router();

import authController from "../controllers/authController.js";
import {validateToken, checkAdminRole, checkUserRole} from "../middlewares/validateTokenHandler.js";
import userController from "../controllers/userController.js";

// ------------------- Validate token ----------------------
router.use(validateToken, checkUserRole);

// ------------------- User APIs ---------------------------
router.route('/').get( authController.getCurrentUser);
router.route('/get').get( userController.get);

export default router;