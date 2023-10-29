import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';
import { WorkManagementComponent } from './work-management/work-management.component';
import { CreatedManageComponent } from './work-management/created-manage/created-manage.component';
import { AddEditWorkComponent } from './work-management/add-edit-work/add-edit-work.component';
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
        path: 'add-edit-work',
        component: AddEditWorkComponent
      },
      {
        path: 'add-edit-work/:id',
        component: AddEditWorkComponent
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