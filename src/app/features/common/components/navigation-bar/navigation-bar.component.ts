import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {
  @Input() title: string = '';
  @Input() showRefresh: boolean = false;

  @Output() backClick = new EventEmitter<void>();
  @Output() refreshClick = new EventEmitter<void>();

  onBackClickHandle() {
    this.backClick.emit();
  }

  onRefreshHandle() {
    this.refreshClick.emit();
  }
}
