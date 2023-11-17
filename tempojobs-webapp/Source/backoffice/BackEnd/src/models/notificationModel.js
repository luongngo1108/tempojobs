import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const Notification = new Schema({
    reciever: {
        type: Schema.Types.Object,
        ref: 'User',
        default: null,
    },
    referenceUser: {
        type: Schema.Types.Object,
        ref: 'User',
        default: null,
    },
    type: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: null,
    },
    content: {
        type: String,
        default: null
    },
    redirectUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
});

export default model('Notification', Notification);