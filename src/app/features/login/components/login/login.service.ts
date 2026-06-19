import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { AppRoutePaths } from 'src/app/core/Constants';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginUrl = `${this.configService.apiUrl}/api/Login/CheckLoginDetails`;
  private logoutUrl = `${this.configService.apiUrl}/api/Login/UserLogout`;
  private authenticateUserUrl = `${this.configService.apiUrl}/api/Login/CheckUserAuthentication`;
  private getLoginUserDetailsUrl = `${this.configService.apiUrl}/api/Login/GetLoginUserDetails`;
  private forgotPasswordUrl = `${this.configService.apiUrl}/api/Login/ForgotPassword`;
  private updatePasswordUrl = `${this.configService.apiUrl}/api/Login/UpdatePassword`;
  private sendOtpUrl = `${this.configService.apiUrl}/api/Login/SendOtp`;
  private verifyOTPUrl = `${this.configService.apiUrl}/api/Login/VerifyOtp`;

  public employeeId: string | number = '';
  private employeeName = '';
  public tokenId: string = '';
  public jwtoken: string = '';
  public privileges: string[] = [];
  constructor(
    private http: HttpService,
    private configService: ConfigService,
  ) {}

  loginUser(username: string, password: string, userIP: string, tenantID: number) {
    const body = {
      username: username,
      password: password,
      userIP: userIP,
      tenantID: tenantID
    }

    // Pass headers as plain object, not HttpHeaders class
    const headers = tenantID && tenantID > 0 ? { 'TenantId': tenantID.toString() } : {};

    return this.http.post(this.loginUrl, body, { headers });
  }

  getEmployeeName(): string {
    return this.employeeName;
  }

  setEmployeeName(name: string): void {
    this.employeeName = name;
  }
  
  logoutUser(){
    const body = {
      UserID: this.employeeId as number,
    }
    return this.http.post(this.logoutUrl, body);
  }

  authenticateUser(Username: string, AuthCode: string, TenantID: number){
    const body = {
      UserName: Username,
      AuthCode: AuthCode,
      TenantID: TenantID
    }
    return this.http.post(this.authenticateUserUrl, body);
  }

  getLoginUserDetails(Username: string){
    const body = {
      username: Username
    }
    return this.http.post(this.getLoginUserDetailsUrl, body);
  }

  forgotPassword(Username: string, tenantID: number = 0){
    const body = {
      UserName: Username,
      LinkedUrl:  'ecrmpro://' + '/' + AppRoutePaths.ForgotPassword,
      TenantID: tenantID
    }
    return this.http.post(this.forgotPasswordUrl, body);
  }

  updatePassword(Username: string, AuthCode: string, NewPassword: string, ChangeType: string, TenantID: number){
    const body = {
      UserName: Username,
      AuthCode: AuthCode,
      NewPassword: NewPassword,
      Type: ChangeType,
      TenantID: TenantID
    }
    return this.http.post(this.updatePasswordUrl, body);
  }

  sendOtp(Username: string, Email: string, Phone: string, Method: string){
    const body = {
      UserName: Username,
      Email: Email,
      Phone: Phone,
      Method: Method
    }
    return this.http.post(this.sendOtpUrl, body);
  }

  verifyOtp(Username: string, PhoneorEmail: string, OTP: string){
    const body = {
      UserName: Username,
      PhoneorEmail: PhoneorEmail,
      OtpCode: OTP,
    }
    return this.http.post(this.verifyOTPUrl, body);
  }

}
