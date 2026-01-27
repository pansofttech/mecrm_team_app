import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipsModule, PopoverModule } from "@progress/kendo-angular-tooltip";
import { IconsModule } from "@progress/kendo-angular-icons";
import { KendoModule } from 'src/app/kendo.module';
import { LoginRoutingModule } from './login-routing.module';
import { EmailLoginComponent } from './components/email-login/email-login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginService } from './components/login/login.service';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LogoutComponent } from './components/logout-component/logout-component.component';

@NgModule({
  declarations: [
    LoginComponent,
    EmailLoginComponent,
    ForgotPasswordComponent,
    LoginDialogComponent,
    ResetPasswordComponent,
    LogoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IconsModule,
    ReactiveFormsModule,
    KendoModule,
    TooltipsModule,
    PopoverModule,
    LoginRoutingModule,
  ],
  exports: [
    LoginComponent,
    EmailLoginComponent,
    ForgotPasswordComponent,
    LoginDialogComponent,
    ResetPasswordComponent,
    LogoutComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [LoginService],
})
export class LoginModule {}
