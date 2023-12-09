import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { NbAuthModule } from '@nebular/auth';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonGroupModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbRadioModule, NbSearchModule, NbSelectModule, NbSpinnerModule, NbTabsetModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GoogleMapsModule } from '@angular/google-maps';
import { QuillModule } from 'ngx-quill';
import { MatTableModule } from '@angular/material/table';
import { HtmlSafetyPipe } from './pipes/safety-html.pipe';
import { DatePipePipe } from './pipes/date-pipe.pipe';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {MatDividerModule} from '@angular/material/divider';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { NgxTableComponent } from './components/ngx-table/ngx-table.component';
import { MatTableComponent } from './components/mat-table/mat-table.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RichInlineEditComponent } from './components/rich-inline-edit/rich-inline-edit.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatSliderModule } from '@angular/material/slider';
import { RatingStarComponent } from './components/rating-star/rating-star.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
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
  MatAutocompleteModule,
  MatExpansionModule,
  MatRadioModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatTableModule,
  MatDialogModule,
  QuillModule,
  MatListModule,
  MatDividerModule,
  MatSliderModule
];

const nebularModules = [
  NbIconModule,
  NbInputModule,
  NbCheckboxModule,
  NbButtonModule,
  NbButtonGroupModule,
  NbRadioModule,
  NbSearchModule,
  NbAlertModule,
  NbTabsetModule,
  NbSpinnerModule,
  NbDatepickerModule,
  NbSelectModule,
  NbFormFieldModule
];

const angularModules = [
  ReactiveFormsModule,
  MatFormFieldModule,
  RxReactiveFormsModule,
  HttpClientModule,
  FlexLayoutModule,
  ColorPickerModule,
  NgxSkeletonLoaderModule,
  NgxMatSelectSearchModule
];

@NgModule({
  declarations: [
    HtmlSafetyPipe,
    DatePipePipe,
    ConfirmModalComponent,
    NgxTableComponent,
    MatTableComponent,
    ToolbarComponent,
    RichInlineEditComponent,
    ConfirmDialogComponent,
    RatingStarComponent
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
    ToastModule,
    [...materialModules],
    [...nebularModules],
    [...angularModules]
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
    HtmlSafetyPipe,
    ToastModule,
    [...materialModules],
    [...nebularModules],
    [...angularModules],
    DatePipePipe,
    NgxTableComponent,
    MatTableComponent,
    ToolbarComponent,
    RichInlineEditComponent,
    ConfirmDialogComponent,
    RatingStarComponent
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MessageService
    },
  ]
})
export class SharedModule { }
