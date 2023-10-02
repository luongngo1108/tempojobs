import WorkType from '../models/workTypeModel.js';

class workTypeController {
    async saveWorkType(req, res, next) {
        const { workTypeName } = req.body;
        if (!workTypeName) {
            res.status(400).json("All fields are madatory");
            return;
        }
        const workType = await WorkType.create({
            workTypeName
        });
        if (workType) {
            res.status(201).json({_id: workType.id, name: workType.workTypeName});
        } else {
            res.status(400).json("Work type name is not valid!");
        }
    }

    async getAllWorkTypes(req, res, next) {
        var result = null;
        var message = null;
        const workTypes = await WorkType.find();
        if (workTypes) {
            result = workTypes;
            res.status(200).json({result: result, message: message});
        } else {
            message = 'Work types not found!';
            res.status(400).json({result: result, message: message});
        }
    }
}

export default new workTypeController;