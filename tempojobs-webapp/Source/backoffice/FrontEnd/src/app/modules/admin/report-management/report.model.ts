import { prop, required } from "@rxweb/reactive-form-validators";

export class Report {
    @prop()
    _id: string | null;
    @prop()
    userId: string | null;
    @prop()
    @required()
    fullName: string | null;
    @prop()
    @required()
    email: string | null;
    @prop()
    phone: string | null;
    @prop()
    message: string |  null;
}