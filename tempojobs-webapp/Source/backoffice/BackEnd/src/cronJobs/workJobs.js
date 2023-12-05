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
                $lte: currentDate
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
            // case 1, 6:
            //     await Work.findByIdAndUpdate(work._id, { workStatusId: 15 })
            //     reciever = await User.findById(work.createdById);
            //     content = `Công việc số ${work.workId} của bạn đã hết hạn. Vui lòng tạo công việc mới.`;
            //     title = `Nhắc nhở!`;
            //     await Notification.create({
            //         reciever,
            //         content,
            //         title,
            //         type: 'OutDateWork',
            //         redirectUrl: ''
            //     })
            //     break;
            case 2:
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