import { Schema as _Schema, model } from 'mongoose';
import { randomUUID } from 'crypto'
const Schema = _Schema;

const PaymentHistory = new Schema ({
    payerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please add the payer!"]
    },
    workId: {
        type: Number,
        ref: 'Work',
        required: [true, "Please add the work!"]
    },
    amount: { 
        type: Number, 
        required: [true],
    },
    paymentType: { 
        type: String, 
        required: [true],
    },
}, {
    timestamps: true,
});

export default model('PaymentHistory', PaymentHistory);