import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const WorkType = new Schema ({
    workTypeName: { 
        type: String, 
        required: [true, "Please add the work type name!"],
        unique:  [true, "Work type name has already been taken!"]
    },
}, {
    timestamps: true,
});

export default model('WorkType', WorkType);