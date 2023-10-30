import { Router } from "express";
const router = Router();

import momoController from "../controllers/momoController.js";

router.route('/createMomoPayment').post(momoController.createMomoPayment);
router.route('/momoPayementSuccess').post(momoController.momoPayementSuccess);
router.route('/getPaymentHistoryByUserId/:userId').get(momoController.getPaymentHistoryByUserId);
export default router;