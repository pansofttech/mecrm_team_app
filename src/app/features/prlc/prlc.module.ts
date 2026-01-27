import { CUSTOM_ELEMENTS_SCHEMA, NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KendoModule } from 'src/app/kendo.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LoginModule } from '../login/login.module';
import { FormsModule } from '@angular/forms';
import { CommonFeaturesModule } from '../common/common.module';
import { IonicModule } from '@ionic/angular';

import { PartsrequestWorklistComponent } from './components/partsrequest-worklist/partsrequest-worklist.component';
import { PartsrequestApprovalComponent } from './components/partsrequest-approval/partsrequest-approval.component';
import { PartsrequestDetailsComponent } from './components/subcomponents/partsrequest-details/partsrequest-details.component';
import { PartsrequestListComponent } from './components/subcomponents/partsrequest-list/partsrequest-list.component';
import { ApprovalCommentsComponent } from './components/subcomponents/approval-comments/approval-comments.component';
import { PrlcRoutingModule } from './prlc-routing.module';


@NgModule({
  declarations: [
    PartsrequestWorklistComponent,
    PartsrequestApprovalComponent,
    PartsrequestDetailsComponent,
    PartsrequestListComponent,
    ApprovalCommentsComponent
  ],
  imports: [
    CommonModule,
    KendoModule,
    LayoutModule,
    LoginModule,
    FormsModule,
    CommonFeaturesModule,
    PrlcRoutingModule,
    IonicModule    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrlcModule {}
