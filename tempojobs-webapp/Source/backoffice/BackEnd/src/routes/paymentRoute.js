import { Router } from "express";
const router = Router();

import momoController from "../controllers/momoController.js";

router.route('/createMomoPayment').post(momoController.createMomoPayment);
router.route('/momoPayementSuccess').post(momoController.momoPayementSuccess);
export default router;