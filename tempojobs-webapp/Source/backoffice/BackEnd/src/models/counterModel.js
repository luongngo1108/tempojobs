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
        required: true,
    }
});

export default model("Counter",  Counter);