import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import quickCards from '../../data/mock.json';
import moduleCards from '../../data/mock.json';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { CommonService } from 'src/app/features/common/common.service';

type quickCards = {
  image: string;
  text: string;
  path: string;
};

type moduleCards = {
  image: string;
  text: string;
};
@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.scss'],
})
export class DashboardCardsComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private commonService: CommonService
  ) {}

  cards!: quickCards[];
  moduleCards!: moduleCards[];
  userPrivileges: string[] = [];
  private popstateSubscription?: Subscription;

  ngOnInit(): void {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events);
    this.cards = [quickCards.quickCards][0];
    this.userPrivileges = this.loginService.privileges;
    this.moduleCards = [moduleCards.moduleCards][0];
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  setColor(text: string) {
    switch (true) {
      case text === 'Sales':
        return '#daf0ef';
        break;
      case text === 'Enquiry':
        return '#cbd4f5';
        break;
      case text === 'Update':
        return '#d5d8db';
        break;
    }
    return '#F2F2F2';
  }

  getColor(text: string) {
    switch (true) {
      case text === 'My Calendar':
        return '#605CA3';
        break;
      case text === 'Trackers':
        return '#4BA560';
        break;
      case text === 'My Tasks':
        return '#CC5642';
        break;
      case text === 'Telephone':
        return '#B9305B';
        break;
    }
    return '#F2F2F2';
  }

  handleCardNavigate(cardData: any) {
    if (Object.values(AppRoutePaths).includes(cardData.path)) {
      this.commonService.updateMenuUsage(cardData.text).subscribe();
      this.router.navigate([cardData.path]);
    }
  }

  showCards(cardType: any): boolean {
    // If the card type is 'Funnel Update', show it only if the user has the 'prvViewSales' privilege.
    if(cardType.text === 'Enquiry'){
      return !(
        !this.userPrivileges?.includes('prvViewSales')
      );
    }
    else if(cardType.text === 'Funnel Update'){
      return !(
        !this.userPrivileges?.includes('prvViewSales')
      );
    }
    else if(cardType.text === 'Worksheet'){
      return !(
        !this.userPrivileges?.includes('prvViewSales')
      );
    }
    else if(cardType.text === 'Service Calls'){
      return !(
        !this.userPrivileges?.includes('prvSvcFS')
      );
    }
    else if(cardType.text === 'Sales Parts Management'){
      return !(
        !this.userPrivileges?.includes('prvSalesPartsMgmt')
      );
    }
    else if(cardType.text === 'Parts Requisition Worklist'){
      return !(
        !this.userPrivileges?.includes('prvViewPR')
      );
    }
    else{
      return true;
    }
  }

  getEmployeeName(): string {
    return this.loginService.getEmployeeName();
  }

  getEmployeeFirstName(): string {
    const EmpFullName = this.getEmployeeName();
    const FirstName = EmpFullName.slice(0, EmpFullName.indexOf(' '));
    return FirstName as string;
  }

  getIconName(image: string): IconName {
    // Assuming all your icons are valid FontAwesome icon names
    return image as unknown as IconName;
  }

  // onBackClickHandle() {
  //   const userConfirmed = confirm('Do you really wanna leave this page? You will be logged out.');
  //   if (userConfirmed) {
  //     this.commonService.handleLogout();
  //   }
  // }
}
