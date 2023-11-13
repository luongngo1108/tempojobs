import { NumericValueType, numeric, prop, required } from "@rxweb/reactive-form-validators";
import { GoogleMapLocation, User } from "../../shared/models/user.model";
import { DataStateModel } from "../datastate-management/data-state.model";

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
    @numeric({ acceptValue: NumericValueType.PositiveNumber, message: 'Chỉ cho phép nhập số' })
    workHours: number | null;
    @prop()
    workTypeId: number | null;
    @prop()
    workStatusId: number | null;
    @prop()
    createdById: string | null;
    @prop()
    @numeric({ acceptValue: NumericValueType.PositiveNumber, message: 'Chỉ cho phép nhập số' })
    quantity: number | null;
    @prop()
    // @numeric({ acceptValue: NumericValueType.PositiveNumber, message: 'Chỉ cho phép nhập số' })
    workProfit: string | null;

    @prop()
    createdBy: User | null;

    @prop()
    createdAt: Date | string | null;
    @prop()
    workApply: string[] | null;

    listTaskerWaitings: User[] | null;
    listTaskerAccepted: User[] | null;

    googleLocation: GoogleMapLocation = null; 

    workProvinceName: string | null;
    timeLine: string | null;
    workType: DataStateModel | null;
    orderId: string | null;
    workStatus: DataStateModel | null;
}