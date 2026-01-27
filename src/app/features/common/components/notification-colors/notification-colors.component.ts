import { Component, Input, HostListener, ViewChildren, QueryList } from '@angular/core';
import { PopoverAnchorDirective } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'app-notification-colors',
  templateUrl: './notification-colors.component.html',
  styleUrls: ['./notification-colors.component.scss']
})
export class NotificationColorsComponent {
  public popoverWidth: number = 270;
  @Input() data: { color: string, name: string }[] = [];
  @ViewChildren(PopoverAnchorDirective) popovers!: QueryList<PopoverAnchorDirective>;

  ngOnInit() {
  }

  closePopover(rowIndex: number): void {
    const popoverAnchor = this.popovers.toArray()[rowIndex];
    if (popoverAnchor) 
      popoverAnchor.hide();     
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setPopoverWidth((event.target as Window).innerWidth);
  }

  private setPopoverWidth(screenWidth: number): void {
    this.popoverWidth = screenWidth <= 590 ? 270 : 380;
  }
}
