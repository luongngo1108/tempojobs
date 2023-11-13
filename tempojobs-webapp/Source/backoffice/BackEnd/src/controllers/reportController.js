import { ReturnResult } from '../DTO/returnResult.js';
import Report from "../models/reportModel.js";

class reportController {
    async saveReport(req, res, next) {
        var result = new ReturnResult();
        try {
            var report = req.body;
            if(report._id === null) {
                var createdReport = await Report.create({
                    userId: report.userId,
                    fullName: report.fullName,
                    email: report.email,
                    phone: report.phone,
                    message: report.message
                });
                result.result = createdReport;
            } else {    
                var savedReport = await Report.findByIdAndUpdate(report._id, report, {returnOriginal: false});
                result.result = savedReport;
            }
        }
        catch(error) {
            console.log(error);
            next(error);
        }
        return res.status(200).json(result);
    }

    async getAllReport(req, res, next) {
        var data = null;
        try {
            data = await Report.find();
        }
        catch {
            console.log(error);
            next(error);
        }
        return res.status(200).json({ data });
    }

    async onDeletes(req, res, next) {
        var result = new ReturnResult();
        try {
            const ids = req.body;
            if(ids || ids?.length > 0) {
                for(var id of ids) {
                    await Report.findOneAndRemove({_id: id});
                }
                result.result = true;
            }
        }
        catch (ex) {
            console.log(ex);
            result.message = constants.TECHNICAL_ERROR;
        }
        res.status(200).json(result);
    }
}

export default new reportController;