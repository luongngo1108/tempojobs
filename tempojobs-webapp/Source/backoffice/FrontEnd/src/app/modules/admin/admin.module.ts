import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { AddEditUserComponent } from './user-management/add-edit-user/add-edit-user.component';


@NgModule({
  declarations: [
    AdminComponent,
    UserManagementComponent,
    ProfileDialogComponent,
    AddEditUserComponent
  ],
  imports: [
    ThemeModule,
    SharedModule,
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
