import { Router } from "express";
const router = Router();

import authController from "../controllers/authController.js";
import {validateToken, checkUserRole} from "../middlewares/validateTokenHandler.js";
import userController from "../controllers/userController.js";

// ------------------- Validate token ----------------------
router.use(validateToken, checkUserRole);

// ------------------- User APIs ---------------------------
router.route('/get').get( userController.get);
router.route('/getUserDetailById').get(userController.getUserDetailById)
router.route('/saveUserDetail').post(userController.saveUserDetail)

export default router;