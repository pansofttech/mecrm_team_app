import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { PDFViewerTool } from "@progress/kendo-angular-pdfviewer";
import { AppRoutePaths } from 'src/app/core/Constants';
import { ServiceCalendarService } from '../../service-calendar.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';

import {
  SVGIcon,
  brushIcon,
  uploadIcon,
  saveIcon,
  imageIcon,
} from "@progress/kendo-svg-icons";

@Component({
  selector: 'app-csr-generator',
  templateUrl: './csr-generator.component.html',
  styleUrls: ['./csr-generator.component.scss']
})
export class CsrGeneratorComponent {
  signatureOpen: boolean = false;
  arrayBuffer: ArrayBuffer = new ArrayBuffer(8);
  showAPILoader = false;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private serviceCalendarService: ServiceCalendarService,
    private notificationService: NotificationService,
    private commonService: CommonService,
    private sanitizer: DomSanitizer,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.getCSRFile();
  }

  public value = "";
  public showUpload = false;
  public brushSvg: SVGIcon = brushIcon;
  public uploadSvg: SVGIcon = uploadIcon;
  public saveSvg: SVGIcon = saveIcon;
  public imageIcon: SVGIcon = imageIcon;
  public engineerSignatureValue = '';
  public customerSignatureValue = '';
  public tools: PDFViewerTool[] = [
      "zoom",
      "zoomInOut",
      "download",
      "print",
  ];

  // Use theme colors
  public color = "";
  public backgroundColor = "";
  public strokeWidth = 3;
  public sizes = [
    {
      text: "Normal",
      click: () => (this.strokeWidth = 1),
    },
    {
      text: "Wide",
      click: () => (this.strokeWidth = 3),
    },
  ];

  public imageURL?: SafeUrl;
  private rawImageURL?: string;

  public ngOnDestroy() {
    this.cleanupImage();
  }

  public async onSave() {
    this.signatureOpen = !this.signatureOpen;
    this.loaderService.showLoader();
    if(await this.commonService.isOnline()){
      this.serviceCalendarService.getCSRfile(
          this.serviceCalendarService.selectedSRID,
          this.serviceCalendarService.csrComments,
          this.serviceCalendarService.selectedCallCat,
          this.serviceCalendarService.selectedCallCompletion,
          this.customerSignatureValue.replace(/^data:image\/png;base64,/, ''),
          this.engineerSignatureValue.replace(/^data:image\/png;base64,/, '')
      ).subscribe((data: any) => {
          this.serviceCalendarService.getCSRPdf(data.outPut).subscribe((response) => {
              const contentType = response.headers.get('content-type')!;
              const blob = new Blob([response.body!], { type: contentType });
              const file = new File([blob], data.outPut, { type: contentType });
              this.serviceCalendarService.putUploadCSR(this.serviceCalendarService.selectedSRID as any, file).subscribe((uploadResponse: any) => {
                const notificationMessage = uploadResponse.statusCode === 200 ? 'CSR Updated Successfully' : 'Error in Updating CSR';
                this.notificationService.showNotification(
                    notificationMessage,
                    'success', 'center', 'bottom'
                );
                this.loaderService.hideLoader();
                //this.router.navigate([AppRoutePaths.SRLC],{state: {id: this.serviceCalendarService.selectedSRID, date: this.commonService.displayDateFormat(this.serviceCalendarService.selectedDate)}});
                this.router.navigateByUrl(AppRoutePaths.ServiceCalendar, { skipLocationChange: true }).then(() => {
                  this.router.navigate([AppRoutePaths.SRLC],{state: {id: this.serviceCalendarService.selectedSRID, date: this.commonService.displayDateFormat(this.serviceCalendarService.selectedDate)}});
                });
              },
              error => {
                this.loaderService.hideLoader();
                this.notificationService.showNotification(
                  'CSR not updated'+ error,
                  'error', 'center', 'bottom'
                );
              });
          });
      });
    }
    else{
      const body = {
        "SRID": this.serviceCalendarService.selectedSRID,
        "LoginID": this.loginService.employeeId,
        "CSRSummary": this.serviceCalendarService.csrComments,
        "CallCategory": this.serviceCalendarService.selectedCallCat,
        "IsCallCompleted": this.serviceCalendarService.selectedCallCompletion,
        "CustomerSign": this.customerSignatureValue.replace(/^data:image\/png;base64,/, ''),
        "EngineerSign": this.engineerSignatureValue.replace(/^data:image\/png;base64,/, '')
      };
      await this.commonService.saveOffline('postCSRSaveSync', body, 'CSR Attachment Syncing','wrench');
      this.loaderService.hideLoader();
      this.serviceCalendarService.resetValues();
      this.router.navigate([AppRoutePaths.Dashboard]);
      this.notificationService.showNotification(
        'Your currently offline and CSR will be uploaded automatically once your online',
        'error', 'center', 'bottom'
      );
      return;
    }
  }

  public onClear() {
    this.value = "";
    this.cleanupImage();
  }

  clearEngineerSignature(): void {
    this.engineerSignatureValue = '';
  }

  clearCustomerSignature(): void {
    this.customerSignatureValue = '';
  }

  public onImageUpload(file: File) {
    this.cleanupImage();

    this.readImage(file);
    this.rawImageURL = URL.createObjectURL(file);
    this.imageURL = this.sanitizer.bypassSecurityTrustUrl(this.rawImageURL);
  }

  private cleanupImage() {
    if (this.rawImageURL) {
      URL.revokeObjectURL(this.rawImageURL);
      this.imageURL = undefined;
      this.rawImageURL = "";
    }
  }

  public readImage(file: File) {
    const reader = new FileReader();

    const onLoad = () => {
      this.value = reader.result as string;
      reader.removeEventListener("load", onLoad);

      this.customerSignatureValue = reader.result as string;
      reader.removeEventListener("load", onLoad);

      this.engineerSignatureValue = reader.result as string;
      reader.removeEventListener("load", onLoad);
    };

    reader.addEventListener("load", onLoad);
    reader.readAsDataURL(file);
  }

  public getCSRFile(): ArrayBuffer | undefined {
    this.loaderService.showLoader();
    this.serviceCalendarService.getCSRfile(
      this.serviceCalendarService.selectedSRID,
      this.serviceCalendarService.csrComments,
      this.serviceCalendarService.selectedCallCat,
      this.serviceCalendarService.selectedCallCompletion,
      "",
      ""
    ).subscribe((data: any) => {
       if (data) {
        this.serviceCalendarService.getCSRPdf(data.outPut).subscribe((response) => {
          if(response.body){
            this.arrayBuffer = response.body;
          }
        });
       }
       this.loaderService.hideLoader();
    },
    error => {
      this.loaderService.hideLoader();
    });
    return undefined;
  }

  onBackClickHandle() {
    // this.serviceCalendarService.resetValues();
    //this.router.navigate([AppRoutePaths.SRLC],{state: {id: this.serviceCalendarService.selectedSRID, date: this.commonService.displayDateFormat(this.serviceCalendarService.selectedDate)}});

    this.router.navigateByUrl(AppRoutePaths.ServiceCalendar, { skipLocationChange: true }).then(() => {
      this.router.navigate([AppRoutePaths.SRLC],{state: {id: this.serviceCalendarService.selectedSRID, date: this.commonService.displayDateFormat(this.serviceCalendarService.selectedDate)}});
    });
  }

  onRefresh(){
    this.getCSRFile();
  }

}
