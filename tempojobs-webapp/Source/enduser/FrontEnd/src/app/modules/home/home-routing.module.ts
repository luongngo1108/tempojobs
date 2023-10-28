import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateWorkComponent } from './work-management/create-work/create-work.component';
import { WorkManagementComponent } from './work-management/work-management.component';
import { CreatedManageComponent } from './work-management/created-manage/created-manage.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {},
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'work-list',
        component: WorkManagementComponent
      },
      {
        path: 'create-work',
        component: CreateWorkComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'created-manage',
        component: CreatedManageComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}