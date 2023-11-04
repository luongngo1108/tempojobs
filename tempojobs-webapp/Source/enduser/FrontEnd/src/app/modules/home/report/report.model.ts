import { email, maxLength, minLength, prop, required } from "@rxweb/reactive-form-validators";

export class Report {
    @prop()
    _id: "";
    userId: string | null;
    @prop()
    @required()
    fullName: string | null;
    @prop()
    @email()
    @required()
    email: String | null;
    @prop()
    @maxLength({value: 10})
    @minLength({value: 10})
    phone: String | null;
    @prop()
    @required()
    message: String | null;
}