import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const WorkApply = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    workId: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: "Đang đăng ký"
    },
    content: {
        type: String,
        default: null
    },
});

export default model("WorkApply",  WorkApply);