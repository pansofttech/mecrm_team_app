import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http.service';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from '../login/components/login/login.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Preferences } from '@capacitor/preferences';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Network } from '@capacitor/network';
import { lastValueFrom } from 'rxjs';
import { guid } from '@progress/kendo-angular-common';

export interface AttachmentFileInfo
{
  name: string,
  size: number | null,
  docSrcVal: string,
  docSrcType: number,
  docSrcGUID: string
}

export interface AttachmentPopupDetails
{
  docSrcVal: string,
  docSrcType: number,
  docSrcGUID: string,
  touchEvent: MouseEvent | TouchEvent | null
}

export interface AlertDetails
{
  url: string,
  data: any,
  notification: string,
  icon: string
}

export interface NotificationDetails
{
  notificationId: string,
  notificationTitle: string,
  notificationBody: string,
  notificationModule: string,
  actioned: boolean,
}

@Injectable({
  providedIn: 'root'
})

//Common service for API calls which should is accessible through all components
export class CommonService implements OnDestroy{
  private attachmentDetailsUrl = `${this.configService.apiUrl}/api/UploadDownload/GetAttachmentDetails`;
  private downloadAttachmentUrl = `${this.configService.apiUrl}/api/UploadDownload/DownloadAttachment`;
  private updateMenuUsageUrl = `${this.configService.apiUrl}/api/Common/UpdateMenuUsage`;
  private updatePushNotificationRegistryUrl = `${this.configService.apiUrl}/api/Common/UpdatePushNotificationRegistry`;
  private updatePushNotificationTrackerUrl = `${this.configService.apiUrl}/api/Common/UpdatePushNotificationTracker`;
  private postPushNotificationToDeviceUrl = `${this.configService.apiUrl}/api/Common/PushNotificationToDevice`;
  private GetNotActionedNotificationUrl = `${this.configService.apiUrl}/api/Common/GetNotActionedNotification`;
  public postGenerateCSRUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GenerateCSRPath`;
  private getCSRDownloadFileUrl = `${this.configService.apiUrl}/api/UploadDownload/GetCSRDownloadFile`;
  private postUploadCSRUrl = `${this.configService.apiUrl}/api/ServiceCalendar/UploadCSR`;

  docSrcTypeSuppAttachment: number = 58;
  docSrcTypeAttachment: number = 22;
  docSrcTypeWSAttachment: number = 658;
  docSrcTypeCSRAttachment: number = 11;
  docIBStickerAttachment: number = 708;
  CSRUploadSrcType: number = 11;

  public currentUrl: string | null = null;
  public navigationMap: Map<string, string> = new Map();
  private backNavigationCallback?: () => void;

  //Notification Variables
  public DeviceToken: string | null = null;
  public DeviceID: string | null = null;
  public Platform: string | null = null;
  public AppVersion: string = '1.0.0';

  //SQlLite
  private sqlite: SQLiteConnection;
  public db?: SQLiteDBConnection;

  //Offline Sync
  private syncInterval: any;
  public alertData: AlertDetails[] = [
    // {
    //   url: "Test",
    //   data: "",
    //   notification: "Test Alert",
    //   icon: "wrench"
    // },
    // {
    //   url: "Test",
    //   data: "",
    //   notification: "Test  2",
    //   icon: "line-chart"
    // },
  ];

  public notificationData: NotificationDetails[] = [
    // {
    //   notificationId: "id-1",
    //   notificationTitle: "CSR Updated",
    //   notificationBody: "CSR has been successfully updated for SRID 163589",
    //   notificationModule: "wrench",
    //   actioned: false
    // },
    // {
    //   notificationId: "id-2",
    //   notificationTitle: "CSR Updated",
    //   notificationBody: "CSR has been successfully updated for SRID 163590",
    //   notificationModule: "line-chart",
    //   actioned: false
    // }
  ]

  constructor(
    private http: HttpService,
    private router: Router,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private notificationService: NotificationService,
    private loginService: LoginService,
    private configService: ConfigService,
    private speechRecognition: SpeechRecognition,
    private platform: Platform
  ) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  ngOnDestroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }

  displayNumberFormat(value: number | null | undefined) {
    return value != null? this.decimalPipe.transform(value, '1.0-0', 'en-US') : '';
  }

  displayDecimalFormat(value: number | null | undefined) {
    return value != null? this.decimalPipe.transform(value, '1.2-2', 'en-US') : '';
  }

  displayDateFormat(value: Date | string | null) {
    return value ? this.datePipe.transform(value, 'dd-MMM-yyyy') : '';
  }

  convertDateStringToDate(dateString: string | null): Date | null {
    if(dateString){
    return new Date(dateString);
    }
    else{
      return null;
    }
  }

  //API Call to fetch the attachment details
  getAttachmentDetails(enqID: string, docSrcType: number, docSrcGUID: string) {
    const body = {
      docSrcVal: enqID.toString(),
      docSrcType: docSrcType,
      docSrcGUID: docSrcGUID
    };
    return this.http.post(this.attachmentDetailsUrl, body);
  } 

  //API Call to download the attachment
  getAttachment(enqID: string, docSrcType: number, attachmentGUID: string, index: number) {
    const body = {
      docSrcVal: enqID.toString(),
      docSrcType: docSrcType,
      docSrcGUID: attachmentGUID,
      index: index
    };
    return this.http.post(this.downloadAttachmentUrl, body, {responseType: 'blob', observe: 'response'});
  }

  handleNavigationEvents(routerEvents: any, backNavigationCallback?: () => void): Subscription | undefined{
    if (!this.loginService.employeeId) {
      this.router.navigate([AppRoutePaths.Default]);
      return;
    }
    this.backNavigationCallback = backNavigationCallback;
    return routerEvents
      .pipe(
          filter(event => event instanceof NavigationStart)
      )
      .subscribe((event: NavigationStart) => {
          if (this.currentUrl) {
            const isBackwardNavigation = this.navigationMap.has(event.url) && 
                                         this.navigationMap.get(event.url) === this.currentUrl;
            if(!isBackwardNavigation){
              this.navigationMap.set(this.currentUrl, event.url);
            }
          }
          const isBackNavigation = this.navigationMap.has(event.url) && 
          this.navigationMap.get(event.url) === this.currentUrl &&  event.navigationTrigger === 'popstate';

          this.currentUrl = event.url;       
          
          if (isBackNavigation && backNavigationCallback) {
            backNavigationCallback();
          }
        });
  }

  triggerBackCallbackFromMobile(): boolean {
    if (this.backNavigationCallback) {
      this.backNavigationCallback();
      return true;
    }
    return false;
  }

  async handleLogout() {
    this.loginService.logoutUser().subscribe((data: any) => {
      if (data) {
        const notificationMessage = data.outPut;
        const notificationType = data.outPut.indexOf('success') !== -1 ? 'success' : 'error';
        this.notificationService.showNotification(
          notificationMessage,
          notificationType,
          'center',
          'bottom'
        );
      }
    },        
    error => {
      this.notificationService.showNotification(
        'Error logging out' + error,
        'error', 'center', 'bottom'
      );
    });
    this.loginService.employeeId = '';
    this.navigationMap.clear();
    //Handling preferences
    const { value } = await Preferences.get({ key: 'userData' });
    if (value) {
      const userData = JSON.parse(value);  
      userData.loggedIn = false;
      await Preferences.set({
        key: 'userData',
        value: JSON.stringify(userData),
      });
    }
    this.router.navigate([AppRoutePaths.Login]);
  }

  getIPAddress(){  
    return this.http.get("http://api.ipify.org/?format=json");  
  }

  updateMenuUsage(MenuName: string){
    const body = {
      'empId': this.loginService.employeeId as number,
      'screenName': MenuName
    }
    return this.http.post(this.updateMenuUsageUrl, body);
  }

  //speech to text
  async startListening(): Promise<string> {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      await this.speechRecognition.requestPermission();
      return new Promise((resolve) => {
        this.speechRecognition.startListening()
          .subscribe(matches => {
            resolve(matches && matches.length ? matches[0] : '');
          });
      });
    } else {
      return '';
    }
  }

  async startListeningAndPatch(form: FormGroup, fieldName: string) {
    const speechContent = await this.startListening();

    if (form.contains(fieldName)) {
      const currentValue = form.get(fieldName)?.value || '';
      const newValue = currentValue
        ? currentValue + '\n' + speechContent
        : speechContent;

      form.patchValue({ [fieldName]: newValue });
    } else {
      console.warn(`Field "${fieldName}" does not exist in the form`);
    }
  }

  //Get Geo-Coordinates
  async getCurrentLocation(): Promise<[number, number]> {
    try {
      const perm = await Geolocation.checkPermissions();
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      return [coordinates.coords.latitude, coordinates.coords.longitude];
    } catch (error) {
      //Check with soumya mam: If Location Services is off shd return 0,0 or error
      return [0, 0];
    }
  }

  getAddress(lat: number, lng: number): Promise<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    return lastValueFrom(this.http.get(url));
  }

  updPushNotificationRegistry() {
    const body = {
      "DeviceToken": this.DeviceToken? this.DeviceToken: '',
      "DeviceID": this.DeviceID? this.DeviceID: '',
      "AppVersion": this.AppVersion? this.AppVersion: '',
      "Platform": this.Platform? this.Platform: '',
      "LoginID": this.loginService.employeeId? this.loginService.employeeId as number: 0
    };
    return this.http.post(this.updatePushNotificationRegistryUrl, body);
  }

  updPushNotificationTracker() {
    const notificationList = this.notificationData.map(item => ({
      ...item,                               
      DeviceToken: this.DeviceToken || 'Test',   
      DeviceID: this.DeviceID || 'Test',         
      Received: true,                      
      Actioned: true,
      LoginID: this.loginService.employeeId as number?? 0
    }));

    // const body = {
    //   "notificationList": notificationList || [],
    //   "LoginID": this.loginService.employeeId? this.loginService.employeeId as number: 0
    // };
    return this.http.post(this.updatePushNotificationTrackerUrl, notificationList);
  }

  getNotActionedNotification() {
    return this.http.post(this.GetNotActionedNotificationUrl, this.loginService.employeeId as number);
  }

  updateNotificationData() {
    this.getNotActionedNotification().subscribe((data: any) => {
        this.notificationData = data;
      },
      error => {
        console.log('Error pulling notification', error);
      }
    );
  }

  postPushNotificationToDevice(NotificationTitle: string, NotificationBody: string, NotificationIcon: string){
    const body = {
      "DeviceToken": this.DeviceToken? this.DeviceToken: '',
      "DeviceID": this.DeviceID? this.DeviceID: '',
      "LoginID": this.loginService.employeeId? this.loginService.employeeId as number: 0,
      "NotificationTitle": NotificationTitle? NotificationTitle: '',
      "NotificationBody": NotificationBody? NotificationBody: '',
      "NotificationModule": NotificationIcon? NotificationIcon: 'ic_stat_notification'
    };
    return this.http.post(this.postPushNotificationToDeviceUrl, body);
  }

  // generateKey(length: number = 64) {
  //   const array = new Uint8Array(length);
  //   crypto.getRandomValues(array);
  //   return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  // }

  async initDB() {

    // const { value } = await Preferences.get({ key: 'db_key' });
    // let dbKey = value;
    // if (!dbKey) {
    //   dbKey = this.generateKey();
    //   await Preferences.set({ key: 'db_key', value: dbKey });
    // }
    this.db = await this.sqlite.createConnection("offlineDB", false, 'no-encryption', 1, false );
    await this.db.open();
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS SyncQueue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        data TEXT,
        notification TEXT,
        icon TEXT,
        timestamp TEXT,
        synced BOOL
      )
    `);
  }

  async saveOffline(url: string, data: any, notification: string, icon:string) {
    const timestamp = new Date().toISOString();
    console.log(`URL: ${url} DATA: ${data}`);
    await this.db?.run(
      "INSERT INTO SyncQueue (url, data, notification, icon, timestamp, synced) VALUES (?, ?, ?, ?, ?, ?)",
      [url, JSON.stringify(data), notification, icon, timestamp, 0]
    );
  }

  async isOnline(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  async getAlertData(){
    try {
      const query = "SELECT url, data, notification, icon FROM SyncQueue WHERE synced = 0 ORDER BY id ASC";
      const result = await this.db?.query(query);

      this.alertData = result?.values?.map((row: any) => ({
        url: row.url,
        data: JSON.parse(row.data),
        notification: row.notification,
        icon: row.icon
      })) || [];
      console.log("Alert data:", this.alertData);
    } catch (error) {
      console.error("Error fetching notification data:", error);
    }
  }

  async syncData() {
    try {
      await this.getAlertData();
      for (const record of this.alertData) {
        const { url, data } = record;
        if (typeof (this as any)[url] === "function") {
          console.log(`Syncing via function: ${url}`, data);
          try {
            await (this as any)[url](data);
            await this.db?.run(
              `UPDATE SyncQueue SET synced = 1 WHERE url = ? AND data = ?`,
              [url, JSON.stringify(data)]
            );
          } catch (err) {
            console.error(`Error while syncing ${url}:`, err);
          }
        } else {
          console.warn(`No function found for url: ${url}`);
        }
      }
    } catch (error) {
      console.error("Error in syncData:", error);
    }
  }

  //API call to generate new CSR file after signature
  getCSRfile(SRID: number, CSRSummary: string, CallCategory: string, IsCallCompleted: boolean, CustomerSign: string, EngineerSign: string) {
    const body = {
      "SRID": SRID,
      "LoginID": this.loginService.employeeId,
      "CSRSummary": CSRSummary,
      "CallCategory": CallCategory,
      "IsCallCompleted": IsCallCompleted,
      "CustomerSign": CustomerSign ? CustomerSign : null,
      "EngineerSign": EngineerSign ? EngineerSign : null
    };
    return this.http.post(this.postGenerateCSRUrl, body);
  }

  getCSRPdf(FilePath: string) {
    const body = {
      "FilePath": FilePath
    };
    return this.http.post(this.getCSRDownloadFileUrl, body, { responseType: 'arraybuffer', observe: 'response' });
  }

  //API call to upload CSR file
  putUploadCSR(docSrcVal: string, attachment: any) {
    const body = new FormData();
    body.append('docSrcVal', docSrcVal);
    body.append('docSrcType', this.CSRUploadSrcType as any);
    body.append('LoginID', this.loginService.employeeId as string);
    body.append('attachment', attachment ? attachment : null);

    return this.http.put(this.postUploadCSRUrl, body);
  }

  public async postCSRSaveSync(body: any) {
    this.getCSRfile(
          body.SRID,
          body.CSRSummary,
          body.CallCategory,
          body.IsCallCompleted,
          body.CustomerSign,
          body.EngineerSign
    ).subscribe((data: any) => {
          this.getCSRPdf(data.outPut).subscribe((response) => {
              const contentType = response.headers.get('content-type')!;
              const blob = new Blob([response.body!], { type: contentType });
              const file = new File([blob], data.outPut, { type: contentType });
              this.putUploadCSR(body.SRID as any, file).subscribe((uploadResponse: any) => {
                const notificationMessage = uploadResponse.statusCode === 200 ? 'CSR Updated Successfully' : 'Error in Updating CSR';
                this.notificationService.showNotification(
                    notificationMessage,
                    'success', 'center', 'bottom'
                );
                if(notificationMessage === 'CSR Updated Successfully'){
                  this.postPushNotificationToDevice('CSR Updated Successfully', 'CSR Updated for SRID ' + body.SRID, 'wrench').subscribe();
                }
                this.getAlertData();
              },
              error => {
                this.notificationService.showNotification(
                  'CSR not updated'+ error,
                  'error', 'center', 'bottom'
                );
              });
          });
    });
  }

  public convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result?.toString().split(',')[1]);
      reader.readAsDataURL(blob);
    });
  }
}

