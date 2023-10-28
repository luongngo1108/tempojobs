import { Router } from "express";
const router = Router();

import workController from "../controllers/workController.js";

router.route('/getWorkAll').get(workController.getWorkAll);
router.route('/saveWork').post(workController.saveWork);
router.route('/getWorkPaging').post(workController.getWorkPaging);
router.route('/getWorkByWorkId/:workId').get(workController.getWorkByWorkId);

export default router;