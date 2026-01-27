import { AfterViewInit, Component, OnInit, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputType, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { eyeIcon, arrowLeftIcon, checkOutlineIcon, SVGIcon } from "@progress/kendo-svg-icons";
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit{
  username: string = '';
  authCode: string = '';
  changeType: string = '';
  loginForm!: FormGroup;
  invalid =false;
  isLengthValid = false;
  isCapitalValid = false;
  isNumberValid = false;
  isPasswordNotMatching = false;
  userAuthenticated: boolean = false;
  public showLoader = false;

  public eyeIcon: SVGIcon = eyeIcon;
  public arrowLeftIcon: SVGIcon = arrowLeftIcon;
  public checkOutlineIcon: SVGIcon = checkOutlineIcon;
  @ViewChild("newPassword") public newPassword!: TextBoxComponent;
  @ViewChild("confirmPassword") public confirmPassword!: TextBoxComponent;

  constructor(    
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
  ) {}
  
  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['UN'];
      this.authCode = params['AuthCode'];
      this.changeType = params['CT'];
    });
    this.loginForm = new FormGroup({
      createpassword: new FormControl('', [Validators.required]),
      confirmpassword: new FormControl('', [Validators.nullValidator]),
    });
    this.checkUserAuthentication();
  }

  public ngAfterViewInit(): void {
    this.newPassword.input.nativeElement.type = "password";
    this.confirmPassword.input.nativeElement.type = "password";
  }

  public newPasswordInputType: InputType = 'password';
  public confirmPasswordInputType: InputType = 'password';

  onPasswordKeyup(target: EventTarget | null): void {
    if (target instanceof HTMLInputElement) {
      const value = target.value;
      this.checkPasswordStrength(value);
    }
  }

  onConfirmPasswordKeyup(target: EventTarget | null): void {
    if (target instanceof HTMLInputElement) {
      const value = target.value;
      if(this.loginForm.value.createpassword !== value){
        this.isPasswordNotMatching = true;
      }
      else{
        this.isPasswordNotMatching = false;
      }
    }
  }

  checkPasswordStrength(pswd: string) {
    this.isLengthValid = pswd.length >= 5;
    this.isCapitalValid = /[A-Z]/.test(pswd);
    this.isNumberValid = /\d/.test(pswd);
    if(this.loginForm.value.confirmpassword !== pswd){
      this.isPasswordNotMatching = true;
    }
    else{
      this.isPasswordNotMatching = false;
    }
  }

  public toggleVisibility(inputType:string): void {
    if (inputType === 'confirmPassword') {
      this.confirmPasswordInputType === 'text' ? this.confirmPasswordInputType = 'password' : this.confirmPasswordInputType = 'text';
    }
    if (inputType === 'newPassword') {
      this.newPasswordInputType === 'text' ? this.newPasswordInputType = 'password' : this.newPasswordInputType = 'text';
    }
  }

  checkUserAuthentication(){
    if(this.changeType !== 'Changepwd'){
      this.loaderService.showLoader();
      this.loginService.authenticateUser(this.username, this.authCode)
      .subscribe((data: any) => {
        this.loaderService.hideLoader();
        this.userAuthenticated = data.outPut === 'Success'? true: false;
      },
      error => {
        this.loaderService.hideLoader();
        this.notificationService.showNotification(
          error.error.text,
          'error', 'center', 'bottom'
        );
      })
    }
    else{
      this.userAuthenticated = true;
    }
  }

  onSubmit() {
    this.loaderService.showLoader();
    if (this.loginForm.valid    &&  this.isCapitalValid     && 
        this.isNumberValid      &&  this.isLengthValid      && 
        this.userAuthenticated  &&  !this.isPasswordNotMatching){
      this.loginService.updatePassword(
        this.username, 
        this.authCode? this.authCode: '', 
        this.loginForm.value.createpassword, 
        this.changeType? this.changeType: ''
      ).subscribe((data: any) => {
        this.loaderService.hideLoader();
        const notificationMessage = data.outPut;
        const notificationType = data.outPut == 'Your password has been changed' ? 'success' : 'error';
        this.notificationService.showNotification(
          notificationMessage,
          notificationType,
          'center',
          'bottom'
        );
        if(notificationMessage === 'Your password has been changed'){
          this.router.navigate([AppRoutePaths.Login]);
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.notificationService.showNotification(
          error.error.text,
          'error', 'center', 'bottom'
        );
      });
    }
    else{
      this.loaderService.hideLoader();
      this.notificationService.showNotification(
        'Please ensure all the password validations are met!!',
        'error', 'center', 'bottom'
      );
    }
  }

}
