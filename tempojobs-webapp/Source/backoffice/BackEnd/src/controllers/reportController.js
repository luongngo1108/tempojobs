import { ReturnResult } from '../DTO/returnResult.js';
import Report from "../models/reportModel.js";
import User from "../models/userModel.js";

class reportController {
    async saveReport(req, res, next) {
        var result = new ReturnResult();
        try {
            var report = req.body;
            if(report._id === null) {
                var createdReport = Report.create(report);
                result.result = createdReport;
            } else {    
                var savedReport = Report.findByIdAndUpdate(report._id, report, {returnOriginal: false});
                result.result = savedReport;
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