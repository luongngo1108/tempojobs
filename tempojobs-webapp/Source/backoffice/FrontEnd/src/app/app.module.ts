import { NgModule } from '@angular/core';
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
import { DatePipePipe } from './modules/shared/pipes/date-pipe.pipe';
import { NgxEchartsModule } from 'ngx-echarts';

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
      messageGoogleMapKey: 'AIzaSyB1yEdS9u5q5jTccAQYiFeld-23fiMH1gM',
    }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbCardModule,
    FontAwesomeModule,
    NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    DatePipe,
    DatePipePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
