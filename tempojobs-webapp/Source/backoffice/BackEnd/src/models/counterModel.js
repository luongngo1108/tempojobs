import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const Counter = new Schema({
    field: {
        type: String,
        required: true,
        unique: true
    },
    lastValue: {
        type: Number,
        default: 0
    }
});

export default model("Counter",  Counter);