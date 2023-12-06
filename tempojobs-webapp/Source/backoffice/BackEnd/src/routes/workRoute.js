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
router.route('/saveWorkApply').post(workController.saveWorkApply);
router.route('/getAllWorkApplyByUserId/:userId').get(workController.getAllWorkApplyByUserId);
router.route('/getAllWorkApplyByWorkId/:workId').get(workController.getAllWorkApplyByWorkId);
router.route('/deleteWorkApply').post(workController.deleteWorkApply)
router.route('/changeWorkStatus').post(workController.changeWorkStatus)
router.route('/onDeletes').post(workController.onDeletes)

export default router;