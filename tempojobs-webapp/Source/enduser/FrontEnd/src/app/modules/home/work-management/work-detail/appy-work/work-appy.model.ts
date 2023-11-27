import { prop } from "@rxweb/reactive-form-validators";

export class WorkApply{
    _id: string;
    userId: string;
    workId: number;
    status: number;
    @prop()
    content: string;
}