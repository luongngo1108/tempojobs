import { prop, required } from "@rxweb/reactive-form-validators";

export class DataStateModel {
    @prop()
    dataStateId: number | null;
    @prop()
    dataStateName: string | null;
    @prop()
    type: string | null;
    @prop()
    colorCode: string | null;
}