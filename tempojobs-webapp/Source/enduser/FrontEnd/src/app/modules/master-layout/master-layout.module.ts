import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterLayoutRoutingModule } from './master-layout-routing.module';
import { MasterLayoutComponent } from './master-layout.component';
import { LoginComponent } from './login/login.component';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { AuthComponent } from './auth/auth.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MasterLayoutComponent,
    LoginComponent,
    AuthComponent
  ],
  imports: [
    ThemeModule,
    SharedModule,
    CommonModule,
    MasterLayoutRoutingModule
  ]
})
export class MasterLayoutModule { }
