import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})

export class NotificationComponent implements OnInit, OnDestroy{
  private popstateSubscription?: Subscription;
  public showAPILoader = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private loginService: LoginService,
    public commonService: CommonService
  ){}

  ngOnInit(){
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.commonService.updateNotificationData();
  }
  
  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  onBackClickHandle() {
    this.commonService.notificationData = this.commonService.notificationData.map(item => ({
      ...item,
      actioned: true
    }));    
    this.commonService.updPushNotificationTracker().subscribe();
    this.router.navigate([AppRoutePaths.Dashboard]);
  }

  onNotificationClick(notificationId: string) {
    this.commonService.notificationData = this.commonService.notificationData.map(item =>
      item.notificationId === notificationId
        ? { ...item, actioned: true }
        : item
    );
  }

}
