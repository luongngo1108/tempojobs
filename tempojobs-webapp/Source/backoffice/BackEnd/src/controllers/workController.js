import { ReturnResult } from '../DTO/returnResult.js';
import Counter from '../models/counterModel.js';
import { FilterMapping, Page, PagedData } from '../models/pageModel.js';
import Work from '../models/workModel.js';
import DataState from '../models/dataStateModel.js';
import GoogleMapLocation from '../models/googleMapLocationModel.js';
import { getLastCounterValue } from '../utils/counterUtil.js';
import WorkApply from '../models/workApplyModel.js';
import User from '../models/userModel.js';
import UserDetail from '../models/userDetailModel.js';
import Notification from '../models/notificationModel.js';
import { WorkApplyViewModel } from '../DTO/workApplyViewModel.js';

class WorkController {
    async getWorkAll(req, res, next) {
        var result = new ReturnResult();
        try {
            const works = await Work.find({ deleted: false });
            if (works) {
                result.result = works;
            } else {
                result.message = "Can't find all work";
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async getWorkPaging(req, res, next) {
        try {
            var message = null;
            var page = new Page();
            var pagedData = new PagedData();
            var listWork;
            page = req.body;
            var filterMappingList = page?.filter;
            var filterWorkType = [];
            filterMappingList.map(item => {
                if (item.prop === 'workType') filterWorkType.push({ workTypeId: item.value });
            });
            var filterProvince = [];
            filterMappingList.filter(item => {
                if (item.prop === 'workProvince') filterProvince.push({ workProvince: item.value });
            });
            var filterSearch = filterMappingList.find(item => item.prop === 'SEARCHING')?.value;
            if (filterSearch) {
                page.totalElements = await Work.find({
                    deleted: false,
                    $or: [
                        { workName: { $regex: filterSearch, $options: "i" } },
                        { workDescription: { $regex: filterSearch, $options: "i" } }
                    ]
                }).count();
                listWork = await Work.find({
                    deleted: false,
                    $or: [
                        { workName: { $regex: filterSearch, $options: "i" } },
                        { workDescription: { $regex: filterSearch, $options: "i" } }
                    ]
                }).sort({ workStatusId: 1 }).skip(page.pageNumber * page.size).limit(page.size);
            } else {
                if (filterWorkType.length === 0 && filterProvince.length === 0) {
                    page.totalElements = await Work.find().count();
                    listWork = await Work.find().sort({ workStatusId: 1 }).skip(page.pageNumber * page.size).limit(page.size);
                } else if (filterWorkType.length > 0 && filterProvince.length > 0) {
                    page.totalElements = await Work.find({
                        deleted: false,
                        $or: filterWorkType,
                        $or: filterProvince
                    }).count();
                    listWork = await Work.find({
                        deleted: false,
                        $or: filterWorkType,
                        $or: filterProvince
                    }).sort({ workStatusId: 1 }).skip(page.pageNumber * page.size).limit(page.size);
                } else if (filterWorkType.length > 0) {
                    page.totalElements = await Work.find({
                        deleted: false,
                        $or: filterWorkType
                    }).count();
                    listWork = await Work.find({
                        deleted: false,
                        $or: filterWorkType
                    }).sort({ workStatusId: 1 }).skip(page.pageNumber * page.size).limit(page.size);
                } else if (filterProvince.length > 0) {
                    page.totalElements = await Work.find({
                        deleted: false,
                        $or: filterProvince
                    }).count();
                    listWork = await Work.find({
                        deleted: false,
                        $or: filterProvince
                    }).sort({ workStatusId: 1 }).skip(page.pageNumber * page.size).limit(page.size);
                }
            }
            pagedData.data = listWork;
            pagedData.page = page;
            if (listWork) {
                res.status(200).json({ result: pagedData, message: message });
            } else {
                message = "Can't find all work";
                res.status(400).json({ result: null, message: message });
            }
        } catch (error) {
            next(error);
        }
    }

    async saveWork(req, res, next) {
        try {
            var result = new ReturnResult();
            var workBody = new Work();
            workBody = req.body;
            if (!workBody.workName || !workBody.workProfit || !workBody.workAddress
                || !workBody.workHours || !workBody.createdBy) {
                result.message = "Data is required";
            }
            if (workBody.workId === 0) {
                var workToSave = req.body;
                var nextWorkId = await getLastCounterValue('workId') + 1;
                workToSave.workId = nextWorkId;
                workToSave.deleted = false;
                let ggmap;
                if (workToSave.googleMapLocation) ggmap = await GoogleMapLocation.create(workToSave.googleMapLocation);
                const work = await Work.create(workToSave);
                const counterUpdated = await Counter.findOneAndUpdate({ field: 'workId' }, { lastValue: nextWorkId });
                if (work) {
                    result.result = work;
                } else {
                    result.message = "Can't create work";
                }
            } else {
                const updatedWork = await Work.updateOne({ workId: workBody.workId }, workBody);
                if (workBody.googleMapLocation) {
                    await GoogleMapLocation.findByIdAndUpdate(workBody.googleMapLocation._id, workBody.googleMapLocation);
                }
                if (updatedWork) {
                    result.result = updatedWork;
                } else {
                    result.message = "Can't find work";
                }
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async getWorkByCreatorId(req, res, next) {
        try {
            var result = new ReturnResult();
            const id = req.query.id;
            if (!id) {
                result.message = "Id is required";
                return;
            }
            var user = await User.findById(id);
            const listWork = await Work.find({
                createdById: id,
                deleted: false,
            });
            if (listWork) {
                result.result = listWork;
            } else {
                result.message = "Error get Work by id: " + id;
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async deleteWork(req, res, next) {
        try {
            var result = new ReturnResult();
            const id = req.params.id;
            if (!id) {
                result.message = "Id is required";
                res.status(400).json(result);
                return;
            }
            const resultDeleted = await Work.findOneAndUpdate(
                { workId: id },
                { $set: { deleted: true } }
            );
            if (resultDeleted) {
                result.result = resultDeleted;
            } else {
                result.message = "Error get Work by id: " + id;
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async getWorkByWorkId(req, res, next) {
        var result = new ReturnResult();
        try {
            const work = await Work.findOne({ workId: req.params.workId });
            if (work) {
                result.result = work;
                work.workType = await DataState.findOne({ dataStateId: work.workTypeId });
            }
        }
        catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async applyForWork(req, res, next) {
        var result = new ReturnResult();
        try {
            const workApply = req.body;
            const userId = req.query.id;
            if (workApply) {
                const findApplied = await WorkApply.findOne({ userId: userId, workId: workApply.workId });
                if (findApplied) {
                    await Work.findOneAndUpdate({ workId: workApply.workId }, { $pull: { workApply: findApplied._id } });
                    await WorkApply.deleteOne(findApplied);
                    const createdWorkApply = await WorkApply.create(workApply);
                    const updatedWork = await Work.findOneAndUpdate({ workId: workApply.workId },
                        { $push: { workApply: createdWorkApply._id } },
                        { returnOriginal: false },
                    );
                    if (updatedWork) result.result = updatedWork;
                } else {
                    const createdWorkApply = await WorkApply.create(workApply);
                    const updatedWork = await Work.findOneAndUpdate({ workId: workApply.workId },
                        { $push: { workApply: createdWorkApply._id } },
                        { returnOriginal: false },
                    );
                    if (updatedWork) result.result = updatedWork;
                }
                if (result.result && workApply.status !== 14) {
                    // Send notification for created user
                    const referenceUser = await User.findById(userId);
                    const work = await Work.findOne({ workId: workApply.workId });
                    const reciever = await User.findById(work.createdById);
                    const content = `${referenceUser.displayName} đã đăng ký công việc số ${workApply.workId} của bạn.`;
                    const title = `Có người ứng tuyển!`;
                    const notification = await Notification.create({
                        referenceUser,
                        reciever,
                        content,
                        title,
                        type: 'WorkApply',
                        redirectUrl: 'created-manage'
                    })
                }
            }
        }
        catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async getWorkApplyById(req, res, next) {
        try {
            var result = new ReturnResult();
            const id = req.query.id;
            if (!id) {
                result.message = "Id is required";
                res.status(200).json(result);
                return;
            }
            const resp = await WorkApply.findOne({ _id: id, });
            if (resp) {
                result.result = resp;
            } else {
                result.message = "Error get Work by id: " + id;
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async getWorkApplyByWorkIdAndUserId(req, res, next) {
        try {
            var result = new ReturnResult();
            const workId = req.query.workId;
            const userId = req.query.userId;
            if (!workId && !userId) {
                result.message = "Data is required";
                res.status(200).json(result);
                return;
            }
            const resp = await WorkApply.findOne({ workId: workId, userId: userId });
            if (resp) {
                result.result = resp;
            } else {
                result.message = "Work apply with workId and userId doesn't exist: " + workId + userId;
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async saveWorkApply(req, res, next) {
        var result = new ReturnResult();
        try {
            const workApply = req.body;
            const work = await Work.findOne({ workId: workApply.workId });
            const reciever = await User.findById(workApply.userId);
            const referenceUser = await User.findById(work.createdBy.id);
            var content = '';
            var title = '';
            const existedNotification = await Notification.findOne({ reciever: workApply.userId, referenceUser: work.createdBy.id });
            if (workApply) {
                var existedWorkApply = await WorkApply.findById(workApply._id);
                // Only send notification when change from "Da dang ky" to "Da nhan"/ "Tu choi"
                if (existedWorkApply && (existedWorkApply.status === 7 || existedWorkApply.status === 8 || existedWorkApply.status === 9)) {
                    // "Da nhan"
                    if (workApply.status === 9) {
                        content = `Bạn đã được nhận công việc số ${workApply.workId}`;
                        title = `Chúc mừng!`;
                    }
                    // "Tu choi"
                    if (workApply.status === 8) {
                        content = `Người đăng công việc ${workApply.workId} đã từ chối yêu cầu của bạn.`;
                        title = `Xin chia buồn!`;
                    }
                    if (existedNotification) {
                        await Notification.findByIdAndUpdate(existedNotification._id, { content, title, isRead: false });
                    } else {
                        const notification = await Notification.create({
                            referenceUser,
                            reciever,
                            content,
                            title,
                            type: 'WorkApplyCreator',
                            redirectUrl: 'tasker-manage'
                        })
                    }
                }
                const saveApplied = await WorkApply.updateOne({ _id: workApply._id }, workApply);
                if (saveApplied) {
                    result.result = saveApplied;
                } else {
                    result.message = "Work applied doesn't exist";
                }
            }
        }
        catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async deleteWorkApply(req, res, next) {
        var result = new ReturnResult();
        try {
            const workApply = req.body;
            if (workApply) {
                const deleteApplied = await WorkApply.deleteOne({ _id: workApply._id });
                const deleteWorkApplyInWork = await Work.updateOne(
                    { workId: workApply.workId },
                    { $pull: { workApply: workApply._id } }
                );
                if (deleteApplied.deletedCount > 0) {
                    result.result = true;
                    // Send notification
                    const work = await Work.findOne({ workId: workApply.workId });
                    const referenceUser = await User.findById(workApply.userId);
                    const reciever = await User.findById(work.createdById);
                    const content = `${referenceUser.displayName} đã hủy đăng ký công việc số ${workApply.workId} của bạn.`;
                    const title = `Hủy nhận việc!`;
                    const notification = await Notification.create({
                        referenceUser,
                        reciever,
                        content,
                        title,
                        type: 'UnSaveWorkApply',
                        redirectUrl: 'created-manage'
                    })
                } else {
                    result.message = "Work applied doesn't exist";
                }
            }
        }
        catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async getAllWorkApplyByUserId(req, res, next) {
        try {
            var result = new ReturnResult();
            const userId = req.params.userId;
            if (!userId) {
                result.message = "userId is required";
                return;
            }
            const listWork = await WorkApply.find({
                userId: userId
            });
            if (listWork) {
                result.result = listWork;
            } else {
                result.message = "Error get WorkApply by userId: " + userId;
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async getAllWorkApplyByWorkId(req, res, next) {
        var result = new ReturnResult();
        try {
            const workId = req.params.workId;
            const listWorkApply = await WorkApply.find({
                workId: workId
            }); 
            if (listWorkApply) {
                var listWorkApplyRes = [];
                for(var workApply of listWorkApply) {
                    var user = await User.findById(workApply.userId);
                    var userDetail = await UserDetail.findById(user.userDetail);
                    console.log(user, workApply.userId)
                    listWorkApplyRes.push(new WorkApplyViewModel(workApply, userDetail));
                }
                result.result = listWorkApplyRes;
            } else {
                result.message = "Error get WorkApply by workId: " + workId;
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async changeWorkStatus(req, res, next) {
        var result = new ReturnResult();
        try {
            const { statusId, workId } = req.body;
            if (statusId && workId) {
                result.result = await Work.findOneAndUpdate({ workId }, { workStatusId: statusId }, { returnOriginal: false });
                if (result.result && (statusId === 2 || statusId === 3)) {
                    var content = '';
                    var title = '';
                    switch (statusId) {
                        case 2:
                            content = `Công việc số ${workId} của bạn đã dược duyệt.`;
                            title = `Chúc mừng!`;
                            break;
                        case 3:
                            content = `Công việc số ${workId} của bạn đã bị từ chối.`;
                            title = `Từ chối!`;
                            break;
                    }
                    // Send notification
                    const work = await Work.findOne({ workId: workId });
                    const reciever = await User.findById(work.createdById);
                    const notification = await Notification.create({
                        reciever,
                        content,
                        title,
                        type: 'ApproveOrDeclineWork',
                        redirectUrl: 'created-manage'
                    })
                }
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async onDeletes(req, res, next) {
        var result = new ReturnResult();
        try {
            const ids = req.body;
            if(ids || ids?.length > 0) {
                var updateResult = await Work.updateMany({workId: {$in: ids}}, {deleted: true});
                if(updateResult.modifiedCount > 0) {
                    result.result = true;
                } else result.result = false
            }
        }
        catch (ex) {
            console.log(ex);
            result.message = constants.TECHNICAL_ERROR;
        }
        res.status(200).json(result);
    }
};

export default new WorkController;