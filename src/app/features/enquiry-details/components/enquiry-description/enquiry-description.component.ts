import { Component,Input } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FileInfo } from "@progress/kendo-angular-upload";
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FormStateService } from '../../form-state.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';

@Component({
  selector: 'app-enquiry-description',
  templateUrl: './enquiry-description.component.html',
  styleUrls: ['./enquiry-description.component.scss']
})
export class EnquiryDescriptionComponent {
  myFiles: Array<FileInfo> = [];
  @Input() public enquiryDescription!: FormGroup;
  showEnqDescAPILoader: boolean =false;

  constructor(
    private formStateService: FormStateService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    public commonService: CommonService,
  ) {}
  
  ngOnInit(){
    this.loaderService.loaderState.subscribe(res => {
      this.showEnqDescAPILoader = res;
    });
    this.loaderService.hideLoader();
    if(this.formStateService.attachments != null){
      this.myFiles = this.formStateService.attachments;
    }
  }

  // downloadAttachment(index: number) {
  //   this.loaderService.showLoader();
  //   this.commonService.getAttachment(this.formStateService.enqId, this.commonService.docSrcTypeAttachment,"", index)
  //   .subscribe((response) => {
  //     const contentType = response.headers.get('content-type')!;
  //     const filename = this.myFiles[index].name;
  //     const blob = new Blob([response.body!], { type: contentType });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = filename || 'attachment';
  //     link.click();
  //     window.URL.revokeObjectURL(url);
  //     this.loaderService.hideLoader();
  //   },
  //   error => {
  //     this.loaderService.hideLoader();
  //     this.notificationService.showNotification(
  //       'Failed to download file',
  //       'error', 'center', 'bottom'
  //     );
  //   });
  //   this.loaderService.hideLoader();
  // }

  async downloadAttachment(index: number) {
    this.loaderService.showLoader();
    this.commonService.getAttachment(
      this.formStateService.enqId,
      this.commonService.docSrcTypeAttachment,
      "",
      index
    ).subscribe(async (response) => {
      try {
        const contentType = response.headers.get('content-type')!;
        const filename = this.myFiles[index].name;
        const blob = new Blob([response.body!], { type: contentType });

        if (Capacitor.getPlatform() === 'web') {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename || 'attachment';
          link.click();
          window.URL.revokeObjectURL(url);
          this.notificationService.showNotification(
            'File downloaded successfully',
            'success', 'center', 'bottom'
          );
        } else {
          const base64Data = await this.commonService.convertBlobToBase64(blob) as string;
          const saved = await Filesystem.writeFile({
            path: filename,
            data: base64Data,
            directory: Directory.Cache
          });
          await Share.share({
            title: 'Share or Save File',
            url: saved.uri,
            dialogTitle: 'Open or Save with'
          });
          // this.notificationService.showNotification(
          //   `File ready: ${filename}`,
          //   'success', 'center', 'bottom'
          // );
        }
      } catch (err) {
        this.notificationService.showNotification(
          'Failed to download file',
          'error', 'center', 'bottom'
        );
      } finally {
        this.loaderService.hideLoader();
      }
    }, _ => {
      this.loaderService.hideLoader();
      this.notificationService.showNotification(
        'Failed to download file',
        'error', 'center', 'bottom'
      );
    });
  }

}
