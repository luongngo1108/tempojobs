import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const Report = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    workId: {
        type: Number
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    message: {
        type: String,
        default: ""
    },
}, {
    timestamps: true,
});

export default model("Report", Report);