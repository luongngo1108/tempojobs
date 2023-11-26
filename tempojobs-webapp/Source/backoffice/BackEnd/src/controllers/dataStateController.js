import { ReturnResult } from '../DTO/returnResult.js';
import counterModel from '../models/counterModel.js';
import DataState from '../models/dataStateModel.js'
import { getLastCounterValue } from '../utils/counterUtil.js';

class DataStateController {
    async getDataStateAll(req, res, next) {
        try {
            const data = await DataState.find({});
            res.status(200).json({data});
        } catch (error) {
            next(error);
        }
    }

    async saveDataState(req, res, next) {
        try {
            var result = null;
            var message = null;
            const { dataStateName, type, colorCode, dataStateId } = req.body;
            if (!dataStateName || !type) {
                message = "Data State Name and Type are required";
                res.status(400).json({result: result, message: message});
                return;
            }
            const dataStateToSave = req.body;
            if(dataStateId && dataStateId > 0) {
                var updatedDataState = await DataState.findOneAndUpdate({dataStateId: dataStateId}, dataStateToSave, {returnOriginal: false});
                if(updatedDataState) res.status(200).json({result: updatedDataState, message: message});
            } else {
                var nextDataStateId = await getLastCounterValue('dataStateId') + 1;
                const counterUpdated = await counterModel.findOneAndUpdate({field: 'dataStateId'}, {lastValue: nextDataStateId});
                dataStateToSave.dataStateId = nextDataStateId;
                const dataState = await DataState.create(dataStateToSave);
                if (dataState) {
                    result = dataState;
                    res.status(200).json({result: result, message: message});
                } else {
                    message = "Error creating DataState";
                    res.status(400).json({result: result, message: message});
                }
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

    async getDataStateByTypeAndName(req, res, next) {
        try {
            var result = null;
            var message = null;
            const type = req.query.type;
            const name = req.query.name;
            if (!type || !name) {
                message = "Data is required";
                res.status(400).json({result: result, message: message});
                return;
            }
            const dataState = await DataState.findOne({
                type: type,
                dataStateName: name
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

    async onDeletes(req, res, next) {
        var result = new ReturnResult();
        try {
            const ids = req.body;
            if(ids || ids?.length > 0) {
                for(var id of ids) {
                    await DataState.findOneAndRemove({dataStateId: id});
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

export default new DataStateController;