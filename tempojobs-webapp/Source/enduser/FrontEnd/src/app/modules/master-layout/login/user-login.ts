
import { prop, required, minLength } from '@rxweb/reactive-form-validators';
export class UserLogin {
    @required()
    userNameOrEmail!: string;
    @required()
    @minLength({ value: 6 })
    password!: string;
    @prop()
    rememberMe = false;
}
