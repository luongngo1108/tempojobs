import { Router } from "express";
const router = Router();

import reportController from "../controllers/reportController.js";

router.route('/saveReport').post(reportController.saveReport);
router.route('/getAllReport').get(reportController.getAllReport);
router.route('/onDeletes').post(reportController.onDeletes);
export default router;