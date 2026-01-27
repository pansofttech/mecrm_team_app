import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PrlcService, partsRequestResult, searchPartsBySRID, currencyConversion } from '../../prlc.service';
import { svcDependentComboData } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-partsrequest-approval',
  templateUrl: './partsrequest-approval.component.html',
  styleUrl: './partsrequest-approval.component.scss'
})
export class PartsrequestApprovalComponent implements OnInit, OnDestroy{
  private popstateSubscription?: Subscription;
  public showAPILoader = false;
  currentStep!: number;
  selectedPRID: number = 0;
  selectedSRID: number = 0;

  isPRDetailsSelected: boolean = false;
  isPRCommentsSelected: boolean = false;
  isPRListSelected: boolean = false;
  isPRIDInfoSelected: boolean = false;
  isSaveDisabled: boolean = false;

  prInfoCard: partsRequestResult[] = [];
  prApprovalForm!: FormGroup;
  isEditable: boolean = true;

  //Parts List Details
  partsListCards: searchPartsBySRID[] = [];
  currencyConversionList: currencyConversion[] = [];
  cbReasonDataSource: svcDependentComboData[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private loginService: LoginService,
    private commonService: CommonService,
    private notificationService: NotificationService,
    public prlcService: PrlcService,
  ){
    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state){
      this.selectedPRID = navigation.extras.state['id'];
      this.selectedSRID = navigation.extras.state['srid'];
    }
  }

  async ngOnInit() {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.prApprovalForm = this.formBuilder.group({
      prDetails: new FormGroup({
        requestedBy: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        respDept: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        requestedReason: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        prType: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        requestedDate: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        iono: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        srid: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        ueu: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        ueuSite: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        deliverTo: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        deliveryLocation: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        contactPerson: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        procMode: new FormControl({value: '', disabled: true}, [Validators.nullValidator])
      }),
      prApprovalComments: new FormGroup({
        // marginValBefore: new FormControl({value: '', disabled: true},  Validators.nullValidator),
        // marginPercBefore: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        // marginValAfter: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        // marginPercAfter: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        approverComments: new FormControl({value: '', disabled: !this.isEditable},  Validators.nullValidator),
        plApproverComments: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
        managementComments: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
        remarks: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
      })
    });
    this.onStepperClick(1);
    await this.getPreReqCombo();
    await this.getCurrencyConversion();
    await this.getPartsRequestDetails();
  }

  patchFormValues(){
    console.log('PR Data', this.prInfoCard[0]);
    this.prApprovalForm.patchValue({
      prDetails: {
        requestedBy: this.prInfoCard[0].reqEmpId? this.prInfoCard[0].reqEmpId: null,
        respDept: this.prInfoCard[0].respDeptId? this.prInfoCard[0].respDeptId: null,
        requestedReason: this.prInfoCard[0].reasonId? this.prInfoCard[0].reasonId: null,
        prType: this.prInfoCard[0].reqModeId? this.prInfoCard[0].reqModeId: null,
        requestedDate: this.prInfoCard[0].requestedDate? this.commonService.convertDateStringToDate(this.prInfoCard[0].requestedDate): null,
        iono: this.prInfoCard[0].ioNo == null? '': this.prInfoCard[0].ioNo,
        srid: this.prInfoCard[0].srId == null? '': this.prInfoCard[0].srId,
        ueu: this.prInfoCard[0].customerId? this.prInfoCard[0].customerId: null,
        ueuSite: this.prInfoCard[0].leSiteId? this.prInfoCard[0].leSiteId: null,
        deliverTo: this.prInfoCard[0].deliverToID? this.prInfoCard[0].deliverToID: null,
        deliveryLocation: this.prInfoCard[0].deliveryLocationId? this.prInfoCard[0].deliveryLocationId: null,
        contactPerson: this.prInfoCard[0].custConId? this.prInfoCard[0].custConId: null,
        procMode: this.prInfoCard[0].procurementModeID? this.prInfoCard[0].procurementModeID: null
      },
      prApprovalComments: {
        approverComments: this.prInfoCard[0].approverComments == null? '': this.prInfoCard[0].approverComments,
        plApproverComments: this.prInfoCard[0].plApproverComments == null? '': this.prInfoCard[0].plApproverComments,
        managementComments: this.prInfoCard[0].ofApproverComments == null? '': this.prInfoCard[0].ofApproverComments,
        remarks: this.prInfoCard[0].remarks == null? '': this.prInfoCard[0].remarks
      },
    });    
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  onStepperClick(currentStep: number){
    this.isPRDetailsSelected = false;
    this.isPRCommentsSelected = false;
    this.isPRListSelected = false;
    this.currentStep = currentStep;
  
    if(currentStep == 0){
      this.isPRDetailsSelected = true;
    }
    if(currentStep == 1){
      this.isPRCommentsSelected = true;
    }
    else if(currentStep == 2){
      this.isPRListSelected = true;
    }
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.prApprovalForm.controls).map(
      groupName => this.prApprovalForm.get(groupName)
    ) as FormGroup[];
  
    return groups[index];
  }

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  onPRIDInfoClick(){
    this.isPRIDInfoSelected = !this.isPRIDInfoSelected;
  }

  async getPartsRequestDetails(){
    this.prlcService.getPartsRequestDetails(this.selectedPRID, this.selectedSRID).subscribe((data: any) => {
      if(data!=null){
        this.prInfoCard = data;
        this.patchFormValues();
        this.getPartsList(data[0].partReqId?? 0)
      }
    },        
    error => {
      this.notificationService.showNotification(
        'Error fetching parts request details',
        'error', 
        'center', 
        'bottom'
      );
    });
  }

  //Parts List Details Begin
  async getPartsList(partReqId: number) {
    this.loaderService.showLoader();
    this.prlcService.getPartsListBySRID(0, partReqId, "")
      .subscribe(
        (data: any) => {
          this.partsListCards = data;

          if (data && data.length > 0) {
            if (this.prInfoCard[0].claimStatus === this.prlcService.ManagementApproval) {
              this.partsListCards = data.filter((item: searchPartsBySRID) =>
                this.cbReasonDataSource.some(reason =>
                  item.procurementReason === reason.comboName &&
                  reason.specialType?.toLowerCase() === "yes"
                )
              );
            } else {
              this.partsListCards = data;
            }
          } else {
            this.partsListCards = [];
          }

          this.partsListCards = this.partsListCards.map(row => {
            if (row.partStatus && row.partStatus.toLowerCase() === "cancelled") {
              return row;
            }
            const discount = row.discount ?? 0;
            const suppDiscount = row.suppDiscount ?? 0;

            let orderingValue =
              (row.quantity ?? 0) *
              ((row.unitPrice ?? 0) -
                ((row.unitPrice ?? 0) * (discount + suppDiscount)) / 100);

            orderingValue = parseFloat(orderingValue.toFixed(2));

            let conversionRate = row.conversionRate == null ? 0 : row.conversionRate;

            if (conversionRate === 0 && this.currencyConversionList) {
              const foundConversionRate = this.currencyConversionList.find(
                (x: any) => x.buyingCurrencyID === row.currency
              );
              if (foundConversionRate) {
                conversionRate = foundConversionRate.conversionRate?? 0;
              }
            }

            row.conversionRate = conversionRate;
            row.orderValue = parseFloat((orderingValue * conversionRate).toFixed(2));
            row.itemSP = parseFloat(
              ((row.unitItemSP ?? 0) * (row.quantity ?? 0)).toFixed(2)
            );

            return row;
          });

          console.log('Final Parts Data', this.partsListCards);
          console.log('Proc Reason', this.cbReasonDataSource);
          this.loaderService.hideLoader();
        },
        error => {
          this.notificationService.showNotification(
            'Error fetching prlc worklist',
            'error',
            'center',
            'bottom'
          );
          this.loaderService.hideLoader();
        }
      );
  }

  async getPreReqCombo(){
    this.prlcService.getServiceCombo("PARTSPOPUP", this.loginService.employeeId as number).subscribe((data: any) => {
      this.cbReasonDataSource = data.filter(
          (item: any) => item.comboType === 'PROCUREMENTREASON'
        );
    });
  }

  async getCurrencyConversion(){
    this.prlcService.getCurrencyConversionDetails().subscribe((data: any) =>{
      this.currencyConversionList = data;
    },
    error => {
      this.notificationService.showNotification(
        'Error fetching currency conversion details',
        'error', 'center', 'bottom'
      )
    });
  }
  //Parts List Details End

  onScroll() {
    this.isPRIDInfoSelected = false;
  }

  onReset(){
    this.ngOnInit();
  }

  submit(){}

  onBackClickHandle(){
    this.prlcService.resetValues();
    this.router.navigate([AppRoutePaths.PartsRequestWorkList]);
  }
}
