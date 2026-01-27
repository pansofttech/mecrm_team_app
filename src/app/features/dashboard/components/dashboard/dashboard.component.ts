import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutePaths } from 'src/app/core/Constants';
import { bellIcon, menuIcon, SVGIcon } from "@progress/kendo-svg-icons";
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { DrawerItem, DrawerMode } from "@progress/kendo-angular-layout";
import { CommonService } from 'src/app/features/common/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  isDrawerOpen = false;
  public menuIcon: SVGIcon = menuIcon;
  public bellIcon: SVGIcon = bellIcon;
  public expandMode: DrawerMode = "overlay";

  public items: Array<DrawerItem> = [
    { separator: true },
    { text: "Notifications", svgIcon: bellIcon},
  ];

  constructor(
    private router: Router,
    private loginService: LoginService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    const contentContainer = document.querySelector('.landing-page-main');
    if (contentContainer) {
      contentContainer.scrollTop = 0;
    }
  }

  getEmployeeName(): string {
    return this.loginService.getEmployeeName();
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
  
}

