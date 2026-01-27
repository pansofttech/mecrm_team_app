import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KendoModule } from 'src/app/kendo.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LoginModule } from '../login/login.module';
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { ServiceCalendarRoutingModule } from './service-calendar-routing.module';
import { CommonFeaturesModule } from '../common/common.module';
import { IonicModule } from '@ionic/angular';

import { ServiceEffortsComponent } from './components/service-efforts/service-efforts.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EffortsListViewComponent } from './components/efforts-list-view/efforts-list-view.component';
import { PDFViewerModule } from '@progress/kendo-angular-pdfviewer';
import { CsrGeneratorComponent } from './components/csr-generator/csr-generator.component';
import { PartsRequestComponent } from './components/parts-request/parts-request.component';
import { ServiceRequestComponent } from './components/service-request/service-request.component';
import { SrlcComponent } from './components/srlc/srlc.component';
import { CallActionComponent } from './components/call-action/call-action.component';
import { CallCompletionComponent } from './components/call-completion/call-completion.component';
import { CallHoldComponent } from './components/call-hold/call-hold.component';
import { CallFieldVisitComponent } from './components/call-field-visit/call-field-visit.component';
import { CallContinueComponent } from './components/call-continue/call-continue.component';
import { CompletionDetailsComponent } from './components/sub-components/completion-details/completion-details.component';
import { InstallationDetailsComponent } from './components/sub-components/installation-details/installation-details.component';
import { SystematizationDetailsComponent } from './components/sub-components/systematization-details/systematization-details.component';
import { ModuleDetailsComponent } from './components/sub-components/module-details/module-details.component';
import { ModuleDetailsEditComponent } from './components/sub-components/module-details-edit/module-details-edit.component';
import { OtherTasksComponent } from "./components/sub-components/other-tasks/other-tasks.component";
import { OtherTasksEditComponent } from './components/sub-components/other-tasks-edit/other-tasks-edit.component';
import { CustomerDelayComponent } from './components/sub-components/customer-delay/customer-delay.component';
import { OtherReasonsComponent } from './components/sub-components/other-reasons/other-reasons.component';
import { PartsRequiredComponent } from './components/sub-components/parts-required/parts-required.component';
import { PoRequiredComponent } from './components/sub-components/po-required/po-required.component';
import { ServiceSurveyComponent } from './components/sub-components/service-survey/service-survey.component';
import { ConfirmInstallbaseComponent } from './components/sub-components/confirm-installbase/confirm-installbase.component';
import { InstallbaseModulesSalesconfigComponent } from './components/sub-components/installbase-modules-salesconfig/installbase-modules-salesconfig.component';
import { PartsSearchComponent } from '../common/components/parts-search/parts-search.component';

@NgModule({
  declarations: [
    CalendarComponent,
    ServiceEffortsComponent,
    EffortsListViewComponent,
    CsrGeneratorComponent,
    PartsRequestComponent,
    ServiceRequestComponent,
    SrlcComponent,
    CallActionComponent,
    CallCompletionComponent,
    CallHoldComponent,
    CallFieldVisitComponent,
    CallContinueComponent,
    CompletionDetailsComponent,
    InstallationDetailsComponent,
    SystematizationDetailsComponent,
    ModuleDetailsComponent,
    ModuleDetailsEditComponent,
    OtherTasksComponent,
    OtherTasksEditComponent,
    CustomerDelayComponent,
    OtherReasonsComponent,
    PartsRequiredComponent,
    PoRequiredComponent,
    ServiceSurveyComponent,
    ConfirmInstallbaseComponent,
    InstallbaseModulesSalesconfigComponent,
    PartsSearchComponent
  ],
  imports: [
    CommonModule,
    KendoModule,
    LayoutModule,
    LoginModule,
    DateInputsModule,
    PDFViewerModule,
    ServiceCalendarRoutingModule,
    CommonFeaturesModule,
    IonicModule,
  ],
  exports: [
    CalendarComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ServiceCalendarModule { }
