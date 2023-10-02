import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NbIconModule } from '@nebular/theme';
import { MatGridListModule } from '@angular/material/grid-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';

const materialModules = [
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatGridListModule,
  MatSelectModule,
];

const nebularModules = [
  NbIconModule
];

const angularModules = [
  ReactiveFormsModule,
  MatFormFieldModule,
  RxReactiveFormsModule,
  HttpClientModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    ...angularModules,
    ...materialModules,
    ...nebularModules,
  ]
})
export class SharedModule { }
