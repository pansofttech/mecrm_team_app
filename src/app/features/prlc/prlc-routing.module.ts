import { NgModule } from '@angular/core';
import { AppRoutePaths } from 'src/app/core/Constants';
import { AuthGuard } from 'src/app/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { PartsrequestWorklistComponent } from './components/partsrequest-worklist/partsrequest-worklist.component';
import { PartsrequestApprovalComponent } from './components/partsrequest-approval/partsrequest-approval.component';

const routes: Routes = [
  {
    path: AppRoutePaths.PartsRequestWorkList,
    canActivate: [AuthGuard],
    component: PartsrequestWorklistComponent,
  },
  {
    path: AppRoutePaths.PartsRequestApproval,
    canActivate: [AuthGuard],
    component: PartsrequestApprovalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PrlcRoutingModule {}
