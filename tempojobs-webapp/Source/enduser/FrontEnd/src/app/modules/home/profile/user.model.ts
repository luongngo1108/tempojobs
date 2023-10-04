import { prop } from "@rxweb/reactive-form-validators";

export class User {
  @prop()
  username: string;

  @prop()
  email: string;

  @prop()
  role: string;
  exp: number;
}