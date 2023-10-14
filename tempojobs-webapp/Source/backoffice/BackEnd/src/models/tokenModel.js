import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const Token = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*5,
    },
});

export default model("Token", Token);