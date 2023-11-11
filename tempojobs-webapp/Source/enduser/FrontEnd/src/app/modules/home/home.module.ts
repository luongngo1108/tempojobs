import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';
import { WorkManagementComponent } from './work-management/work-management.component';
import { WorkDetailComponent } from './work-management/work-detail/work-detail.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { ProfileActivityComponent } from './profile/profile-activity/profile-activity.component';
import { CreatedManageComponent } from './work-management/created-manage/created-manage.component';
import { AddEditWorkComponent } from './work-management/add-edit-work/add-edit-work.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AppyWorkComponent } from './work-management/work-detail/appy-work/appy-work.component';
import { ApproveTaskerDialogComponent } from './work-management/created-manage/approve-tasker-dialog/approve-tasker-dialog.component';
import { ReportComponent } from './report/report.component';
import { TaskerManageComponent } from './work-management/tasker-manage/tasker-manage.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
    ProfileComponent,
    WorkManagementComponent,
    WorkDetailComponent,
    EditProfileComponent,
    ProfileActivityComponent,
    CreatedManageComponent,
    AddEditWorkComponent,
    UserProfileComponent,
    AppyWorkComponent,
    ApproveTaskerDialogComponent,
    ReportComponent,
    TaskerManageComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    SharedModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
