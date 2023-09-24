import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCreatorRoutingModule } from './jobcreator-routing.module';
import { JobcreatorPageComponent } from './jobcreator-page/jobcreator-page.component';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { JobCreatorComponent } from './jobcreator.component';
import { CreateWorkComponent } from './create-work/create-work.component';



@NgModule({
  declarations: [
    JobCreatorComponent,
    JobcreatorPageComponent,
    CreateWorkComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    SharedModule,
    JobCreatorRoutingModule,
  ]
})
export class JobcreatorModule { }
