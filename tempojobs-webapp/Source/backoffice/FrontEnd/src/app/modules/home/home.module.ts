import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ThemeModule } from 'src/app/@theme/theme.module';


@NgModule({
  declarations: [],
  imports: [
    ThemeModule,
    SharedModule,
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
