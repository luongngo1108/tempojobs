import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { UserLogin } from './user-login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit {
  frmLogin!: FormGroup;
  submitted = false;
  constructor(private frmBuilder: RxFormBuilder) {

  }

  ngOnInit(): void {
    this.frmLogin = this.frmBuilder.formGroup(UserLogin);
  }
  login() {

  }
}
