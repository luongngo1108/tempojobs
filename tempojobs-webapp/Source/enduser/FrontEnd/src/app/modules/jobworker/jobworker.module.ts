import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobworkerPageComponent } from './jobworker-page/jobworker-page.component';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { JobWorkerRoutingModule } from './jobworker-routing.module';



@NgModule({
  declarations: [
    JobworkerPageComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    SharedModule,
    JobWorkerRoutingModule,
  ]
})
export class JobworkerModule { }
