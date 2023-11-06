/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbAuthSocialLink } from '@nebular/auth';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { UserRegister } from 'src/app/modules/shared/models/user.model';
import { getDeepFromObject } from 'src/app/modules/shared/utility/Helper';

@Component({
  selector: 'nb-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  // radioOptions = [
  //   { value: 'isCreator', label: 'Đăng ký làm creator', checked: true },
  //   { value: 'isTasker', label: 'Đăng ký làm tasker' },
  // ];

  // statuses: NbComponentStatus[] = ['basic', 'primary', 'success', 'warning', 'danger', 'info', 'control'];
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  socialLinks: NbAuthSocialLink[] = [];
  registerFormGroup: FormGroup

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router,
              private formBuilder: RxFormBuilder) {

    // this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.strategy = this.getConfigValue('forms.register.strategy');
    // this.socialLinks = this.getConfigValue('forms.login.socialLinks');
  }

  ngOnInit(): void {
    this.user = new UserRegister();
    this.user.role = "Admin";
    this.registerFormGroup = this.formBuilder.formGroup(this.user);
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.register(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      console.log(result)
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = [result.getResponse().error];
        console.log(this.errors)
      }
      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}