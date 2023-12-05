import { User } from "../../shared/models/user.model";

export class PaymentHistory {
    _id: string;
    payerId: string;
    workId: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    payerName: string
}