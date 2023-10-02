import { prop, required } from "@rxweb/reactive-form-validators";

export class WorkModel {
    @prop()
    workId: number | null;
    @prop()
    workName: string | null;
    @prop()
    workAddress: string | null;
    @prop()
    workDescription: string | null;
    @prop()
    startDate: Date | string | null;
    @prop()
    workHours: number | null;
    @prop()
    workTypeId: number | null;
    @prop()
    workStatusId: number | null;
    @prop()
    createdBy: string | null;
    @prop()
    quantity: number | null;
    @prop()
    workProfit: number | null;
}