import { Component } from '@angular/core';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {


  
  public opened = false;

  public close(status: string): void {
    this.opened = false;
  }

  public open(): void {
    this.opened = true;
  }

}
