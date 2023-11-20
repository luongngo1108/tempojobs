import { Router } from "express";
const router = Router();

import notificationController from "../controllers/notificationController.js";

router.route('/getAllNotification').get(notificationController.getAllNotification);
router.route('/getNotificationByUserId/:userId').post(notificationController.getNotificationByUserId);
router.route('/saveNotifcation/:userId').post(notificationController.saveNotifcation);
router.route('/markAllAsRead/:userId').get(notificationController.markAllAsRead);
export default router;