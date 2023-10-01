import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { NbAuthModule } from '@nebular/auth';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbLayoutModule, NbMenuModule } from '@nebular/theme';
import { NgxTableComponent } from './components/ngx-table/ngx-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

const materialModules = [
  MatFormFieldModule,
  MatCheckboxModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatGridListModule,
];

const nebularModules = [
  NbIconModule
];

@NgModule({
  declarations: [
    NgxTableComponent
  ],
  imports: [
    CommonModule,
    NbAuthModule,
    NbLayoutModule,
    NbCardModule,
    NbMenuModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgxDatatableModule,
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
    NgxDatatableModule,
    NgxTableComponent,
    [...materialModules]
  ]
})
export class SharedModule { }
