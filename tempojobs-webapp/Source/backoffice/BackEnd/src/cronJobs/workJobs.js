import { CronJob } from 'cron';
import Work from '../models/workModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';
const outDateWork = CronJob.from({
    cronTime: '* * * * * *',
    onTick: async function () {
        var currentDate = new Date();
        var allOutDateWork = await Work.find({
            startDate: {
                $gte: currentDate
            }
        })
        await changeStatusAndSendNotification(allOutDateWork);
    },
    start: false,
    timeZone: 'Asia/Ho_Chi_Minh'
});

async function changeStatusAndSendNotification(allOutDateWork) {
    for (var work of allOutDateWork) {
        // If work in "Đang duyệt" or "Đã duyệt" but outdated => Change state to "Hết hạn"
        let reciever = '';
        let content = '';
        let title = '';
        switch (work.workStatusId) {
            case 1:
                await Work.findByIdAndUpdate(work._id, { workStatusId: 15 })
                reciever = await User.findById(work.createdById);
                content = `Công việc số ${work.workId} của bạn có vẻ như vẫn chưa được duyệt. Chúng tôi đã hoàn tiền đến tài khoản của bạn.`;
                title = `Xin lỗi vì vấn đề này!`;
                await Notification.create({
                    reciever,
                    content,
                    title,
                    type: 'OutDateWork',
                    redirectUrl: ''
                })
                break;
            case 2, 6:
                await Work.findByIdAndUpdate(work._id, { workStatusId: 15 })
                reciever = await User.findById(work.createdById);
                content = `Công việc số ${work.workId} của bạn đã hết hạn. Vui lòng gia hạn thêm.`;
                title = `Hết hạn!`;
                await Notification.create({
                    reciever,
                    content,
                    title,
                    type: 'OutDateWork',
                    redirectUrl: 'created-manage'
                })
                break;
        }

    }
}

export {
    outDateWork
}