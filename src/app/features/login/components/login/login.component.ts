/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  private popstateSubscription?: Subscription;
  public isUserLoggedOut: boolean = true;
  public isOTPScreen: boolean = false;
  private userPhone: string = '';
  private userEmail: string = '';
  public otpMethod: string = 'phone';
  otpControls = Array.from({ length: 6 }, () => new FormControl(''));
  countdown = 120;
  timer: any;

  resendCount = 0;
  maxResend = 3;
  maxAttempts = 3;
  coolDownPeriod = 30;
  coolDownRemaining = 0;
  coolDownTimer: any;

  constructor(
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
        // this.onSubmit();
        this.loginService.getLoginUserDetails(userData.username)
        .subscribe((data: any) =>{
          this.onHandleAfterSignin(data);
          this.loaderService.hideLoader();
        });
        this.isUserLoggedOut = false;
      }
    }
    this.loaderService.hideLoader();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
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
          userIPAddress
        )
      );

      if (!data.otpEnabled) {
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
        this.router.navigate([AppRoutePaths.ForgotPassword], {queryParams: {UN: this.loginForm.value.username, AuthCode: '',CT: 'Changepwd'} });
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

  public onForgotPasswordClick() {
    this.loaderMessage = "Sending password reset link"
    this.loaderService.showLoader();
    this.loginService.forgotPassword(
        this.loginForm.value.username
      )
      .subscribe(
        (data:any) => {
          this.loaderService.hideLoader();
          const notificationMessage = data.outPut;
          const notificationType = data.outPut.startsWith('Change') ? 'success' : 'error';
          this.notificationService.showNotification(
            notificationMessage,
            notificationType,
            'center',
            'bottom'
          );        
        },
        error => {
          this.loaderService.hideLoader();
          this.notificationService.showNotification(
            error.error.text,
            'error', 'center', 'bottom'
          );
        }
      );
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

  onOtpInput(event: any, index: number) {
    const input = event.target.value;
    if (input && index < 5) {
      const next = document.querySelectorAll('.otp-box')[index + 1] as HTMLElement;
      next?.focus();
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

    if(type == 'phone' && this.userPhone == ''){
        this.notificationService.showNotification(
            'Please update your phone number in the CRM',
            'error', 'center', 'bottom'
        );
        return;
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
