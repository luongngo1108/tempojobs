import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const GoogleMapLocation = new Schema ({
    latitude: {
        type: Number
    },
    longitude: {
        type: Number,
    },
    mapType: {
        type: String
    },
    zoom: {
        type: Number
    }
}, {
    timestamps: true,
});

export default model('GoogleMapLocation', GoogleMapLocation);