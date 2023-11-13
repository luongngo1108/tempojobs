import { ReturnResult } from '../DTO/returnResult.js';
import Counter from '../models/counterModel.js';
import { FilterMapping, Page, PagedData } from '../models/pageModel.js';
import Work from '../models/workModel.js';
import DataState from '../models/dataStateModel.js';
import GoogleMapLocation from '../models/googleMapLocationModel.js';
import { getLastCounterValue } from '../utils/counterUtil.js';
import WorkApply from '../models/workApplyModel.js';

class WorkController {
    async getWorkAll(req, res, next) {
        var result = new ReturnResult();
        try {
            const work = await Work.find({ deleted: false});
            if (work) {
                result.result = work;
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
                if (item.prop === 'workType') filterWorkType.push({workTypeId: item.value});
            });
            var filterProvince = [];
            filterMappingList.filter(item => {
                if (item.prop === 'workProvince') filterProvince.push({workProvince: item.value});
            });
            var filterSearch = filterMappingList.find(item => item.prop === 'SEARCHING')?.value;
            if (filterSearch) {
                page.totalElements = await Work.find({
                    deleted: false,
                    $or: [
                        {workName: { $regex: filterSearch, $options: "i"}},
                        {workDescription: { $regex: filterSearch, $options: "i"}}
                    ]
                }).count();
                listWork = await Work.find({
                    deleted: false,
                    $or: [
                        {workName: { $regex: filterSearch, $options: "i"}},
                        {workDescription: { $regex: filterSearch, $options: "i"}}
                    ]
                }).skip(page.pageNumber * page.size).limit(page.size);
            } else {
                if (filterWorkType.length === 0 && filterProvince.length === 0) {
                    page.totalElements = await Work.find().count();
                    listWork = await Work.find().skip(page.pageNumber * page.size).limit(page.size);
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
                    }).skip(page.pageNumber * page.size).limit(page.size);
                } else if (filterWorkType.length > 0) {
                    page.totalElements = await Work.find({
                        deleted: false,
                        $or: filterWorkType
                    }).count();
                    listWork = await Work.find({
                        deleted: false,
                        $or: filterWorkType
                    }).skip(page.pageNumber * page.size).limit(page.size);
                } else if (filterProvince.length > 0) {
                    page.totalElements = await Work.find({
                        deleted: false,
                        $or: filterProvince
                    }).count();
                    listWork = await Work.find({
                        deleted: false,
                        $or: filterProvince
                    }).skip(page.pageNumber * page.size).limit(page.size);
                }
            }
            pagedData.data = listWork;
            pagedData.page = page;
            if (listWork) {
                res.status(200).json({result: pagedData, message: message});
            } else {
                message = "Can't find all work";
                res.status(400).json({result: null, message: message});
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
                if(workToSave.googleMapLocation) ggmap = await GoogleMapLocation.create(workToSave.googleMapLocation);
                console.log(workToSave);
                const work = await Work.create(workToSave);
                const counterUpdated = await Counter.findOneAndUpdate({field: 'workId'}, {lastValue: nextWorkId});
                if (work) {
                    result.result = work;
                } else {
                    result.message = "Can't create work";
                }
            } else {
                const updateWork = await Work.updateOne({workId: workBody.workId}, workBody);
                const updateGgMap = await GoogleMapLocation.findByIdAndUpdate(workBody.googleMapLocation._id, workBody.googleMapLocation);
                if (updateWork) {
                    result.result = updateWork;
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
            const work = await Work.findOne({workId: req.params.workId});
            if(work) {
                result.result = work;
                work.workType = await DataState.findOne({dataStateId: work.workTypeId});
            } 
        }
        catch(error) {
            next(error);
        }
        res.status(200).json(result);
    }  

    async applyForWork(req, res, next) {
        var result = new ReturnResult();
        try {
            const workApply = req.body;
            const userId = req.query.id;
            if(workApply) {
                const findApplied = await WorkApply.findOne({userId: userId, workId: workApply.workId});
                if(findApplied) {
                    await Work.findOneAndUpdate({workId: workApply.workId}, {$pull: {workApply: findApplied._id}});
                    await WorkApply.deleteOne(findApplied);
                    const createdWorkApply = await WorkApply.create(workApply);
                    const updatedWork = await Work.findOneAndUpdate(  {workId: workApply.workId}, 
                                                                        {$push: {workApply: createdWorkApply._id}},
                                                                        {returnOriginal: false},
                                                                    );
                    if(updatedWork) result.result = updatedWork;
                } else {
                    const createdWorkApply = await WorkApply.create(workApply);
                    const updatedWork = await Work.findOneAndUpdate(  {workId: workApply.workId}, 
                                                                        {$push: {workApply: createdWorkApply._id}},
                                                                        {returnOriginal: false},
                                                                    );
                    if(updatedWork) result.result = updatedWork;
                }
            }
        }
        catch(error) {
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
            if(workApply) {
                const saveApplied = await WorkApply.updateOne({ _id: workApply._id }, workApply);
                if(saveApplied) {
                    result.result = saveApplied;
                } else {
                    result.message = "Work applied doesn't exist";
                }
            }
        }
        catch(error) {
            next(error);
        }
        res.status(200).json(result);
    }

    async deleteWorkApply(req, res, next) {
        var result = new ReturnResult();
        try {
            const workApply = req.body;
            if(workApply) {
                const deleteApplied = await WorkApply.deleteOne({ _id: workApply._id });
                const deleteWorkApplyInWork = await Work.updateOne(
                    { workId: workApply.workId },
                    { $pull: { workApply: workApply._id } }
                );
                if(deleteApplied.deletedCount > 0) {
                    result.result = true;
                } else {
                    result.message = "Work applied doesn't exist";
                }
            }
        }
        catch(error) {
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
};

export default new WorkController;