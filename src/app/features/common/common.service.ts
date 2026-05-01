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
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Network } from '@capacitor/network';
import { lastValueFrom } from 'rxjs';
import { guid } from '@progress/kendo-angular-common';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

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
  notificationId: number,
  notificationTitle: string,
  notificationBody: string,
  notificationIcon: string | null,
  iconColor: string | null,
  iconInnerColor: string | null,
  notificationModule: string,
  notificationPath: string | null,
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
  private GetAllNotificationUrl = `${this.configService.apiUrl}/api/Common/GetAllNotification`;
  public postGenerateCSRUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GenerateCSRPath`;
  private getCSRDownloadFileUrl = `${this.configService.apiUrl}/api/UploadDownload/GetCSRDownloadFile`;
  private postUploadCSRUrl = `${this.configService.apiUrl}/api/ServiceCalendar/UploadCSR`;
  private postCheckAppVersionUrl = `${this.configService.apiUrl}/api/Login/CheckVersion`;
  private postGUIComponentsUrl = `${this.configService.apiUrl}/api/Common/GetMblGUIComponents`;

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
    //   notificationId: 1,
    //   notificationTitle: "Path Test Notification",
    //   notificationBody: "Funnel Update is required for Enquiry 163589",
    //   notificationModule: "Sales",
    //   notificationIcon: "line-chart",
    //   iconColor: "var(--primary-icon-outer)",
    //   iconInnerColor: "var(--primary-icon)",
    //   notificationPath: "enquiry-listview",
    //   actioned: false
    // },
    // {
    //   notificationId: 2,
    //   notificationTitle: "Path Test Notification",
    //   notificationBody: "Worksheet Approval is required for Enquiry 163589",
    //   notificationModule: "Sales",
    //   notificationIcon: "list-check",
    //   iconColor: "var(--secondary-icon-outer)",
    //   iconInnerColor: "var(--secondary-icon)",
    //   notificationPath: "worksheet-details",
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
  // ── Speech recognition state ─────────────────────────────────────────────────
  // Sentinel returned when a second tap cancels an in-progress session
  private readonly SPEECH_STOPPED = '__speech_stopped__';
  private _isSpeechListening = false;
  // ─────────────────────────────────────────────────────────────────────────────

  async startListening(): Promise<string> {
    console.log('[Speech] startListening — isListening:', this._isSpeechListening);

    // Second tap: stop active session; the first promise will resolve with results
    if (this._isSpeechListening) {
      console.log('[Speech] Second tap — stopping active session');
      try { await SpeechRecognition.stop(); } catch (e) { console.warn('[Speech] stop() error:', e); }
      return this.SPEECH_STOPPED;
    }

    // Check / request permission
    let permStatus = await SpeechRecognition.checkPermissions();
    console.log('[Speech] permission status:', permStatus.speechRecognition);
    if (permStatus.speechRecognition === 'denied') {
      throw 'Speech Recognition permission is denied. Please enable it in Settings → Privacy & Security → Speech Recognition.';
    }
    if (permStatus.speechRecognition !== 'granted') {
      permStatus = await SpeechRecognition.requestPermissions();
      console.log('[Speech] after request — permission status:', permStatus.speechRecognition);
      if (permStatus.speechRecognition !== 'granted') {
        throw 'Speech Recognition permission was not granted.';
      }
    }

    this._isSpeechListening = true;
    try {
      console.log('[Speech] calling SpeechRecognition.start()');
      const result = await SpeechRecognition.start({
        popup: false,
        partialResults: false,
        maxResults: 1,
      });
      console.log('[Speech] SpeechRecognition.start() result:', JSON.stringify(result));
      return result.matches && result.matches.length > 0 ? result.matches[0] : '';
    } catch (err: any) {
      console.error('[Speech] SpeechRecognition.start() error:', err);
      throw err;
    } finally {
      this._isSpeechListening = false;
    }
  }

  async startListeningAndPatch(form: FormGroup, fieldName: string) {
    console.log('[Speech] startListeningAndPatch — field:', fieldName, 'form contains:', form.contains(fieldName));
    let speechContent: string;
    try {
      speechContent = await this.startListening();
    } catch (err: any) {
      console.error('[Speech] startListeningAndPatch error:', err);
      this.notificationService.showNotification(
        typeof err === 'string' ? err : 'Speech Recognition failed. Please try again.',
        'error'
      );
      return;
    }

    // Second tap stopped the session — first call will handle the patch
    if (speechContent === this.SPEECH_STOPPED) {
      console.log('[Speech] Session stopped by second tap — skipping patch on this call');
      return;
    }

    console.log('[Speech] startListeningAndPatch — speechContent:', JSON.stringify(speechContent));

    if (form.contains(fieldName)) {
      const currentValue = form.get(fieldName)?.value || '';
      const newValue = currentValue
        ? currentValue + '\n' + speechContent
        : speechContent;

      console.log('[Speech] patching field:', fieldName, 'newValue:', JSON.stringify(newValue));
      form.patchValue({ [fieldName]: newValue });
    } else {
      console.warn(`[Speech] Field "${fieldName}" does not exist in the form`);
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

  getAllNotification() {
    return this.http.post(this.GetAllNotificationUrl, this.loginService.employeeId as number);
  }

  updateNotificationData() {
    this.getAllNotification().subscribe((data: any) => {
        this.notificationData = data;
      },
      error => {
        console.log('Error pulling notification', error);
      }
    );
  }

  postPushNotificationToDevice(
    NotificationTitle: string, 
    NotificationBody: string, 
    NotificationModule: string, 
    NotificationIcon: string | null = null, 
    NotificationPath: string | null = null) {
    const body = {
      "DeviceToken": this.DeviceToken? this.DeviceToken: '',
      "DeviceID": this.DeviceID? this.DeviceID: '',
      "LoginID": this.loginService.employeeId? this.loginService.employeeId as number: 0,
      "NotificationTitle": NotificationTitle? NotificationTitle: '',
      "NotificationBody": NotificationBody? NotificationBody: '',
      "NotificationModule": NotificationModule? NotificationModule: '',
      "NotificationIcon": NotificationIcon? NotificationIcon: 'ic_stat_notification',
      "NotificationPath": NotificationPath? NotificationPath: '',
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
                  this.postPushNotificationToDevice('CSR Updated Successfully', 'CSR Updated for SRID ' + body.SRID, 'Service Calls' ,'wrench', 'service-calendar').subscribe();
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

  public async checkVersion() {
    let version = '1.0.1';
    let platform = 'web';
    console.log('Checking app platform', Capacitor.isNativePlatform());
    console.log('Checking app version', App.getInfo());

    if (Capacitor.isNativePlatform()) {
      const info = await App.getInfo();
      version = info.version;
      platform = this.platform.is('android') ? 'android' : 'ios';
      console.log('Checking app version, platform:', platform, 'version:', version);
    }

    // if (platform == 'web') {
    //   const info = await App.getInfo();
    //   version = info.version;
    //   platform = 'android';
    // }

    const body = {
      platform: platform,
      version: version
    };
    return this.http.post(this.postCheckAppVersionUrl, body);
  }

  public async getGUIComponents(empId: number) {
    const body = {
      EmpId: empId
    };
    return this.http.post(this.postGUIComponentsUrl, body);
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

