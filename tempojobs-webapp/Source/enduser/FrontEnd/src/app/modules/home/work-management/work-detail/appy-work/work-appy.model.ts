import { prop } from "@rxweb/reactive-form-validators";
import { ProfileDetail } from "../../../profile/user.model";

export class WorkApply{
    _id: string;
    userId: string;
    workId: number;
    status: number;
    @prop()
    content: string;
}

export class WorkApplyViewModel extends WorkApply {
    workApply: WorkApply;
    userDetail: ProfileDetail;
}