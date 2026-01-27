import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutePaths } from './core/Constants';
import { LoginService } from './features/login/components/login/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  canActivate(): boolean {
    const loginID = this.loginService.employeeId;

    if (loginID === '') {
      this.router.navigate([AppRoutePaths.Login]);
      return false;
    }
    return true;
  }
}
