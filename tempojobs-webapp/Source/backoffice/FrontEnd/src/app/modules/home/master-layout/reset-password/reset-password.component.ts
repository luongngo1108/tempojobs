/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService } from '@nebular/auth';
import { getDeepFromObject } from 'src/app/modules/shared/utility/Helper';
import { AuthService } from '../auth.service';

@Component({
  selector: 'nb-reset-password-page',
  styleUrls: ['./reset-password.component.scss'],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  submitted = false;
  isChangedPassword = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  constructor(protected authService: AuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router,
              private activateRoute: ActivatedRoute) {

    this.redirectDelay = this.getConfigValue('forms.resetPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.resetPassword.showMessages');
    this.strategy = this.getConfigValue('forms.resetPassword.strategy');
  }

  resetPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    if(this.user.password !== this.user.confirmPassword) {
      this.submitted = false;
      return;
    }

    var userId = this.activateRoute.snapshot.paramMap.get('userId');
    var token = this.activateRoute.snapshot.paramMap.get('token');
    this.authService.resetPassword(this.user.password, userId, token).subscribe(res => {   
      this.submitted = false;
      if(res.result) {
        this.messages = [res.result];
        this.isChangedPassword = true;
      } else {
        this.errors = ["This reset link has been decrypted"];
      }
      this.cd.detectChanges();
    })
    
    // this.service.resetPassword(this.strategy, this.user).subscribe((result: NbAuthResult) => {
    //   this.submitted = false;
    //   if (result.isSuccess()) {
    //     this.messages = result.getMessages();
    //   } else {
    //     this.errors = result.getErrors();
    //   }

    //   const redirect = result.getRedirect();
    //   if (redirect) {
    //     setTimeout(() => {
    //       return this.router.navigateByUrl(redirect);
    //     }, this.redirectDelay);
    //   }
    //   this.cd.detectChanges();
    // });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}