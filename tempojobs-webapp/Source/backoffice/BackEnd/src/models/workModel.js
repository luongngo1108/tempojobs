import { Schema as _Schema, model } from 'mongoose';
import User from '../models/userModel.js';
const Schema = _Schema;

const Work = new Schema ({
    workId: {
        type: Number,
    },
    workName: { 
        type: String, 
        required: [true, "Please add the work name!"],
    },
    workProvince: {
        type: String,
        required: [true, "Please add the work province!"],
    },
    workDistrict: {
        type: String,
        required: [true, "Please add the work district!"],
    },
    workAddress: { 
        type: String, 
        required: [true, "Please add the work address!"]
    },
    workDescription: {
        type: String,
        required: [false, "Please add the work description!"]
    },
    startDate: {
        type: Date,
        required: [true, "Please add the start date!"]
    },
    workHours: {
        type: Number,
        required: [true, "Please add the work hours!"]
    },
    workTypeId: {
        type: Schema.Types.ObjectId,
        ref: 'WorkType'
    },
    workStatusId: {
        type: String,
    },
    createdById: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please add the createById!"]
    },
    quantity: {
        type: Number,
        required: [true, "Please add the quantity!"]
    },
    workProfit: {
        type: String,
        required: [true, "Please add the work profit!"]
    },
    createdBy: {
        type: Schema.Types.Object
    }
    
}, {
    timestamps: true,
});

export default model('Work', Work);