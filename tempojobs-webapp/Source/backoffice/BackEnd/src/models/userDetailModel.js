import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const UserDetail = new Schema ({
    firstName: { 
        type: String, max: 100, 
        required: [true, "Invalid FistName"],
    },
    lastName: { 
        type: String, max: 100
    },
    googleLocation: {
        type: Schema.Types.ObjectId,
        ref: 'GoogleMapLocation'
    },
    description: { 
        type: String
    },
    email: {
        type: String,
        required: [true]
    },
    phone: {
        type: String
    },
    facebook: {
        type: String
    },
    instagram: {
        type: String
    } 
}, {
    timestamps: true,
});

export default model('UserDetail', UserDetail);