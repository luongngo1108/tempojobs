import { Router } from "express";
const router = Router();

import notificationController from "../controllers/notificationController.js";

router.route('/getAllNotification').get(notificationController.getAllNotification);
export default router;