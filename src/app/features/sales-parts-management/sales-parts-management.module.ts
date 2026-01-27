import { CUSTOM_ELEMENTS_SCHEMA, NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KendoModule } from 'src/app/kendo.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LoginModule } from '../login/login.module';
import { FormsModule } from '@angular/forms';
import { CommonFeaturesModule } from '../common/common.module';
import { IonicModule } from '@ionic/angular';

import { SalespartsmgtWorklistComponent } from './components/salespartsmgt-worklist/salespartsmgt-worklist.component';
import { SalespartsmgtSupplierListComponent } from './components/salespartsmgt-supplier-list/salespartsmgt-supplier-list.component';
import { SalespartsmgtApprovalComponent } from './components/salespartsmgt-approval/salespartsmgt-approval.component';
import { SalesPartsManagementRoutingModule } from './sales-parts-management-routing.module';

@NgModule({
  declarations: [
    SalespartsmgtWorklistComponent,
    SalespartsmgtSupplierListComponent,
    SalespartsmgtApprovalComponent,
  ],
  imports: [
    CommonModule,
    KendoModule,
    LayoutModule,
    LoginModule,
    FormsModule,
    CommonFeaturesModule,
    SalesPartsManagementRoutingModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalesPartsManagementModule { }
