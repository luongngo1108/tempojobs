import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DatastateManagementComponent } from './datastate-management/datastate-management.component';
import { ReportManagementComponent } from './report-management/report-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { WorkManagementComponent } from './work-management/work-management.component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    {
      path: 'user',
      component: UserManagementComponent,
    },
    {
      path: 'datastate',
      component: DatastateManagementComponent,
    },
    {
      path: 'report',
      component: ReportManagementComponent,
    },
    {
      path: 'work',
      component: WorkManagementComponent,
    },
    {
      path: '',
      redirectTo: 'tables/tree-grid',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
