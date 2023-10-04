import DataState from '../models/dataStateModel.js'

class DataStateController {
    async getDataStateAll(req, res, next) {
        try {
            const dataState = await DataState.findAll();
            res.status(200).json(dataState);
        } catch (error) {
            next(error);
        }
    }

    async saveDataState(req, res, next) {
        try {
            var result = null;
            var message = null;
            const { dataStateName, type, colorCode } = req.body;
            if (!dataStateName || !type) {
                message = "Data State Name and Type are required";
                res.status(400).json({result: result, message: message});
                return;
            }
            const dataState = await DataState.create(req.body);
            if (dataState) {
                result = dataState;
                res.status(200).json({result: result, message: message});
            } else {
                message = "Error creating DataState";
                res.status(400).json({result: result, message: message});
            }
        } catch (error) {
            next(error);
        }
    }

    async getDataStateByType(req, res, next) {
        try {
            var result = null;
            var message = null;
            const type = req.query.type;
            if (!type) {
                message = "Type is required";
                res.status(400).json({result: result, message: message});
                return;
            }
            const dataState = await DataState.find({
                type: type
            });
            if (dataState) {
                result = dataState;
                res.status(200).json({result: result, message: message});
            } else {
                message = "Error get DataState by type: " + type;
                res.status(400).json({result: result, message: message});
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new DataStateController;