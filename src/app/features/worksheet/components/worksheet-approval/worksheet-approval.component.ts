import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { CommonService } from 'src/app/features/common/common.service';
import { WorksheetService, EnquiryDetails, WorkSheetSO, EnquiryProductsSO, 
         ConfigItems, WorksheetPrerequisites, WorksheetDLCList, WorksheetMarginList,
         WorksheetDRQList, WorksheetDRQItemsList } from '../../worksheet.service';

@Component({
  selector: 'app-worksheet-approval',
  templateUrl: './worksheet-approval.component.html',
  styleUrls: ['./worksheet-approval.component.scss']
})

export class WorksheetApprovalComponent implements OnInit, OnDestroy{
  private popstateSubscription?: Subscription;
  currentStep!: number;
  showAPILoader = false;
  loaderMessage!: string;
  isCreditExposureSelected: boolean = false;
  isDLCSelected: boolean = false;
  isPriceDetailsSelected: boolean = false;
  isMarginSelected: boolean = false;
  isDRQSelected: boolean = false;
  public worksheetDetailsCard: WorkSheetSO[] = [];
  enqId!: number;
  drqStatusBackgroundColor: string = "";
  enquiryDetailsCard: EnquiryDetails[] = [];
  gridData: any[] = [];
  productItems: EnquiryProductsSO[] = [];
  configItems: ConfigItems[] = [];
  WorksheetPrerequisites: WorksheetPrerequisites[] = [];
  WorksheetDLCDetailsCard: WorksheetDLCList[] = [];
  WorksheetMarginDetailsCard: WorksheetMarginList[] = [];
  WorksheetDRQDetailsCard: WorksheetDRQList[] = [];
  WorksheetDRQItemsDetailsCard: WorksheetDRQItemsList[] = [];
  WorksheetApprovalForm!: FormGroup;
  isLeadInfoSelected: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private worksheetService: WorksheetService,
    private loginService: LoginService,
    private commonService : CommonService
  ){
    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state){
      this.enqId = navigation.extras.state['id'];
    }
  }

  ngOnInit(): void {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderMessage = "";
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.getEnquiryDetails(this.enqId);
    this.getWorksheetDetails(this.enqId);
    this.WorksheetApprovalForm = this.formBuilder.group({
      creditExposure: new FormGroup({
      }),
      DLC: new FormGroup({
      }),
      DRQ: new FormGroup({
      }),
      priceDetails: new FormGroup({
        amComments: new FormControl('', [Validators.nullValidator]),
        smComments: new FormControl('', [Validators.nullValidator]),
        mgmtComments: new FormControl('', [Validators.nullValidator]),
        finComments: new FormControl('', [Validators.nullValidator]),
        wsattachment: new FormControl('', [Validators.nullValidator]),
      }),
      WSMargin: new FormGroup({
      })
    });
    this.onStepperClick(0);
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.WorksheetApprovalForm.controls).map(
      groupName => this.WorksheetApprovalForm.get(groupName)
    ) as FormGroup[];
    return groups[index];
  }

  drqStatusBgColor(drqStatus: string): string {
    if (drqStatus == "Approved") {
        return "#038a17";
    }
    else if (drqStatus == "Pending") {
      return "#f77800";
    }
    else if (drqStatus == "Rejected") {
      return "#e82a0c";
    }
    else if (drqStatus == "Closed") {
      return "#e82a0c";
    }
    else {
      return "#ffffff";       
    }
  }

  getEnquiryDetails(enqId: number) {
    this.worksheetService.getEnquiryWorksheetlist().subscribe((data: any) => {
      this.enquiryDetailsCard = data.filter(
        (item: any) => item.enqID === enqId
      );
    });
  }

  getWorksheetDetails(enqId: number) {
    this.loaderMessage = "Loading Worksheet..."
    this.loaderService.showLoader();
    this.worksheetService.getWorksheetDetails(enqId).subscribe((data: any) => {
      this.worksheetService.worksheetDetailsCard = data;
      this.worksheetDetailsCard = data;
      this.getWorksheetPrerequisites(this.worksheetService.worksheetDetailsCard[0].enqId);
      this.getWorksheetDLCDetails(enqId);
      this.getWorksheetMarginDetails(enqId);
      this.getWorksheetDRQDetails(enqId);
      this.getWorksheetDRQItemsDetails(enqId);
      this.getPaymentTerms(this.worksheetService.worksheetDetailsCard[0].enqId,this.worksheetService.worksheetDetailsCard[0].workSheetId);
      this.getProductItems(this.worksheetService.worksheetDetailsCard[0].enqId);
      this.getConfigItems(this.worksheetService.worksheetDetailsCard[0].enqId);
      this.loaderService.hideLoader();
      this.loaderMessage = "";
    });
  }

  getWorksheetPrerequisites(enqId: number){
    this.worksheetService.getWorksheetPrerequisites(enqId).subscribe((data: any) => {
      this.worksheetService.WorksheetPrerequisites = data;
      this.WorksheetPrerequisites = data;
    });
  }

  getWorksheetDLCDetails(enqId: number){
    this.worksheetService.getWorksheetDLCDetails(enqId).subscribe((data: any) => {
      this.WorksheetDLCDetailsCard = data.map((item: WorksheetDLCList) => ({
        ...item,
        isDescriptionOpen: false
      }));
      this.worksheetService.WorksheetDLCDetailsCard = this.WorksheetDLCDetailsCard;
    });
  }

  getWorksheetMarginDetails(enqId: number){
    this.worksheetService.getWorksheetMarginDetails(enqId).subscribe((data: any) => {
      this.worksheetService.WorksheetMarginDetailsCard = data;
      this.WorksheetMarginDetailsCard = data;
    });
  }

  getWorksheetDRQDetails(enqId: number){
    this.worksheetService.getWorksheetDRQDetails(enqId).subscribe((data: any) => {
      this.worksheetService.WorksheetDRQDetailsCard = data;
      this.WorksheetDRQDetailsCard = data;
    });
  }

  getWorksheetDRQItemsDetails(enqId: number){
    this.worksheetService.getWorksheetDRQItemsDetails(enqId).subscribe((data: any) => {
      this.worksheetService.WorksheetDRQItemsDetailsCard = data;
      this.WorksheetDRQItemsDetailsCard = data;
    });
  }  

  getPaymentTerms(enqId: number, worksheetId: number){
    this.worksheetService.getPaymentTerms(enqId,worksheetId).subscribe((data: any) => {
      this.worksheetService.paymentTerms = data;
      this.gridData = data;
    });
  }

  getProductItems(enqId: number){
    this.worksheetService.getProductItems(enqId,this.loginService.employeeId as number).subscribe((data: any) => {
      this.worksheetService.productItems = data;
      this.productItems = data;
    });
  }

  getConfigItems(enqId: number){
    this.worksheetService.getConfigItems(enqId).subscribe((data: any) => {
      this.worksheetService.configItems = data;
      this.configItems = data;
    });
  }

  onStepperClick(currentStep: number){
    this.isCreditExposureSelected = false;
    this.isDLCSelected = false;
    this.isPriceDetailsSelected = false;
    this.isMarginSelected = false;
    this.isDRQSelected = false;
    this.currentStep = currentStep;

    if(currentStep == 0){
      this.isCreditExposureSelected = true;
    }
    else if(currentStep == 1){
      this.isDLCSelected = true;
    }
    else if(currentStep == 2){
      this.isDRQSelected = true;
    }
    else if(currentStep == 3){
      this.isPriceDetailsSelected = true;
    }
    else if(currentStep == 4){
      this.isMarginSelected = true;
    }

  }

  approveWorksheet(){
    if (!this.validateComments()) {
      this.WorksheetApprovalForm.markAllAsTouched();
    }
    else if (this.validateComments()) {
      this.loaderMessage = "Approving Worksheet..."
      this.loaderService.showLoader();
      this.worksheetService
      .postSave_App_Rej_Enquiry(this.WorksheetApprovalForm.value, this.enqId, "Approve")
      .subscribe((data: any) => {
        this.loaderService.hideLoader();
        this.loaderMessage = "";
        if (data) {
          const notificationMessage = data.outPut;
          const notificationType = data.outPut.startsWith('Success') || data.outPut.startsWith('Approval') ? 'success' : 'error';
          this.notificationService.showNotification(
            notificationMessage,
            notificationType,
            'center',
            'bottom'
          );
        }
        this.router.navigate([AppRoutePaths.WorksheetDetails]);
      },
      error => {
        this.loaderService.hideLoader();
        this.loaderMessage = "";
        this.notificationService.showNotification(
          error,
          'error', 'center', 'bottom'
        );
      });
      this.worksheetService.resetValues();
    }
    else{
      this.WorksheetApprovalForm.markAllAsTouched();
    }
  }

  saveWorksheet(): void{
      this.loaderMessage = "Saving Worksheet..."
      this.loaderService.showLoader();
      this.worksheetService
        .postSave_App_Rej_Enquiry(this.WorksheetApprovalForm.value, this.enqId, "Save")
        .subscribe((data: any) => {
          this.loaderService.hideLoader();
          this.loaderMessage = "";
          if (data) {
            const notificationMessage = data.outPut;
            const notificationType = data.outPut.startsWith('Success') ? 'success' : 'error';
            this.notificationService.showNotification(
              notificationMessage,
              notificationType,
              'center',
              'bottom'
            );
          }
          this.router.navigate([AppRoutePaths.WorksheetDetails]);
        },
        error => {
          this.loaderService.hideLoader();
          this.loaderMessage = "";
          this.notificationService.showNotification(
            error,
            'error', 'center', 'bottom'
          );
        });
        this.worksheetService.resetValues();
        this.WorksheetApprovalForm.markAllAsTouched();
  }

  rejectWorksheet(): void{
    // if (!this.WorksheetApprovalForm.valid) {
    //   this.WorksheetApprovalForm.markAllAsTouched();
    // }
    // if (this.WorksheetApprovalForm.valid) {
      this.loaderMessage = "";
      this.loaderService.showLoader();
      this.worksheetService
        .postSave_App_Rej_Enquiry(this.WorksheetApprovalForm.value, this.enqId, "Reject")
        .subscribe((data: any) => {
          this.loaderService.hideLoader();
          this.loaderMessage = "";
          if (data) {
            const notificationMessage = data.outPut;
            const notificationType = data.outPut.startsWith('Success') ? 'success' : 'error';
            this.notificationService.showNotification(
              notificationMessage,
              notificationType,
              'center',
              'bottom'
            );
          }
          this.router.navigate([AppRoutePaths.WorksheetDetails]);
        },
        error => {
          this.loaderService.hideLoader();
          this.loaderMessage = "";
          this.notificationService.showNotification(
            error,
            'error', 'center', 'bottom'
          );
        });
        this.worksheetService.resetValues();
      // }
    this.WorksheetApprovalForm.markAllAsTouched();
  }

  validateComments(): boolean{
    const formvalue = this.WorksheetApprovalForm.value;
    if(this.worksheetDetailsCard[0].currentApprovalLevel == '1' ||  this.worksheetDetailsCard[0].currentApprovalLevel == 'Auto'){
      if(formvalue.priceDetails.amComments === ""){
        this.WorksheetApprovalForm.markAllAsTouched();
        return false;
      }
      else{
        return true;
      }
    }
    else if(this.worksheetDetailsCard[0].currentApprovalLevel == '2'){
      if(formvalue.priceDetails.smComments == ""){
        this.WorksheetApprovalForm.markAllAsTouched();
        return false;
      }
      else{
        return true;
      }
    }
    else if(this.worksheetDetailsCard[0].currentApprovalLevel == '3'){
      if(formvalue.priceDetails.finComments == ""){
        this.WorksheetApprovalForm.markAllAsTouched();
        return false;
      }
      else{
        return true;
      }
    }
    else if(this.worksheetDetailsCard[0].currentApprovalLevel == '4'){
      if(formvalue.priceDetails.mgmtComments == ""){
        this.WorksheetApprovalForm.markAllAsTouched();
        return false;
      }
      else{
        return true;
      }
    }
    return true;
  }

  onScroll() {
    this.isLeadInfoSelected = false;
  }

  onLeadInfoClick(){
    this.isLeadInfoSelected = !this.isLeadInfoSelected;
  }

  onBackClickHandle() {
    this.router.navigate([AppRoutePaths.WorksheetDetails]);
    this.worksheetService.resetValues();
  }

  onReset() {
    this.ngOnInit();
  }

}
