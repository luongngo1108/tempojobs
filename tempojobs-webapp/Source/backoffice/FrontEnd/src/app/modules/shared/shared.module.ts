import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { NbAuthModule } from '@nebular/auth';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbLayoutModule, NbMenuModule } from '@nebular/theme';

const materialModules = [
  MatFormFieldModule,
  MatCheckboxModule,
  MatInputModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbAuthModule,
    NbLayoutModule,
    NbCardModule,
    NbMenuModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    [...materialModules]
  ],
  exports: [
    CommonModule,
    NbAuthModule,
    NbLayoutModule,
    NbCardModule,
    NbMenuModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    [...materialModules]
  ]
})
export class SharedModule { }
