import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileInfo } from "@progress/kendo-angular-upload";
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcGetSRLCDetails, svcDependentComboData } from '../../../service-calendar.service';

@Component({
  selector: 'app-installation-details',
  templateUrl: './installation-details.component.html',
  styleUrl: './installation-details.component.scss'
})
export class InstallationDetailsComponent implements OnInit{
  @Input() IBStickerAttachment: Array<FileInfo> = [];
  @Input() srid: number = 0;
  @Input() public installationDetails!: FormGroup;
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  showAPILoader: boolean = false;
  dependantComboDataForIBStickerStatus: svcDependentComboData[] = [];

  constructor(
    public loginService: LoginService,
    public loaderService: LoaderService,
    public commonService : CommonService,
    public notificationService: NotificationService,
    public serviceCalendarService: ServiceCalendarService
  ){}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    // this.patchFormValues('installationDetails');
    this.subscribe();
    this.getPrerequisiteCombo();
  }

  getPrerequisiteCombo(){
    this.serviceCalendarService.getPrerequisiteCombo("SRLC", this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForIBStickerStatus = data.filter(
        (item: any) => item.comboType === 'STICKERSTATUS'
      );
    });
  }

  // patchFormValues(formGroupName: string){
  //   if (this.serviceCalendarService.hasPatchedMap[formGroupName]) return;
  //   this.serviceCalendarService.hasPatchedMap[formGroupName] = true;

  //   this.installationDetails.patchValue({
  //     productSerialNo: this.srlcDetails[0].serialNumber? this.srlcDetails[0].serialNumber: '',
  //     sapNo: this.srlcDetails[0].sapNo? this.srlcDetails[0].sapNo: '',
  //     productCategory: this.srlcDetails[0].productCategory? this.srlcDetails[0].productCategory: '',
  //     leTag: this.srlcDetails[0].customerTagNo? this.srlcDetails[0].customerTagNo: '',
  //     location: this.srlcDetails[0].custSiteLocation? this.srlcDetails[0].custSiteLocation: '',
  //     principalWarrantyStart: this.srlcDetails[0].warrantyStartDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].warrantyStartDate): null,
  //     principalWarrantyEnd: this.srlcDetails[0].warrantyFinishDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].warrantyFinishDate): null,
  //     clientWarrantyStart: this.srlcDetails[0].extendedWarStartDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].extendedWarStartDate): null,
  //     clientWarrantyEnd: this.srlcDetails[0].extendedWarEndDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].extendedWarEndDate): null,      
  //   });
  // }

  subscribe(){
    this.installationDetails.get('principalWarrantyStart')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
    this.installationDetails.get('principalWarrantyEnd')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
    this.installationDetails.get('clientWarrantyStart')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
    this.installationDetails.get('clientWarrantyEnd')?.valueChanges.subscribe(() => {
      this.validateDates();
    });

    this.installationDetails.get('ibStickerStatus')?.valueChanges.subscribe((value: number) => {
      const ibStickerAttachmentControl = this.installationDetails.get('ibStickerAttachment');
      if (value == this.serviceCalendarService.ibStickerImageUploadedStatus) {
        ibStickerAttachmentControl?.setValidators([Validators.required]);
        ibStickerAttachmentControl?.enable();
      } else {
        ibStickerAttachmentControl?.clearValidators();
        ibStickerAttachmentControl?.disable();
      }
      ibStickerAttachmentControl?.updateValueAndValidity();
    });
  }

  validateDates() {
    const principalWarrantyStart = this.installationDetails.get('principalWarrantyStart') as FormControl;
    const principalWarrantyEnd = this.installationDetails.get('principalWarrantyEnd') as FormControl;
    const clientWarrantyStart = this.installationDetails.get('clientWarrantyStart') as FormControl;
    const clientWarrantyEnd = this.installationDetails.get('clientWarrantyEnd') as FormControl;
    
    const principalWarrantyStartDate = principalWarrantyStart?.value;
    const principalWarrantyEndDate = principalWarrantyEnd?.value;
    const clientWarrantyStartDate = clientWarrantyStart?.value;
    const clientWarrantyEndDate = clientWarrantyEnd?.value;
  
    let principalEndErrors = null;
    let clientEndErrors = null;
  
    if (principalWarrantyStartDate && principalWarrantyEndDate && principalWarrantyStartDate > principalWarrantyEndDate) {
      principalEndErrors = { required: true, dateInvalid: 'Principal warranty end date should be greater than start date' };
    }
  
    if (clientWarrantyStartDate && clientWarrantyEndDate && clientWarrantyStartDate > clientWarrantyEndDate) {
      clientEndErrors = { required: true, dateInvalid: 'Client warranty end date should be greater than start date' };
    }
  
    principalWarrantyEnd.setErrors(principalEndErrors);
    clientWarrantyEnd.setErrors(clientEndErrors);
  }

  // downloadAttachment(index: number) {
  //   this.loaderService.showLoader();
  //   this.commonService.getAttachment(this.srid as unknown as string, this.commonService.docIBStickerAttachment,"", index)
  //   .subscribe((response) => {
  //     const contentType = response.headers.get('content-type')!;
  //     const filename = this.IBStickerAttachment[index].name;
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
      this.srid as unknown as string,
      this.commonService.docIBStickerAttachment,
      "",
      index
    ).subscribe(async (response) => {
      try {
        const contentType = response.headers.get('content-type')!;
        const filename = this.IBStickerAttachment[index].name;
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
