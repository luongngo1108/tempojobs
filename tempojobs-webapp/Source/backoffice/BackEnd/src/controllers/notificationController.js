import { ReturnResult } from '../DTO/returnResult.js';
import Notification from "../models/notificationModel.js";

class reportController {
    async getAllNotification(req, res, next) {
        var data = null;
        try {
            data = await Notification.find();
        }
        catch {
            console.log(error);
            next(error);
        }
        return res.status(200).json({ data });
    }
}

export default new reportController;