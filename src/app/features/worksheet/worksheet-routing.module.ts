import { NgModule } from '@angular/core';
import { AppRoutePaths } from 'src/app/core/Constants';
import { AuthGuard } from 'src/app/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { WorksheetApprovalComponent } from './components/worksheet-approval/worksheet-approval.component';

const routes: Routes = [
  {
    path: AppRoutePaths.WorksheetApproval,
    canActivate: [AuthGuard],
    component: WorksheetApprovalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorksheetRoutingModule { 
  static components = [];
}
