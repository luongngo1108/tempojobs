import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { UserLogin } from './user-login';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit {
  frmLogin!: FormGroup;
  submitted = false;
  user = {};
  constructor(private frmBuilder: RxFormBuilder,
    private authService: NbAuthService) {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
    
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
        console.log(this.user);
      }
      
    });
  }

  ngOnInit(): void {
    this.frmLogin = this.frmBuilder.formGroup(UserLogin);
  }
  login() {

  }
}
