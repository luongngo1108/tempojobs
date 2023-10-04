import { Router } from "express";
import dataStateController from "../controllers/dataStateController.js";
const router = Router();

router.route('/saveDataState').post(dataStateController.saveDataState);
router.route('/getDataStateAll').get(dataStateController.getDataStateAll);
router.route('/getDataStateByType').get(dataStateController.getDataStateByType);

export default router;