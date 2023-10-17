import { prop, required } from "@rxweb/reactive-form-validators";
import { User } from "src/app/modules/home/profile/user.model";

export class WorkModel {
    @prop()
    workId: number | null;
    @prop()
    workName: string | null;
    @prop()
    workProvince: string | null;
    @prop()
    workDistrict: string | null;
    @prop()
    workAddress: string | null;
    @prop()
    workDescription: string | null;
    @prop()
    startDate: Date | string | null;
    @prop()
    workHours: number | null;
    @prop()
    workTypeId: string | null;
    @prop()
    workStatusId: number | null;
    @prop()
    createdById: string | null;
    @prop()
    quantity: number | null;
    @prop()
    workProfit: number | null;

    @prop()
    createdBy: User | null;

    @prop()
    createdAt: Date | string | null;

    workProvinceName: string | null;
    timeLine: string | null;
}