import { Router } from "express";
const router = Router();

import authController from "../controllers/authController.js";

router.route('/register').post(authController.register);
router.route('/login/:role').post(authController.login);
router.route('/sendEmailResetPassword').post(authController.sendEmailResetPassword);
router.route('/resetPassword/:userId/:token').post(authController.changePassword);
export default router;