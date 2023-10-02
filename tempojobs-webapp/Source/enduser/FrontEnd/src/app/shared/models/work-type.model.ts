import { prop, required } from "@rxweb/reactive-form-validators";

export class WorkTypeModel {
    @prop()
    workTypeId: string;
    @prop()
    workTypeName: string | null;
}