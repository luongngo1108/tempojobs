import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobcreatorPageComponent } from './jobcreator-page/jobcreator-page.component';
import { JobCreatorComponent } from './jobcreator.component';
import { CreateWorkComponent } from './create-work/create-work.component';

export const routes: Routes = [
  {
    path: '',
    component: JobCreatorComponent,
    resolve: {},
    children: [
      {
        path: 'create-work',
        component: CreateWorkComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobCreatorRoutingModule {}