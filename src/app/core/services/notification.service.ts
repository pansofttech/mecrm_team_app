import { Injectable } from '@angular/core';
import { NotificationService as NtfService } from '@progress/kendo-angular-notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private ntfService: NtfService) {}

  public showNotification(
    title: string,
    type:
      | 'none'
      | 'success'
      | 'warning'
      | 'error'
      | 'info'
      | undefined = 'info',
    horizontal: 'left' | 'center' | 'right' = 'right',
    vertical: 'top' | 'bottom' = 'top'
  ): void {
    this.ntfService.show({
      content: title,
      animation: { type: 'fade', duration: 800 },
      type: { style: type, icon: true },
      position: { horizontal, vertical },
    });
  }
}
