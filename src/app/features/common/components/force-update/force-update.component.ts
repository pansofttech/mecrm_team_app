import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-force-update',
  templateUrl: './force-update.component.html',
  styleUrl: './force-update.component.scss'
})
export class ForceUpdateComponent implements OnInit {
  storeUrl: string = '';
  isLoading: boolean = true;

  constructor(    
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private renderer: Renderer2
  ){
    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state){
      this.storeUrl = navigation.extras.state['storeUrl'] || '';
    }
  }
  
  ngOnInit(): void {
      this.renderer.addClass(this.document.body, 'force-update--page');
  }

  redirectToStore(): void {
    if (this.storeUrl) {
      window.location.href = this.storeUrl;
    }
  }
}
