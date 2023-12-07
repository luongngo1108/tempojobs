import { email, maxLength, minLength, password, prop, propObject, required } from "@rxweb/reactive-form-validators";

export class User {
  @prop()
  _id: string;

  @prop()
  displayName: string;

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
  // constructor(firstName, lastName, googleLocation, description, email, phone, facebook, instagram) {
  //   this.firstName = firstName,
  //   this.lastName = lastName,
  //   this.googleLocation = googleLocation,
  //   this.description = description,
  //   this.email = email,
  //   this.phone = phone,
  //   this.facebook = facebook,
  //   this.instagram = instagram
  // }
  @prop()
  @required()
  @maxLength({ value: 100 })
  firstName: string = null;
  @prop()
  @maxLength({ value: 100 })
  lastName: string = null;
  googleLocation: GoogleMapLocation = null;
  @prop()
  description: string = null;
  @prop()
  @email()
  @required()
  email: string = null;
  @prop()
  @maxLength({value: 10})
  @minLength({value: 10})
  phone: string = null;
  @prop()
  facebook: string = null;
  @prop()
  instagram: string = null;
  createdAt: string = null;
  updatedAt: string = null;
  __v: number  = 0;
  @prop()
  _id: string = null;

  @prop()
  @password({ validation: { maxLength: 40, minLength: 5 } })
  password: string = null;
  @prop()
  confirmPassword;
  @prop()
  @required()
  role: string;
  @prop()
  address: string;
  @prop()
  @required()
  sex: string;
  @prop()
  @required()
  birth: Date;
  @prop()
  avatarUrl: string;
  @prop()
  evaluation: number[] | null;
}

export class GoogleMapLocation {
  _id: string;
  @prop()
  latitude: number | null;
  @prop()
  longitude: number | null;
  @prop()
  address: string | null;
}