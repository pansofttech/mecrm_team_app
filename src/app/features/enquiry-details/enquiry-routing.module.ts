import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutePaths } from 'src/app/core/Constants';
import { EnquiryDetailsComponent } from './components/enquiry-details/enquiry-details.component';
import { EnquiryDetailsListViewComponent } from './components/enquiry-details-list-view/enquiry-details-list-view.component';
import { AuthGuard } from 'src/app/auth.guard';
import { EnquiryDetailsHistoryComponent } from './components/enquiry-details-history/enquiry-details-history.component';
import { EnquiryDetailsUpdateComponent } from './components/enquiry-details-update/enquiry-details-update.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: EnquiryDetailsComponent,
  },
  {
    path: AppRoutePaths.EnquiryDetails,
    canActivate: [AuthGuard],
    component: EnquiryDetailsComponent,
  },
  {
    path: AppRoutePaths.EnquiryDetailsListView,
    canActivate: [AuthGuard],
    component: EnquiryDetailsListViewComponent,
  },
  {
    path: AppRoutePaths.EnquiryDetailsUpdate,
    canActivate: [AuthGuard],
    component: EnquiryDetailsUpdateComponent,
  },
  {
    path:AppRoutePaths.EnquiryDetailsHistory,
    component:EnquiryDetailsHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class enquirydetailsRoutingModule {
  static components = [];
}
