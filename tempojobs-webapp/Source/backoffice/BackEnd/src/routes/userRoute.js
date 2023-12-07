import { Router } from "express";
const router = Router();

import authController from "../controllers/authController.js";
import {validateToken, checkUserRole} from "../middlewares/validateTokenHandler.js";
import userController from "../controllers/userController.js";

router.route('/get').get( userController.get);
router.route('/getAllUserDetail').get( userController.getAllUserDetail);
router.route('/getUserDetailByUserId').get(userController.getUserDetailByUserId);
router.route('/getUserByUserId').get(userController.getUserByUserId);
router.route('/getUserByUserDetailId').get(userController.getUserByUserDetailId);
router.route('/saveUserDetail').post(userController.saveUserDetail);
router.route('/onDeletes').post(userController.onDeletes);
router.route('/getUserById').get(userController.getUserById);
router.route('/getUserByRole').post(userController.getUserByRole);
router.route('/evaluationUser').get(userController.evaluationUser);

export default router;