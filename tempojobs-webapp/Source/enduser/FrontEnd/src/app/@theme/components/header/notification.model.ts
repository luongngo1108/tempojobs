import { prop } from "@rxweb/reactive-form-validators";

export class Notification{
    reciever: string | null;
    referenceUser:string | null;
    type: string | null;
    isRead: boolean = false;
    title:string | null;
    content:string | null;
    redirectUrl: string | null;
}