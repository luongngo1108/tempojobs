import { email, maxLength, password, prop, required } from "@rxweb/reactive-form-validators";

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

export class UserRegister {
  @prop()
  @required()
  @maxLength({value: 100}) 
  firstName: string;

  @prop()
  @maxLength({value: 100}) 
  lastName: string;

  @prop()
  @email()
  email: string;

  @prop()
  @password({validation:{maxLength: 40, minLength: 5}})
  password: string;
}