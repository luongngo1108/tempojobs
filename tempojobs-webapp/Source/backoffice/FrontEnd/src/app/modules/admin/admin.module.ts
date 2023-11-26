import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { DatastateManagementComponent } from './datastate-management/datastate-management.component';
import { AddEditDatastateComponent } from './datastate-management/add-edit-datastate/add-edit-datastate.component';
import { ReportManagementComponent } from './report-management/report-management.component';
import { AddEditReportComponent } from './report-management/add-edit-report/add-edit-report.component';
import { WorkManagementComponent } from './work-management/work-management.component';
import { AddEditWorkComponent } from './work-management/add-edit-work/add-edit-work.component';
import { WorkApplyManagementComponent } from './work-management/work-apply-management/work-apply-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsComponent } from './dashboard/charts/charts.component';
import { UserProfileComponent } from './work-management/user-profile/user-profile.component';


@NgModule({
  declarations: [
    AdminComponent,
    UserManagementComponent,
    ProfileDialogComponent,
    DatastateManagementComponent,
    AddEditDatastateComponent,
    ReportManagementComponent,
    AddEditReportComponent,
    WorkManagementComponent,
    AddEditWorkComponent,
    WorkApplyManagementComponent,
    DashboardComponent,
    ChartsComponent,
    UserProfileComponent
  ],
  imports: [
    ThemeModule,
    SharedModule,
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
