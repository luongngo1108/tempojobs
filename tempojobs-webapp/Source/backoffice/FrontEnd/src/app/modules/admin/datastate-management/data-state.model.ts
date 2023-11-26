import { prop, required } from "@rxweb/reactive-form-validators";

export class DataStateModel {
    @prop()
    dataStateId: number | null;
    @prop()
    @required()
    dataStateName: string | null;
    @prop()
    @required()
    type: string | null;
    @prop()
    colorCode: string | null;
    @prop()
    @required()
    order: number | null;
}