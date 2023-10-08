import { prop } from "@rxweb/reactive-form-validators";

export class User {
  @prop()
  id: string;
  
  @prop()
  username: string;

  @prop()
  email: string;

  @prop()
  role: string;
  exp: number;
}