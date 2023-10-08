import Work from '../models/workModel.js';

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
            if (workBody.workId == 0) {
                const work = await Work.create(req.body);
                if (work) {
                    result = work;
                    res.status(200).json({result: result, message: message});
                } else {
                    message = "Can't create work";
                    res.status(400).json({result: result, message: message});
                }
            } else {
                const findWork = await Work.findById({id: id});
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
};

export default new WorkController;