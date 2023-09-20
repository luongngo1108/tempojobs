import { Router } from "express";
const router = Router();

import authController from "../controllers/authController.js";

router.route('/register').post(authController.register);
router.route('/login').get(authController.login);
// router.route('/current').get(validateTokenHandler.validateToken(), authController.getCurrentUser());

export default router;