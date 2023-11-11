import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeModule } from './@theme/theme.module';
import { CoreModule } from './@core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbLayoutModule, NbSidebarModule, NbMenuModule, NbDatepickerModule, NbDialogModule, NbWindowModule, NbToastrModule, NbChatModule, NbCardModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { TokenInterceptor } from './TokenInterceptor';
import { QuillModule } from 'ngx-quill'
import { DatePipe } from '@angular/common';
import { DatePipePipe } from './shared/pipes/date-pipe.pipe';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from "src/environments/environment";
import {StorageModule} from '@angular/fire/storage'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    QuillModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyDPOyzngYDXtIRdJTDFwSV02xNIDLEXgHI',
    }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbCardModule,
    FontAwesomeModule,
    provideFirebaseApp(() => initializeApp( environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    StorageModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    DatePipe,
    DatePipePipe,
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp( environment.firebaseConfig)),
      provideFirestore(() => getFirestore()),
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
