import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardsComponent } from './components/dashboard-cards/dashboard-cards.component';
import { DashboardListComponent } from './components/dashboard-list/dashboard-list.component';
import { KendoModule } from 'src/app/kendo.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IconsModule } from '@progress/kendo-angular-icons';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LoginModule } from '../login/login.module';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faBullhorn, faLineChart,faWrench,faTruck,faMoneyBill } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    DashboardCardsComponent,
    DashboardListComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    KendoModule,
    IconsModule,
    NavigationModule,
    ButtonsModule,
    LoginModule,
    FontAwesomeModule,
  ],
  exports: [DashboardCardsComponent, DashboardListComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBullhorn, faLineChart,faWrench,faTruck,faMoneyBill);
  }
}
