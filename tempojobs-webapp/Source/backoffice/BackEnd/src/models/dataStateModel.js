import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const DataState = new Schema ({
    dataStateId: {
        type: Number,
    },
    dataStateName: {
        type: String,
        required: [true, "Please add the data state name!"],
    },
    type: {
        type: String,
        required: [true, "Please add the data state type!"],
    },
    colorCode: {
        type: String,
        required: [false, "Please add the data state color code!"],
    },
    order: {
        type: Number
    }
}, {
    timestamps: true,
});

export default model('DataState', DataState);