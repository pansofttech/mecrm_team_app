import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { App as CapacitorApp } from '@capacitor/app';
import { LiveUpdate } from '@capawesome/capacitor-live-update';
import { CommonService } from './features/common/common.service';
import {
  PushNotifications,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { ConfigService } from './core/services/config.service';
import { AppRoutePaths } from './core/Constants';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ecrm-frontend';
  private isBackHandlerRegistered = false;
  private notificationInterval: any;
  private pendingNotificationPath: string | null = null;
  private pendingNotificationModule: string | null = null;

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      || target.tagName === 'SELECT' || (target as any).isContentEditable;
    if (!isInput && Capacitor.isNativePlatform()) {
      Keyboard.hide().catch(() => {});
    }
  }

  constructor(
    private router: Router,
    private platform: Platform,
    private configService: ConfigService,
    private commonService: CommonService,
    private zone: NgZone
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
        const isAuthRoute = event.urlAfterRedirects.includes('login') ||
                            event.urlAfterRedirects.includes('forgot-password');
        if (this.pendingNotificationPath && !isAuthRoute) {
          const path = this.pendingNotificationPath;
          const text = this.pendingNotificationModule;
          this.pendingNotificationPath = null;
          this.pendingNotificationModule = null;
          setTimeout(() => {
            this.zone.run(() => {
              if (text) this.commonService.updateMenuUsage(text).subscribe();
              this.router.navigate([`/${path}`]);
            });
          }, 300);
        }
      }
    });  
    // this.enableSSLPinning();
    this.configureStatusBar();
  }

  async ngOnInit(){
    if (!this.isBackHandlerRegistered) {
      CapacitorApp.addListener('backButton', () => {
        const handled = this.commonService.triggerBackCallbackFromMobile();
        if (!handled) CapacitorApp.exitApp();
      });
      this.isBackHandlerRegistered = true;
    }

    this.initializePushNotifications();
    this.commonService.initDB();

    this.notificationInterval = setInterval(() => {
      this.commonService.updateNotificationData();
    }, 3000);

    await this.syncOta();
    this.listenToResume();
  }

  // enableSSLPinning() {
  //   this.platform.ready().then(() => {
  //     if (this.platform.is('android') || this.platform.is('ios')) {
  //       try {
  //         await SSLPinning.configure({
  //           mode: 'production',
  //           hosts: [
  //             {
  //               host: 'your-api-domain.com',
  //               publicKeyHashes: [
  //                 'sha256/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=',
  //                 'sha256/yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy='
  //               ]
  //             }
  //           ]
  //         });

  //         console.log('SSL Pinning configured successfully');

  //       } catch (error) {
  //         console.error('SSL Pinning configuration failed:', error);
  //       } 
  //     }
  //   });
  // }

  async configureStatusBar() {
    if (Capacitor.isNativePlatform()) {
      try {
        const isAndroid = Capacitor.getPlatform() === 'android';
        await StatusBar.setOverlaysWebView({ overlay: isAndroid });
      } catch (error) {
        console.warn('Error configuring status bar:', error);
      }
    }
  }

  async initializePushNotifications() {
    const info = await Device.getId();

    if (Capacitor.getPlatform() === 'web') {
      console.log('Push notifications are not supported on web.');
      return;
    }

    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener('registration', async (token: PushNotificationToken) => {
      let deviceToken = token.value;

      if (Capacitor.getPlatform() === 'ios') {
        const { value: fcmToken } = await Preferences.get({ key: 'FCMToken' });
        if (fcmToken) deviceToken = fcmToken;
      }

      console.log('Push registration success, token: ', deviceToken);
      this.commonService.DeviceToken = deviceToken;
      this.commonService.DeviceID = info.identifier;
      this.commonService.Platform = Capacitor.getPlatform();
    });

    PushNotifications.addListener('registrationError', err => {
      console.error('Push registration error (full): ', JSON.stringify(err));
      this.commonService.DeviceToken = '';
      this.commonService.DeviceID = info.identifier;
    });

    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotification) => {
      console.log('Notification received: ', notification);
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Date.now() / 1000),
            title: notification.data.title,
            body: notification.data.body,
            smallIcon: 'ic_stat_notification',
            sound: Capacitor.getPlatform() === 'ios' ? 'notification_sound.wav' : 'notification_sound',
            extra: {
              notificationPath: notification.data.notificationPath,
              notificationModule: notification.data.notificationModule,
              notificationId: notification.data.notificationId,
            }
          },
        ],
      });
      this.commonService.updateNotificationData();
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (action: any) => {
      const extra = action.notification.extra;
      const path = extra?.notificationPath;
      const text = extra?.notificationModule;
      const notificationId = extra?.notificationId;
      console.log('Local notification tapped, path:', path);

      if (notificationId && this.commonService.notificationData?.length) {
        this.commonService.notificationData = this.commonService.notificationData.map((item: any) =>
          item.notificationId === notificationId ? { ...item, actioned: true } : item
        );
        this.commonService.updPushNotificationTracker().subscribe();
      }

      if (path) {
        this.zone.run(() => {
          if (text) this.commonService.updateMenuUsage(text).subscribe();
          this.router.navigate([`/${path}`]);
        });
      }
      this.commonService.updateNotificationData();
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
        console.log('Notification clicked:', notification);

        const data = notification.notification.data;
        const path = data?.notificationPath;
        const text = data?.notificationModule;
        const notificationId = data?.notificationId;

        if (notificationId && this.commonService.notificationData?.length) {
          this.commonService.notificationData = this.commonService.notificationData.map((item: any) =>
            item.notificationId === notificationId ? { ...item, actioned: true } : item
          );
          this.commonService.updPushNotificationTracker().subscribe();
        }

        if (path) {
          console.log('Navigating to path:', path);
          this.pendingNotificationPath = path;
          this.pendingNotificationModule = text;
          if (this.router.navigated) {
            // App was already running — navigate immediately
            this.pendingNotificationPath = null;
            this.pendingNotificationModule = null;
            this.zone.run(() => {
              if (text) this.commonService.updateMenuUsage(text).subscribe();
              this.router.navigate([`/${path}`]);
            });
          }
          // else: cold start — NavigationEnd subscriber will fire after auth and handle it
        } else {
          this.zone.run(() => {
            this.router.navigate(['/dashboard']);
          });
        }

        this.commonService.updateNotificationData();
      }
    );
  }

  private async syncOta() {
    try {
      const result = await LiveUpdate.getCurrentBundle();
      console.log('Current Bundle Details:', result); 

      console.log('Initiating sync for channel:', environment.capChannel);
      await LiveUpdate.sync({
        channel: environment.capChannel
      });
      console.log('Sync process initiated successfully');
    } catch (err) {
      console.warn('OTA sync failed:', err);
    }
  }

  private async checkAppVersion() {
    try {
      const obs = await this.commonService.checkVersion();
      obs.subscribe((res: any) => {
        console.log('Checking app version with body:', res);
        if (res.forceUpdate) {
          // Navigate to force update component with store URL as query parameter
          this.router.navigate([`/${AppRoutePaths.ForceUpdate}`], { state: { storeUrl: res.storeUrl }});
        }
        else {
          // Only navigate to Dashboard if not already authenticated on a page
          // Check if user is logged in and not on login page
          const currentUrl = this.router.url;
          const isOnLoginPage = currentUrl.includes(AppRoutePaths.Login);
          
          if (isOnLoginPage) {
            this.router.navigate([`/${AppRoutePaths.Dashboard}`]);
          }
          // If already on a protected route, don't navigate away
        }
      });
    } catch (error) {
      console.warn('Version check failed:', error);
    }
  }

  private listenToResume() {
    CapacitorApp.addListener('resume', async () => {
      await this.syncOta();
      await this.checkAppVersion();
    });

    this.checkAppVersion();
  }
}
