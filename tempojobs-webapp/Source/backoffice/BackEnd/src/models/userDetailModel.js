import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const UserDetail = new Schema ({
    firstName: { 
        type: String, max: 100, 
        required: [true, "Invalid FistName"],
        default: ""
    },
    lastName: { 
        type: String, max: 100,
        default: ""
    },
    googleLocation: {
        type: Schema.Types.ObjectId,
        ref: 'GoogleMapLocation',
        default: null
    },
    description: { 
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: [true],
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    facebook: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
    },
    role: {
        type: String,
    }
}, {
    timestamps: true,
});

export default model('UserDetail', UserDetail);