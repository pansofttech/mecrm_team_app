import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileInfo } from "@progress/kendo-angular-upload";
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService, AttachmentPopupDetails } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcDependentComboData, svcGetSRLCDetails } from '../../../service-calendar.service';


@Component({
  selector: 'app-completion-details',
  templateUrl: './completion-details.component.html',
  styleUrl: './completion-details.component.scss'
})
export class CompletionDetailsComponent implements OnInit{
  @Input() public completionDetails!: FormGroup;
  @Input() srid: number = 0;
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  @Input() CSRAttachment: Array<FileInfo> = [];
  @Output() surveyValidator: EventEmitter<void> = new EventEmitter<void>();
  showAPILoader: boolean = false;
  dependantComboDataForOtherCalls: svcDependentComboData[] = [];
  dependantComboDataForResolutionType: svcDependentComboData[] = [];

  //Attachment Pop up related variables
  // showCSRAttachment: boolean = false;
  // attachmentPopupDetails: AttachmentPopupDetails [] = [];

  constructor(
    public commonService : CommonService,
    private loginService: LoginService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private serviceCalendarService: ServiceCalendarService
  ){}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.completionDetails.get('completedCheckBox')?.valueChanges.subscribe((isChecked: boolean) => {
      if (isChecked) {
        this.completionDetails.get('completedDate')?.setValue(new Date());
        this.serviceCalendarService.isCallCompleted = true;
      } else {
        this.serviceCalendarService.isCallCompleted = false;
        this.completionDetails.get('completedDate')?.setValue(null);
      }
      this.surveyValidator.emit();
    });
    this.getPrerequisiteCombo();
    this.getPrerequisiteComboDataOnLoad();
    // this.patchFormValues('completionDetails');
  }

  // patchFormValues(formGroupName: string){
  //   if (this.serviceCalendarService.hasPatchedMap[formGroupName]) return;
  //   this.serviceCalendarService.hasPatchedMap[formGroupName] = true;

  //   this.completionDetails.patchValue({
  //     completedCheckBox: this.srlcDetails[0].completedDate != null,
  //     completedDate: this.srlcDetails[0].completedDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].completedDate): null,
  //     calibrationCheckBox: this.srlcDetails[0].isCalibration,
  //     oqpvCheckBox: this.srlcDetails[0].isOQPV,
  //     bdServiceCheckBox: this.srlcDetails[0].isBDService,
  //     pmCheckBox: this.srlcDetails[0].isPreventiveMaintenance,
  //     otherCalls: this.srlcDetails[0].otherCallsId? this.srlcDetails[0].otherCallsId: null,
  //     resolutionType: this.srlcDetails[0].resolutionTypeId? this.srlcDetails[0].resolutionTypeId: null,
  //     awaitingCSR: this.srlcDetails[0].awaitingCSR,
  //     csrRemarks: this.srlcDetails[0].csrRemarks == null? '': this.srlcDetails[0].csrRemarks
  //   });
  // }
          
  getPrerequisiteCombo(){
    this.serviceCalendarService.getPrerequisiteCombo("SRLC", this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForResolutionType = data.filter(
        (item: any) => item.comboType === 'RESOLUTIONTYPE'
      );
    });
  }

  getPrerequisiteComboDataOnLoad(){
    this.serviceCalendarService.getDependentComboDataOnLoad(this.srid, this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForOtherCalls = data.filter(
        (item: any) => item.comboType === 'OTHERCALLS'
      );
    });
  }

  // onClickSuppAttachment(docSrcVal: number, docSrcType: number, docSrcGUID: string, event: MouseEvent | TouchEvent | null){
  //   this.attachmentPopupDetails = [];
  //   this.attachmentPopupDetails.push({
  //     docSrcVal: docSrcVal as unknown as string,
  //     docSrcType: docSrcType,
  //     docSrcGUID: docSrcGUID,
  //     touchEvent: event
  //   });
  //   this.showCSRAttachment = !this.showCSRAttachment;
  // }

  // onCloseAttachmentPopup(){
  //   this.showCSRAttachment = !this.showCSRAttachment;
  // }

  // downloadAttachment(index: number) {
  //   this.loaderService.showLoader();
  //   this.commonService.getAttachment(this.srid as unknown as string, this.commonService.docSrcTypeCSRAttachment,"", index)
  //   .subscribe((response) => {
  //     const contentType = response.headers.get('content-type')!;
  //     const filename = this.CSRAttachment[index].name;
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
      this.commonService.docSrcTypeCSRAttachment,
      "",
      index
    ).subscribe(async (response) => {
      try {
        const contentType = response.headers.get('content-type')!;
        const filename = this.CSRAttachment[index].name;
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