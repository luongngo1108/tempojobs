/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService } from '@nebular/auth';
import { getDeepFromObject } from 'src/app/modules/shared/utility/Helper';
import { AuthService } from '../auth.service';

@Component({
  selector: 'nb-request-password-page',
  styleUrls: ['./request-password.component.scss'],
  templateUrl: './request-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestPasswordComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  constructor(
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router,
              private authService: AuthService) {
                

    this.redirectDelay = this.getConfigValue('forms.requestPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.requestPassword.showMessages');
    this.strategy = this.getConfigValue('forms.requestPassword.strategy');
  }

  requestPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.authService.sendEmailChangePassword(this.user.email).subscribe(res => {
      this.submitted = false;
      if(res.result) {
        this.messages = [res.result];
      } else {
        this.messages = [];
        this.errors = ["Your email hasn't been registerd"];
      }
      this.cd.detectChanges();
    })
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}