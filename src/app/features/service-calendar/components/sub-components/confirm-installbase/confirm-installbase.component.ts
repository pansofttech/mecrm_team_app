import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/features/common/common.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ServiceCalendarService, svcGetSRLCDetails } from '../../../service-calendar.service';

@Component({
  selector: 'app-confirm-installbase',
  templateUrl: './confirm-installbase.component.html',
  styleUrl: './confirm-installbase.component.scss'
})
export class ConfirmInstallbaseComponent {
  showAPILoader: boolean = false;
  @Input() showAttachmentPopup: boolean = false;
  @Input() title: string = 'Attachments';
  // @Input() subtitle: string = 'Uploaded Files'
  popupPosition = { x: 0, y: 0 };

  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  @Output() attachmentPopupClose: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private commonService: CommonService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ){}

  ngOnInit(){
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
  }
  
  onAttachmentPopupClose(){
    this.showAttachmentPopup = false;
    this.attachmentPopupClose.emit();
  }
}
