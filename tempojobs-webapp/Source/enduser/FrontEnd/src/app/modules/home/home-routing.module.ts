import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeComponent } from './home.component';
import { CreateWorkComponent } from './create-work/create-work.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {},
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'create-work',
        component: CreateWorkComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}