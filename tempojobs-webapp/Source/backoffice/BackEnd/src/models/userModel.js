import { Schema as _Schema, model } from 'mongoose';
import { randomUUID } from 'crypto'
const Schema = _Schema;

const User = new Schema ({
    _id: {
        type: 'UUID',
        default: () => randomUUID()
    },
    displayName: { 
        type: String, max: 25, 
        required: [true, "Invalid username!"],
    },
    email: { 
        type: String, 
        required: [true, "Please add the email!"], 
        unique:  [true, "Email address has already been taken!"] ,
    },
    password: { 
        type: String, 
        max: 10 , 
        required: [true, "Inavlid password!"],
    },
    userDetail: {
        type: Schema.Types.ObjectId,
        ref: 'UserDetail'
    },
    role: {
        type: String,
        default: "User",
    },
}, {
    timestamps: true,
});

export default model('User', User);