import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SrlcComponent } from './components/srlc/srlc.component';
import { CsrGeneratorComponent } from './components/csr-generator/csr-generator.component';
import { AppRoutePaths } from 'src/app/core/Constants';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: AppRoutePaths.ServiceCalendar,
    component: CalendarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutePaths.SRLC,
    component: SrlcComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutePaths.ServiceCSRGenerator,
    component: CsrGeneratorComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ServiceCalendarRoutingModule { 
  static components = [];
}
