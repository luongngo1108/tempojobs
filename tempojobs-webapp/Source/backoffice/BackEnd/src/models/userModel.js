import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const User = new Schema ({
    username: { 
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
    role: {
        type: String,
        default: "User",
    },
}, {
    timestamps: true,
});

export default model('User', User);