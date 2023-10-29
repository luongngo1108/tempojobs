import { Router } from "express";
import locationController from "../controllers/locationController.js";
const router = Router();


router.route('/saveGoogleMapLocation').post(locationController.saveGoogleMapLocation);

export default router;