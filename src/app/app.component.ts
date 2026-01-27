import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
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
import { Platform } from '@ionic/angular';
// import { Http  } from '@capacitor-community/http';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ecrm-frontend';
  private isBackHandlerRegistered = false;

  constructor(
    private router: Router,
    private platform: Platform,
    private configService: ConfigService,
    private commonService: CommonService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
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
        await StatusBar.setOverlaysWebView({ overlay: false });
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

    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
      console.log('Push registration success, token: ', token.value);
      this.commonService.DeviceToken = token.value;
      this.commonService.DeviceID = info.identifier;
      this.commonService.Platform = Capacitor.getPlatform();
    });

    PushNotifications.addListener('registrationError', err => {
      console.error('Push registration error: ', err);
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
            sound: 'notification_sound',    
          },
        ],
      });
      this.commonService.updateNotificationData();
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
      console.log('Notification action performed', notification);
      this.commonService.updateNotificationData();
    });
  }

  private async syncOta() {
    try {
      await LiveUpdate.sync();
    } catch (err) {
      console.warn('OTA sync failed:', err);
    }
  }

  private listenToResume() {
    CapacitorApp.addListener('resume', async () => {
      await this.syncOta();
    });
  }
}
