import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [
    HomePageComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    SharedModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
