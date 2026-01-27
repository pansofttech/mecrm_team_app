import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginComponent } from './components/login/login.component';
import { EmailLoginComponent } from './components/email-login/email-login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';

const routes: Routes = [
    {
      path: '',
      component: LoginComponent,
    },
    {
      path: AppRoutePaths.Email,
      component: EmailLoginComponent,
    },
    {
      path: AppRoutePaths.ForgotPassword,
      component:ForgotPasswordComponent ,
    },
    {
      path: AppRoutePaths.ResetPassword,
      component:ResetPasswordComponent,
    },
    {
      path: AppRoutePaths.LoginDialog,
      component:LoginDialogComponent ,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class LoginRoutingModule {
  static components = [];
}
