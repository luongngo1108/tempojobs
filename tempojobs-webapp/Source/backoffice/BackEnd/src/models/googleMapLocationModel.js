import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const GoogleMapLocation = new Schema ({
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null,
    },
    address: {
        type: String,
        default: null
    },
}, {
    timestamps: true,
});

export default model('GoogleMapLocation', GoogleMapLocation);