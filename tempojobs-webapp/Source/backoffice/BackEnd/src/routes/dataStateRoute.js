import { Router } from "express";
import dataStateController from "../controllers/dataStateController.js";
const router = Router();

router.route('/saveDataState').post(dataStateController.saveDataState);
router.route('/getDataStateAll').get(dataStateController.getDataStateAll);
router.route('/getDataStateByType').get(dataStateController.getDataStateByType);
router.route('/getDataStateByTypeAndName').get(dataStateController.getDataStateByTypeAndName);
router.route('/onDeletes').post(dataStateController.onDeletes);

export default router;