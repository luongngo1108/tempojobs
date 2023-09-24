import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
// import { CKEditorModule } from 'ng2-ckeditor';


import { EditorsRoutingModule, routedComponents } from './editors-routing.module';
import { ThemeModule } from 'src/app/@theme/theme.module';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    EditorsRoutingModule,
    // CKEditorModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class EditorsModule { }
