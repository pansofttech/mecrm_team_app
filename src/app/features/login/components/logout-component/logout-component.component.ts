import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/features/common/common.service';

@Component({
  selector: 'app-logout-component',
  templateUrl: './logout-component.component.html',
  styleUrls: ['./logout-component.component.scss'],
})
export class LogoutComponent {
  constructor(
    public router: Router,
    public commonService: CommonService
  ) {}

}
