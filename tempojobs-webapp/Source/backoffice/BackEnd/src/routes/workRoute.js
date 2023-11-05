import { Router } from "express";
const router = Router();

import workController from "../controllers/workController.js";

router.route('/getWorkAll').get(workController.getWorkAll);
router.route('/getWorkByCreatorId').get(workController.getWorkByCreatorId);
router.route('/saveWork').post(workController.saveWork);
router.route('/getWorkPaging').post(workController.getWorkPaging);
router.route('/:id').delete(workController.deleteWork);
router.route('/getWorkByWorkId/:workId').get(workController.getWorkByWorkId);
router.route('/applyForWork').post(workController.applyForWork);
router.route('/getWorkApplyById').get(workController.getWorkApplyById);
router.route('/getWorkApplyByWorkIdAndUserId').get(workController.getWorkApplyByWorkIdAndUserId);
router.route('/changeStatusWorkApply').post(workController.changeStatusWorkApply);

export default router;