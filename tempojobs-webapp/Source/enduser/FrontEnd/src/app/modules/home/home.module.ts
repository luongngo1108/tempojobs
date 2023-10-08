import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { CreateWorkComponent } from './work-management/create-work/create-work.component';
import { ProfileComponent } from './profile/profile.component';
import { WorkManagementComponent } from './work-management/work-management.component';
import { WorkDetailComponent } from './work-management/work-detail/work-detail.component';



@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
    CreateWorkComponent,
    ProfileComponent,
    WorkManagementComponent,
    WorkDetailComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    SharedModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
