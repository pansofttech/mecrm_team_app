/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputType, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { eyeIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from './login.service';
import { CommonService } from 'src/app/features/common/common.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

function extractPrivilegeAndMenuName(data: any) {
  const privileges: string[] = [];
  const menuNames: string[] = [];

  data.forEach((item: any) => {
    privileges.push(item.privilege);
    menuNames.push(item.menuName);
  });

  return { privileges, menuNames };
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit, OnInit, OnDestroy {
  loginForm: FormGroup;
  invalid = false;
  @ViewChild('textbox')
  public textbox!: TextBoxComponent;
  public eyeIcon: SVGIcon = eyeIcon;
  public showLoader = true;
  public loaderMessage = '';
  public showSplashScreen = true;
  private popstateSubscription?: Subscription;
  public isUserLoggedOut: boolean = true;
  public isOTPScreen: boolean = false;
  public isTenantSelectionScreen: boolean = false;
  private userPhone: string = '';
  private userEmail: string = '';
  public otpMethod: string = 'email';
  otpControls = Array.from({ length: 6 }, () => new FormControl(''));
  countdown = 120;
  timer: any;

  // Tenant Selection Properties
  public tenants: any[] = [];
  public selectedTenant: number | null = null;
  public isForgotPasswordFlow: boolean = false;  // Track if tenant selection is for forgot password

  resendCount = 0;
  maxResend = 3;
  maxAttempts = 3;
  coolDownPeriod = 30;
  coolDownRemaining = 0;
  coolDownTimer: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private loginService: LoginService,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    this.renderer.addClass(this.document.body, 'login-page');

    // Show splash screen for 3 seconds
    setTimeout(() => {
      this.showSplashScreen = false;
    }, 1000);

    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events);
    this.loaderService.loaderState.subscribe(res => {
      this.showLoader = res;
    });
    const { value } = await Preferences.get({ key: 'userData' });
    
    if (value) {
      const userData = JSON.parse(value);
      this.loginForm.patchValue({
        username: userData.username,
        password: userData.password
      })
      if(userData.loggedIn){
        this.loaderService.showLoader();
        this.loginService.getLoginUserDetails(userData.username)
        .subscribe((data: any) =>{
          if(data?.length > 0){
          this.onHandleAfterSignin(data);
          this.loaderService.hideLoader();
          }
          else{
            Preferences.remove({ key: 'userData' });
            this.router.navigate(['/login']);
            this.isUserLoggedOut = true;
            this.loaderService.hideLoader();
            return;
          }
          this.loaderService.hideLoader();
        },
        error => {
          Preferences.remove({ key: 'userData' });
          this.router.navigate(['/login']);
          this.isUserLoggedOut = true;
          this.loaderService.hideLoader();
          return;
        });
        this.isUserLoggedOut = false;
      }
      else if (!userData.loggedIn) {
        this.isUserLoggedOut = true;
        this.commonService.handleLogout();
        this.loaderService.hideLoader();
      }
    }

    this.loaderService.hideLoader();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
    this.renderer.removeClass(this.document.body, 'login-page');
  }

  public ngAfterViewInit(): void {
    this.textbox.input.nativeElement.type = 'password';
  }

  public inputType: InputType = 'password';
  public togglePasswordVisibility(): void {
    this.inputType === 'password'
      ? (this.inputType = 'text')
      : (this.inputType = 'password');
  }

  async onHandleAfterSignin(apiResponse: any) {
    if (apiResponse[0]?.empId) {
      this.loginService.employeeId = apiResponse[0]?.empId;
      this.loginService.setEmployeeName(apiResponse[0]?.employeeName);
      const result = extractPrivilegeAndMenuName(apiResponse);
      this.loginService.privileges = result.privileges;
      this.loginService.tokenId = apiResponse[0]?.tokenID;
      this.loginService.jwtoken = apiResponse[0]?.jwToken;
      this.commonService.navigationMap.clear();

      await Preferences.set({
        key: 'userData',
        value: JSON.stringify({ 
          username: this.loginForm.value.username, 
          password: this.loginForm.value.password, 
          empId: apiResponse[0]?.empId,
          tokenId: apiResponse[0]?.tokenID,
          jwtoken: apiResponse[0]?.jwToken,
          refreshToken: apiResponse[0]?.refreshToken,
          loggedIn: true 
        }),
      });
      this.commonService.updPushNotificationRegistry().subscribe();
      this.commonService.navigationMap.set('/', '/dashboard');
      this.commonService.currentUrl = '/dashboard';
      
      // Trigger post-login initialization (push notifications, version check, etc.)
      this.commonService.triggerPostLoginInitialize();
      
      this.router.navigate([AppRoutePaths.Dashboard]);
    } else {
      this.notificationService.showNotification(
        'Invalid username or password',
        'error', 'center', 'bottom'
      );
    }
  }

  // async onSubmit() {
  //   this.loaderService.showLoader();
  //   let userIPAddress: string = "192.168.10.83";
  //   try {
  //     const res: any = await firstValueFrom(this.commonService.getIPAddress());
  //     userIPAddress = res.ip;
  //   } catch (error) {
  //     userIPAddress = "192.168.10.83";
  //   }
    
  //   this.loginService.loginUser(
  //       this.loginForm.value.username,
  //       this.loginForm.value.password,
  //       userIPAddress
  //     ).subscribe(
  //       data => {
  //         if(data.otpEnabled == false){
  //           this.onHandleAfterSignin(data);
  //           this.loaderService.hideLoader();
  //         }
  //         else{
  //           this.loginService.jwtoken = data?.jwToken;
  //           await Preferences.set({
  //             key: 'userData',
  //             value: JSON.stringify({ 
  //               username: this.loginForm.value.username, 
  //               password: this.loginForm.value.password, 
  //               jwtoken: data?.jwToken,
  //               loggedIn: false 
  //             }),
  //           });
  //           this.userEmail = data.email;
  //           this.userPhone = data.phNumber;
  //           this.maxResend = data.maxAttempts;
  //           this.countdown = data.expiry;
  //           this.isUserLoggedOut = false;
  //           this.isOTPScreen = true;
  //           this.startTimer();
  //           this.loaderService.hideLoader();
  //           this.notificationService.showNotification(
  //             data.message,
  //             'success', 'center', 'bottom'
  //           );
  //           // this.startSmsListener();
  //           //Implement Android OTP Listener
  //         }
  //       },
  //       error => {
  //         if(error.error.text == 'Your password has been Expired'){
  //           this.router.navigate([AppRoutePaths.ForgotPassword], { queryParams: { UN: this.loginForm.value.username, AuthCode: '', CT: 'Changepwd' } });
  //         }
  //         else{
  //           this.isUserLoggedOut = true;
  //           this.loginService.logoutUser();
  //         }
  //         this.loaderService.hideLoader();
  //         this.notificationService.showNotification(
  //           error.error.text,
  //           'error', 'center', 'bottom'
  //         );
  //       }
  //     );
  // }

  async onSubmit() {
    this.loaderService.showLoader();
    let userIPAddress = '192.168.10.83';

    try {
      const res: any = await firstValueFrom(this.commonService.getIPAddress());
      userIPAddress = res.ip;
    } catch {
      userIPAddress = '192.168.10.83';
    }

    try {
      const data: any = await firstValueFrom(
        this.loginService.loginUser(
          this.loginForm.value.username,
          this.loginForm.value.password,
          userIPAddress,
          this.selectedTenant || 0
        )
      );

      // Handle tenant selection requirement
      if (data.requireTenantSelection && data.tenants && data.tenants.length > 0) {
        this.tenants = data.tenants;
        this.isTenantSelectionScreen = true;
        this.isUserLoggedOut = false;
        this.loaderService.hideLoader();
        return;
      }

      if(data.autoLogin && data.tenantId){
        this.selectedTenant = data.tenantId;
        await this.onSubmit();
        this.loaderService.hideLoader();
        return;
      }

      if (!data.otpEnabled) {
        this.isTenantSelectionScreen = false;
        this.selectedTenant = null;
        this.onHandleAfterSignin(data);
        return;
      }

      this.loginService.jwtoken = data?.jwToken;

      await Preferences.set({
        key: 'userData',
        value: JSON.stringify({
          username: this.loginForm.value.username,
          password: this.loginForm.value.password,
          jwtoken: data?.jwToken,
          loggedIn: false
        })
      });

      const { value } = await Preferences.get({ key: 'userData' });
      console.log('VALUE', value);

      this.userEmail = data.email;
      this.userPhone = data.phNumber;
      this.maxAttempts = data.maxAttempts;
      this.countdown = data.expiry;
      this.coolDownPeriod = data.coolDownPeriod;
      this.isTenantSelectionScreen = false;
      this.selectedTenant = null;
      this.isUserLoggedOut = false;
      this.isOTPScreen = true;
      this.startTimer();

      this.notificationService.showNotification(
        data.message,
        'success', 'center', 'bottom'
      );

      // this.startSmsListener();

    } catch (error: any) {

      if (error?.error?.text === 'Your password has been Expired') {
        this.router.navigate([AppRoutePaths.ForgotPassword], {queryParams: {UN: this.loginForm.value.username, AuthCode: '',CT: 'Changepwd',TenantID: this.selectedTenant?? 0} });
      } else {
        this.isUserLoggedOut = true;
        this.loginService.logoutUser();
      }

      this.notificationService.showNotification(
        error?.error?.text || 'Login failed',
        'error', 'center', 'bottom'
      );

    } finally {
      this.loaderService.hideLoader();
    }
  }

  // Handle tenant selection confirmation for both login and forgot password flows
  async onTenantSelected() {
    if (!this.selectedTenant) {
      this.notificationService.showNotification(
        'Please select a tenant',
        'error',
        'center',
        'bottom'
      );
      return;
    }

    if (this.isForgotPasswordFlow) {
      await this.onForgotPasswordClick();
    } else {
      await this.onSubmit();
    }
  }

  // Cancel tenant selection and go back
  onCancelTenantSelection() {
    this.isTenantSelectionScreen = false;
    this.selectedTenant = null;
    this.tenants = [];
    this.isForgotPasswordFlow = false;
    this.isUserLoggedOut = true;
    if (!this.isForgotPasswordFlow) {
      this.loginForm.reset();
    }
  }

  public async onForgotPasswordClick() {
    this.loaderMessage = "Sending password reset link";
    this.loaderService.showLoader();

    try {
      const data: any = await firstValueFrom(
        this.loginService.forgotPassword(
          this.loginForm.value.username,
          this.selectedTenant || 0
        )
      );

      // Handle tenant selection requirement
      if (data.requireTenantSelection && data.tenants && data.tenants.length > 0) {
        this.tenants = data.tenants;
        this.isTenantSelectionScreen = true;
        this.isForgotPasswordFlow = true;
        this.isUserLoggedOut = false;
        this.loaderService.hideLoader();
        return;
      }

      // Handle auto-login scenario (only 1 tenant)
      if (data.autoLogin && data.tenantId) {
        this.selectedTenant = data.tenantId;
        await this.onForgotPasswordClick();
        return;
      }

      // Handle the actual forgot password response
      const notificationMessage = data.outPut || data.message || 'Password reset link sent successfully';
      const notificationType = notificationMessage.toLowerCase().includes('change') || 
                              notificationMessage.toLowerCase().includes('success') ? 'success' : 'error';
      
      this.notificationService.showNotification(
        notificationMessage,
        notificationType,
        'center',
        'bottom'
      );

      // Reset tenant selection state
      this.selectedTenant = null;
      this.isForgotPasswordFlow = false;

      // Navigate back to login if error response
      if (notificationType === 'error') {
        this.isTenantSelectionScreen = false;
        this.isUserLoggedOut = true;
        this.router.navigate(['/login']);
      }

    } catch (error: any) {
      this.notificationService.showNotification(
        error?.error?.text || error?.error?.message || 'Failed to send reset link',
        'error',
        'center',
        'bottom'
      );

      // Reset tenant selection state on error
      this.selectedTenant = null;
      this.isForgotPasswordFlow = false;
      this.isTenantSelectionScreen = false;
      this.isUserLoggedOut = true;
      this.router.navigate(['/login']);

    } finally {
      this.loaderService.hideLoader();
    }
  }

  onEnterPressed() {
    this.onSubmit();
  }

  get canResend(): boolean {
    return (
      this.resendCount < this.maxResend &&
      this.coolDownRemaining === 0
    );
  }

  startResendCooldown() {
    this.coolDownRemaining = this.coolDownPeriod;
    clearInterval(this.coolDownTimer);

    this.coolDownTimer = setInterval(() => {
      this.coolDownRemaining--;
      if (this.coolDownRemaining <= 0) {
        clearInterval(this.coolDownTimer);
      }
    }, 1000);
  }

  get isOtpComplete(): boolean {
    return this.otpControls.every(c => c.value);
  }

  async onOtpInput(event: any, index: number) {
    const input = event.target.value;
    if (input && index < 5) {
      const next = document.querySelectorAll('.otp-box')[index + 1] as HTMLElement;
      next?.focus();
    }

    if (this.isOtpComplete) {
      if (Capacitor.isNativePlatform()) {
        await Keyboard.hide().catch(() => {});
      } 
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpControls[index].value && index > 0) {
      const prev = document.querySelectorAll('.otp-box')[index - 1] as HTMLElement;
      prev?.focus();
    }
  }

  startTimer() {
    this.countdown = this.countdown?? 120;
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  resendOtp(type: string) {
    if (this.resendCount >= this.maxResend) return;
    this.resendCount++;

    if (type === 'phone') {

        // Check if phone number exists
        if (!this.userPhone || this.userPhone.trim() === '') {
            this.notificationService.showNotification(
                'Please update your phone number in the CRM',
                'error', 'center', 'bottom'
            );
            return;
        }

        // Validate format (+ followed by country code and number)
        const phoneRegex = /^\+[1-9]\d{1,14}$/;

        if (!phoneRegex.test(this.userPhone.trim())) {
            this.notificationService.showNotification(
                'Please update your phone number with country code in CRM',
                'error', 'center', 'bottom'
            );
            return;
        }
    }

    this.loginService.sendOtp(
        this.loginForm.value.username,
        this.userEmail,
        this.userPhone,
        type
      ).subscribe(
        data => {
          this.loaderService.hideLoader();
          this.startResendCooldown();
          this.notificationService.showNotification(
            data.message,
            'success', 'center', 'bottom'
          );
          this.otpMethod = type;
          this.startTimer();
        },
        error => {
          this.isUserLoggedOut = true;
          this.resetOTP();
          this.loginService.logoutUser();
          this.loaderService.hideLoader();
          this.notificationService.showNotification(
            error.error,
            'error', 'center', 'bottom'
          );
        }
      );
  }

  verifyOtp() {
    const otp = this.otpControls.map(c => c.value).join('');
    this.loginService.verifyOtp(
        this.loginForm.value.username,
        this.otpMethod == 'email'? this.userEmail: this.userPhone,
        otp
      ).subscribe(
        data => {
          console.log(data);
          this.resetOTP();
          this.loaderService.hideLoader();
          this.onHandleAfterSignin(data);
        },
        error => {
          console.log(error);
          if(error.error == "Invalid OTP or expired."){
            if(this.maxAttempts > 0){
              this.notificationService.showNotification(
                'Invalid OTP or expired.',
                'error', 'center', 'bottom'
              );
              this.maxAttempts--;
              return;
            }
            else{
              this.loaderService.hideLoader();
              this.resetOTP();
              this.loginService.logoutUser();
            }
          }
          this.loaderService.hideLoader();
        }
      );
  }

  resetOTP(){
    this.isOTPScreen = false;
    this.isUserLoggedOut = true;
    this.userEmail = '';
    this.userPhone = '';
    this.otpMethod = 'email';
    this.maxAttempts = 0;
    this.coolDownPeriod = 30;
  }

}
