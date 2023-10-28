import { ReturnResult } from '../DTO/returnResult.js';
import Counter from '../models/counterModel.js';
import { FilterMapping, Page, PagedData } from '../models/pageModel.js';
import Work from '../models/workModel.js';
import DataState from '../models/dataStateModel.js';
import { getLastCounterValue } from '../utils/counterUtil.js';

class WorkController {
    async getWorkAll(req, res, next) {
        try {
            var result = null;
            var message = null;
            const work = await Work.find();
            if (work) {
                result = work;
                res.status(200).json({result: result, message: message});
            } else {
                message = "Can't find all work";
                res.status(400).json({result: result, message: message});
            }
        } catch (error) {
            next(error);
        }
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
                    $or: [
                        {workName: { $regex: filterSearch, $options: "i"}},
                        {workDescription: { $regex: filterSearch, $options: "i"}}
                    ]
                }).count();
                listWork = await Work.find({
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
                        $or: filterWorkType,
                        $or: filterProvince
                    }).count();
                    listWork = await Work.find({
                        $or: filterWorkType,
                        $or: filterProvince
                    }).skip(page.pageNumber * page.size).limit(page.size);
                } else if (filterWorkType.length > 0) {
                    page.totalElements = await Work.find({
                        $or: filterWorkType
                    }).count();
                    listWork = await Work.find({
                        $or: filterWorkType
                    }).skip(page.pageNumber * page.size).limit(page.size);
                } else if (filterProvince.length > 0) {
                    page.totalElements = await Work.find({
                        $or: filterProvince
                    }).count();
                    listWork = await Work.find({
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
            var result = null;
            var message = null;
            var workBody = new Work();
            workBody = req.body;
            if (!workBody.workName || !workBody.workProfit || !workBody.workAddress
                || !workBody.workHours || !workBody.createdBy) {
                message = "Data is required";
                res.status(400).json({result: result, message: message});
            }
            if (workBody.workId === 0) {
                var workToSave = req.body;
                var nextWorkId = await getLastCounterValue('workId') + 1;
                workToSave.workId = nextWorkId;
                const work = await Work.create(workToSave);
                const counterUpdated = await Counter.findOneAndUpdate({field: 'workId'}, {lastValue: nextWorkId});
                if (work) {
                    result = work;
                    res.status(200).json({result: result, message: message});
                } else {
                    message = "Can't create work";
                    res.status(400).json({result: result, message: message});
                }
            } else {
                const findWork = await Work.findById({workId: workId});
                if (findWork) {
                    findWork.workName = workBody.workName;
                    findWork.workProfit = workBody.workProfit;
                    findWork.workAddress = workBody.workAddress;
                    findWork.workHours = workBody.workHours;
                } else {
                    message = "Can't find work";
                    res.status(400).json({result: result, message: message});
                }
            }
        } catch (error) {
            next(error);
        }
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
};

export default new WorkController;