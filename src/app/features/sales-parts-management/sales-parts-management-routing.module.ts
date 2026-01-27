import { NgModule } from '@angular/core';
import { AppRoutePaths } from 'src/app/core/Constants';
import { AuthGuard } from 'src/app/auth.guard';
import { RouterModule, Routes } from '@angular/router';

import { SalespartsmgtSupplierListComponent } from './components/salespartsmgt-supplier-list/salespartsmgt-supplier-list.component';
import { SalespartsmgtApprovalComponent } from './components/salespartsmgt-approval/salespartsmgt-approval.component';

const routes: Routes = [
  {
    path: AppRoutePaths.SalesPartsManagementSupplierList,
    canActivate: [AuthGuard],
    component: SalespartsmgtSupplierListComponent,
  },
  {
    path: AppRoutePaths.SalesPartsManagementApproval,
    canActivate: [AuthGuard],
    component: SalespartsmgtApprovalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesPartsManagementRoutingModule { 
  static components = [];
}
