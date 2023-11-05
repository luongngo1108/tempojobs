import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterLayoutRoutingModule } from './master-layout-routing.module';
import { MasterLayoutComponent } from './master-layout.component';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { AuthComponent } from './auth/auth.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    MasterLayoutComponent,
    LoginComponent,
    AuthComponent,
    RegisterComponent,
    RequestPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    ThemeModule,
    SharedModule,
    CommonModule,
    MasterLayoutRoutingModule
  ]
})
export class MasterLayoutModule { }
