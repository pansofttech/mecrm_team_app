import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import moduleCards from '../../data/mock.json';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { CommonService } from 'src/app/features/common/common.service';

type moduleCards = {
  image: string;
  text: string;
};

type QuickCard = {
  image: string;
  text: string;
  path: string;
  color: string;
  innerColor: string;
  module: string;
  description: string;
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
    public commonService: CommonService
  ) {}

  @Input() cards: QuickCard[] = [];
  moduleCards!: moduleCards[];
  showAll: boolean = false;
  private popstateSubscription?: Subscription;

  ngOnInit(): void {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events);
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

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  getDisplayedCards(): QuickCard[] {
    return this.showAll ? this.cards : this.cards.slice(0, 4);
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
