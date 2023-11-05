import { Router } from "express";
const router = Router();

import authController from "../controllers/authController.js";
import {validateToken, checkUserRole} from "../middlewares/validateTokenHandler.js";
import userController from "../controllers/userController.js";

router.route('/get').get( userController.get);
router.route('/getUserDetailByUserId').get(userController.getUserDetailByUserId)
router.route('/saveUserDetail').post(userController.saveUserDetail)
router.route('/getUserById').get(userController.getUserById)

export default router;