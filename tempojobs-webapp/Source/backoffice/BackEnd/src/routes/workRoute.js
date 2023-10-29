import { Router } from "express";
const router = Router();

import workController from "../controllers/workController.js";

router.route('/getWorkAll').get(workController.getWorkAll);
router.route('/getWorkByCreatorId').get(workController.getWorkByCreatorId);
router.route('/saveWork').post(workController.saveWork);
router.route('/getWorkPaging').post(workController.getWorkPaging);
router.route('/:id').delete(workController.deleteWork);
router.route('/getWorkByWorkId/:workId').get(workController.getWorkByWorkId);

export default router;