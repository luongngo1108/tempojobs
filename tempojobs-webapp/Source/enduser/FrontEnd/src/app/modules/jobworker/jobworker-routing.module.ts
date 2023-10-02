import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobworkerPageComponent } from './jobworker-page/jobworker-page.component';

export const routes: Routes = [
  {
    path: '',
    component: JobworkerPageComponent,
    resolve: {},
    children: [
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobWorkerRoutingModule {}