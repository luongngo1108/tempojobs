import { email, maxLength, password, prop, propObject, required } from "@rxweb/reactive-form-validators";

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
  @maxLength({ value: 100 })
  firstName: string;

  @prop()
  @maxLength({ value: 100 })
  lastName: string;

  @prop()
  @email()
  @required()
  email: string;

  @prop()
  @password({ validation: { maxLength: 40, minLength: 5 } })
  password: string;
}

export class ProfileDetail {
  @prop()
  @required()
  @maxLength({ value: 100 })
  firstName: string;
  @prop()
  @maxLength({ value: 100 })
  lastName: string;
  @propObject()
  googleLocation: GoogleMapLocation;
  @prop()
  description: string;
  @prop()
  @email()
  @required()
  email: string;
  @prop()
  @maxLength({value: 10})
  phone: string;
  @prop()
  facebook: string;
  @prop()
  instagram: string;
}

export class GoogleMapLocation {
  @prop()
  latitude: number;
  @prop()
  longitude: number;
  @prop()
  mapType: string = 'satelite';
  @prop()
  zoom: number = 5;
}