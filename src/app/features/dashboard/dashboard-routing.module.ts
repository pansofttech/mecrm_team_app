import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppRoutePaths } from 'src/app/core/Constants';
import { EnquiryDetailsComponent } from '../enquiry-details/components/enquiry-details/enquiry-details.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutePaths.Dashboard,
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'enquiry-details',
    component: EnquiryDetailsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {
  static components = [];
}
