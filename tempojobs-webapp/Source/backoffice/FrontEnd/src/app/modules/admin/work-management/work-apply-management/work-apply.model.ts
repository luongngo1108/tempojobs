import { prop } from "@rxweb/reactive-form-validators";
import { ProfileDetail } from "src/app/modules/shared/models/user.model";

export class WorkApply{
    _id: string;
    userId: string;
    workId: number;
    status: number;
    @prop()
    content: string;
    @prop()
    star: number;
}

export class WorkApplyViewModel extends WorkApply {
    workApply: WorkApply;
    userDetail: ProfileDetail;
}