import { Router } from "express";
const router = Router();

import workController from "../controllers/workTypeController.js";

router.route('/saveWorkType').post(workController.saveWorkType);

router.route('/getWorkTypes').get(workController.getAllWorkTypes);

export default router;