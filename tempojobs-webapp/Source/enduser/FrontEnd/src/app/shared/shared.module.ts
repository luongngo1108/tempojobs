import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { NbAuthModule } from '@nebular/auth';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonGroupModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbRadioModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';
import { GoogleMapsModule } from '@angular/google-maps';


const materialModules = [
  MatFormFieldModule,
  MatCheckboxModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatGridListModule,
  MatSelectModule,
  MatDatepickerModule,
  MatTabsModule,
  MatTooltipModule,
];

const nebularModules = [
  NbIconModule,
  NbInputModule,
  NbCheckboxModule,
  NbButtonModule,
  NbButtonGroupModule,
  NbRadioModule,
  NbAlertModule,
];

const angularModules = [
  ReactiveFormsModule,
  MatFormFieldModule,
  RxReactiveFormsModule,
  HttpClientModule,
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NbAuthModule,
    NbLayoutModule,
    NbCardModule,
    NbMenuModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgxDatatableModule,
    GoogleMapsModule,
    [...materialModules],
    [...nebularModules],
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    NbAuthModule,
    NbLayoutModule,
    NbCardModule,
    NbMenuModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgxDatatableModule,
    NgxMatDatetimePickerModule, 
    NgxMatNativeDateModule, 
    NgxMatTimepickerModule,
    GoogleMapsModule,
    [...materialModules],
    [...nebularModules],
    [...angularModules]
  ]
})
export class SharedModule { }
