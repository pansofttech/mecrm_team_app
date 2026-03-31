import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-force-update',
  templateUrl: './force-update.component.html',
  styleUrl: './force-update.component.scss'
})
export class ForceUpdateComponent implements OnInit {
  storeUrl: string = '';
  isLoading: boolean = true;

  constructor(    
    private router: Router,
  ){
    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state){
      this.storeUrl = navigation.extras.state['storeUrl'] || '';
    }
  }
  
  ngOnInit(): void {
  }

  redirectToStore(): void {
    if (this.storeUrl) {
      window.location.href = this.storeUrl;
    }
  }
}
