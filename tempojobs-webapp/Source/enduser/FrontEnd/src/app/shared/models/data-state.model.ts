import { prop, required } from "@rxweb/reactive-form-validators";

export class DataStateModel {
    @prop()
    dataStateName: string | null;
    @prop()
    type: string | null;
    @prop()
    colorCode: string | null;
}