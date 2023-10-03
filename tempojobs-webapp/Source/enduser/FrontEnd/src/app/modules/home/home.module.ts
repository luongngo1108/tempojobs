import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { CreateWorkComponent } from './create-work/create-work.component';



@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
    CreateWorkComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    SharedModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
