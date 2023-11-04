import { Router } from "express";
const router = Router();

import reportController from "../controllers/reportController.js";

router.route('/saveReport').post(reportController.saveReport);
export default router;