import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesRoutingModule } from './modules-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { CoreModule } from '../@core/core.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    SharedModule
  ],
  exports: [
    CommonModule,
  ]
})
export class ModulesModule { }
