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

export class NotificationComponent implements OnInit, OnDestroy {
  private popstateSubscription?: Subscription;
  public showAPILoader = false;
  public activeTab: 'all' | 'unread' | 'read' = 'all';
  public swipedId: number | null = null;

  private touchStartX = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private loginService: LoginService,
    public commonService: CommonService
  ) {}

  ngOnInit() {
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

  get allCount(): number {
    return this.commonService.notificationData.length;
  }

  get unreadCount(): number {
    return this.commonService.notificationData.filter(n => !n.actioned).length;
  }

  get readCount(): number {
    return this.commonService.notificationData.filter(n => n.actioned).length;
  }

  get filteredNotifications() {
    if (this.activeTab === 'unread') {
      return this.commonService.notificationData.filter(n => !n.actioned);
    }
    if (this.activeTab === 'read') {
      return this.commonService.notificationData.filter(n => n.actioned);
    }
    return this.commonService.notificationData;
  }

  onTabChange(tab: 'all' | 'unread' | 'read') {
    this.activeTab = tab;
    this.swipedId = null;
  }

  onBackClickHandle() {
    this.router.navigate([AppRoutePaths.Dashboard]);
  }

  onNotificationClick(notificationId: number) {
    if (this.swipedId === notificationId) {
      this.swipedId = null;
      return;
    }
    const clicked = this.commonService.notificationData.find(item => item.notificationId === notificationId);
    this.commonService.notificationData = this.commonService.notificationData.map(item =>
      item.notificationId === notificationId ? { ...item, actioned: true } : item
    );
    this.commonService.updPushNotificationTracker().subscribe();
    if (clicked?.notificationPath) {
      this.router.navigate([clicked.notificationPath]);
    }
  }

  onMarkRead(notificationId: number) {
    this.commonService.notificationData = this.commonService.notificationData.map(item =>
      item.notificationId === notificationId ? { ...item, actioned: true } : item
    );
    this.commonService.updPushNotificationTracker().subscribe();
    this.swipedId = null;
  }

  onTouchStart(event: TouchEvent, notificationId: number) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent, notificationId: number) {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    if (deltaX > 60) {
      // swipe right
      this.swipedId = this.swipedId === notificationId ? null : notificationId;
    } else if (deltaX < -20) {
      // swipe left — close
      if (this.swipedId === notificationId) {
        this.swipedId = null;
      }
    }
  }
}
