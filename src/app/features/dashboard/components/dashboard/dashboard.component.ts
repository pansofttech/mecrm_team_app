import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutePaths } from 'src/app/core/Constants';
import { bellIcon, menuIcon, SVGIcon } from "@progress/kendo-svg-icons";
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { DrawerItem, DrawerMode, DrawerComponent } from "@progress/kendo-angular-layout";
import { CommonService } from 'src/app/features/common/common.service';
import quickCardsData from '../../data/mock.json';
import { IconName } from '@fortawesome/fontawesome-svg-core';

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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isDrawerOpen = false;
  public menuIcon: SVGIcon = menuIcon;
  public bellIcon: SVGIcon = bellIcon;
  public expandMode: DrawerMode = "overlay";
  selectedMenu: string = 'Dashboard';
  expandedModule: string | null = null;
  uniqueModules: string[] = [];
  quickCardsData: QuickCard[] = [];
  filteredQuickCards: QuickCard[] = [];
  userPrivileges: string[] = [];
  @ViewChild('drawer') drawer!: DrawerComponent;

  public items: Array<DrawerItem> = [
    { separator: true },
    { text: "Notifications", svgIcon: bellIcon},
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private loginService: LoginService,
    public commonService: CommonService
  ) {}

  async ngOnInit(): Promise<void> {
    this.renderer.addClass(this.document.body, 'dashboard-page');

    const contentContainer = document.querySelector('.landing-page-main');
    if (contentContainer) {
      contentContainer.scrollTop = 0;
    }

    // Initialize user privileges
    this.userPrivileges = this.loginService.privileges;

    // Extract quick cards data
    const obs = await this.commonService.getGUIComponents(this.loginService.employeeId as number);
    obs.subscribe((data: any) => {
      this.quickCardsData = data || [];
      // Extract unique modules from all cards (before filtering)
      const modules = new Set<string>();
      this.quickCardsData.forEach((card: QuickCard) => {
        if (card.module) {
          modules.add(card.module);
        }
      });
      this.uniqueModules = Array.from(modules).sort();
      // Filter cards based on privileges for display
      this.filteredQuickCards = this.quickCardsData.filter(card => this.showCards(card));
    });
  }

  getEmployeeName(): string {
    return this.loginService.getEmployeeName();
  }

  getEmployeeInitials(): string {
    return this.getInitials(this.getEmployeeName());
  }

  //Getting initials for login image
  getInitials(name: string): string {
    const initials = name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
    return initials;
  }

  onNotificationClick(){
    this.commonService.updateMenuUsage("Notification").subscribe();
    this.router.navigate([AppRoutePaths.Notification]);
  }

  get unseenCount(): number {
    return this.commonService.notificationData
      ? this.commonService.notificationData.filter(x => !x.actioned).length
      : 0;
  }

  getCardsByModule(module: string): any[] {
    return this.filteredQuickCards.filter((card: any) => card.module === module);
  }

  toggleModule(module: string): void {
    this.expandedModule = this.expandedModule === module ? null : module;
    this.selectedMenu = module;
  }

  selectMenu(menuItem: string): void {
    this.selectedMenu = menuItem;
    this.expandedModule = null;
    // Close drawer after selection
    if (this.drawer && this.drawer.toggle) {
      this.drawer.toggle();
    }
  }

  handleMenuCardClick(card: any): void {
    this.selectedMenu = card.text;
    if (Object.values(AppRoutePaths).includes(card.path)) {
      this.commonService.updateMenuUsage(card.text).subscribe();
      this.router.navigate([card.path]);
      // Close drawer after navigation using ViewChild reference
      if (this.drawer && this.drawer.toggle) {
        this.drawer.toggle();
      }
    }
  }

  // getModuleIcon(module: string): string {
  //   const iconMap: { [key: string]: string } = {
  //     'Enquiry': 'fa-envelope',
  //     'Sales': 'fa-chart-line',
  //     'Funnel Update': 'fa-funnel',
  //     'Worksheet': 'fa-file-alt',
  //     'Service': 'fa-wrench'
  //   };
  //   return iconMap[module] || 'fa-folder';
  // }

  getModuleIcon(module: string): IconName {
      // Assuming all your icons are valid FontAwesome icon names
    const image = this.quickCardsData.find((card: any) => card.module === module)?.image || 'fa-folder';
    return image as unknown as IconName;
  }

  getIconName(image: string): IconName {
    // Assuming all your icons are valid FontAwesome icon names
    return image as unknown as IconName;
  }

  onSignOut(): void {
    // const userConfirmed = confirm('Are you sure you want to sign out?');
    // if (userConfirmed) {
      this.commonService.handleLogout();
    // }
  }

  showCards(cardType: QuickCard): boolean {
    // Check if card type is 'Funnel Update', show it only if the user has the 'prvViewSales' privilege
    if (cardType.text === 'Enquiry') {
      return this.userPrivileges?.includes('prvViewSales') || false;
    }
    else if (cardType.text === 'Funnel Update') {
      return this.userPrivileges?.includes('prvViewSales') || false;
    }
    else if (cardType.text === 'Worksheet') {
      return this.userPrivileges?.includes('prvViewSales') || false;
    }
    else if (cardType.text === 'Service Calls') {
      return this.userPrivileges?.includes('prvSvcFS') || false;
    }
    else if (cardType.text === 'Sales Parts Management') {
      return this.userPrivileges?.includes('prvSalesPartsMgmt') || false;
    }
    else if (cardType.text === 'Parts Requisition Worklist') {
      return this.userPrivileges?.includes('prvViewPR') || false;
    }
    else {
      return true;
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'dashboard-page');
  }
  
}

