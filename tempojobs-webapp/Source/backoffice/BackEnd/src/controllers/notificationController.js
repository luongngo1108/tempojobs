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

    async getNotificationByUserId(req, res, next) {
        var result = new ReturnResult();
        try {
            const userId = req.params.userId;
            const { pageNumber } = req.body;    
            if (userId) {
                if (pageNumber == -1) result.result = (await Notification.find({ reciever: userId }));
                else result.result = (await Notification.find({ reciever: userId })).slice(pageNumber * 5, pageNumber * 5 + 5);
            }
        }
        catch {
            console.log(error);
            next(error);
        }
        return res.status(200).json(result);
    }

    async saveNotifcation(req, res, next) {
        var result = new ReturnResult();
        try {
            const userId = req.params.userId;
            const notification = req.body;
            if(notification) {
                const updateNotifcation = await Notification.findByIdAndUpdate(notification._id, notification);
                result.result = await Notification.find({ reciever: userId });
            }
        }
        catch {
            console.log(error);
            next(error);
        }
        return res.status(200).json(result);
    }

    async markAllAsRead(req, res, next) {
        var result = new ReturnResult();
        try {
            const userId = req.params.userId;
            if (userId) {
                await Notification.updateMany({ reciever: userId }, {isRead: true});
                result.result = await Notification.find({ reciever: userId });
            }
        }
        catch {
            console.log(error);
            next(error);
        }
        return res.status(200).json(result);
    }
}

export default new reportController;