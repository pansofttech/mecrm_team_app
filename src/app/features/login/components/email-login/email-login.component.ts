import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent {
 
  loginForm: FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  invalid : boolean=false;
 
  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email]),
     
    });
  }

  onSubmit() {
  }
}
