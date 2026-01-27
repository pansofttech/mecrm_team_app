import { CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './features/login/login.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { KendoModule } from './kendo.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { CommonFeaturesModule } from './features/common/common.module';
import { EnquiryDetailsModule } from './features/enquiry-details/enquiry-details.module';
import { ServiceCalendarModule } from './features/service-calendar/service-calendar.module';
import { WorksheetModule } from './features/worksheet/worksheet.module';
import { SalesPartsManagementModule } from './features/sales-parts-management/sales-parts-management.module';
import { PrlcModule } from './features/prlc/prlc.module';
import { HttpClientModule } from '@angular/common/http';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { LoginService } from './features/login/components/login/login.service';
import { NotificationService } from './core/services/notification.service';
import { ConfigService } from './core/services/config.service';
import { LoaderService } from './core/services/loader.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './auth.guard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IconsModule } from '@progress/kendo-angular-icons';
import { PDFViewerModule } from '@progress/kendo-angular-pdfviewer';
import { PopoverModule } from "@progress/kendo-angular-tooltip";
import { IonicModule } from '@ionic/angular';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';

export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    DashboardModule,
    KendoModule,
    IndicatorsModule,
    HttpClientModule,
    NotificationModule,
    LayoutModule,
    CommonFeaturesModule,
    EnquiryDetailsModule,
    ServiceCalendarModule,
    WorksheetModule,
    SalesPartsManagementModule,
    PrlcModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    IconsModule,
    PDFViewerModule,
    PopoverModule,
    IonicModule.forRoot(),
  ],
  providers: [
    LoginService,
    NotificationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    },
    LoaderService,
    AuthGuard,
    DatePipe,
    DecimalPipe,
    SpeechRecognition
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
