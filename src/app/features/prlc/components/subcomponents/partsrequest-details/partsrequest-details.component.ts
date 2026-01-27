import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { PrlcService, partsRequestResult } from '../../../prlc.service';
import { svcDependentComboData } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-partsrequest-details',
  templateUrl: './partsrequest-details.component.html',
  styleUrl: './partsrequest-details.component.scss'
})

export class PartsrequestDetailsComponent implements OnInit{
  showAPILoader = false;
  public virtual: any = {
    itemHeight: 28,
  };

  @Input() prDetails!: FormGroup;
  @Input() prInfoCard: partsRequestResult[] = [];
  dependantComboDataForRequestedByDetails: svcDependentComboData[] = [];
  dependantComboDataForRespDeptDetails: svcDependentComboData[] = [];
  dependantComboDataForRequestedReasonDetails: svcDependentComboData[] = [];
  dependantComboDataForPRType: svcDependentComboData[] = [];
  dependantComboDataForUEU: svcDependentComboData[] = [];
  dependantComboDataForUEUSite: svcDependentComboData[] = [];
  dependantComboDataForDeliverTo: svcDependentComboData[] = [];
  dependantComboDataForDeliveryLocation: svcDependentComboData[] = [];
  dependantComboDataForContactPerson: svcDependentComboData[] = [];
  dependantComboDataForProcMode: svcDependentComboData[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private loginService: LoginService,
    public  commonService: CommonService,
    public  prlcService: PrlcService,
  ){}

  async ngOnInit() {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    await this.getPreReqCombo();
    this.loaderService.hideLoader();
  }

  async getPreReqCombo(){
    this.prlcService.getServiceCombo("PARTSNEWCLAIM", this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForRequestedByDetails = data.filter(
          (item: any) => item.comboType === 'EMPLOYEE'
        );

      this.dependantComboDataForRespDeptDetails = data.filter(
          (item: any) => item.comboType === 'RESPONSIBLEDEPARTMENT'
        );

      this.dependantComboDataForPRType = data.filter(
          (item: any) => item.comboType === 'CLAIMTYPE'
        );

      this.dependantComboDataForUEU = data.filter(
          (item: any) => item.comboType === 'CUSTOMER'
        );

      this.dependantComboDataForDeliverTo = data.filter(
          (item: any) => item.comboType === 'DELIVERYTO'
        );

      this.dependantComboDataForDeliveryLocation = data.filter(
          (item: any) => item.comboType === 'DELIVERYTOLOCATION'
        );

      this.dependantComboDataForContactPerson = data.filter(
          (item: any) => item.comboType === 'CUSTOMERCONTACT'
        );

      this.dependantComboDataForProcMode = data.filter(
          (item: any) => item.comboType === 'PROCUREMENTMODE'
        );

    });

    await this.patchFormValues();
  }

  async handleRespDeptChanged(respDept: number) {
    this.prlcService.getPRLCDependentCombo("DEPARTMENTREASON",respDept?? 0,this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForRequestedReasonDetails = data;
    });
  }

  async handleUEUChanged(ueuDetail: number) {
    this.prlcService.getPRLCDependentCombo("PRCUSTOMERLES",ueuDetail?? 0,this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForUEUSite = data.filter(
          (item: any) => item.comboType === 'CUSTOMERSITE'
        );
      this.dependantComboDataForContactPerson = data.filter(
        (item: any) => item.comboType === 'CUSTOMERCONTACT'
        );
    });
  }

  async handleDeliverToChanged(deliverTo: string) {
    if(deliverTo === "Customer"){
      this.prlcService.getPRLCDependentCombo("CUSTOMERSITE",this.prInfoCard[0].customerId?? 0,this.loginService.employeeId as number).subscribe((data: any) => {
        this.dependantComboDataForDeliveryLocation = data.filter(
            (item: any) => item.comboType === 'CUSTOMERSITE' && item.refId == 1
          );
      });   
      this.prDetails.patchValue({
        deliveryLocation: this.prInfoCard[0].deliveryLocationId? this.prInfoCard[0].deliveryLocationId: null,
      });
    }
    else{
      this.prlcService.getPRLCDependentCombo("DELIVERYTOLOCATION", this.prInfoCard[0].deliverToID?? 0,this.loginService.employeeId as number).subscribe((data: any) => {
        this.dependantComboDataForDeliveryLocation = data.filter(
            (item: any) => item.comboType === 'DELIVERYTOLOCATION' && item.refId == 1
          );
      });
      this.prDetails.patchValue({
        deliveryLocation: this.prInfoCard[0].deliveryLocationId? this.prInfoCard[0].deliveryLocationId: null,
      });
    }
  }

  async patchFormValues(){
    await this.handleRespDeptChanged(this.prInfoCard[0].respDeptId?? 0);
    await this.handleUEUChanged(this.prInfoCard[0].customerId?? 0);
    await this.handleDeliverToChanged(this.prInfoCard[0].deliveryTo?? "");

    this.prDetails.patchValue({
      requestedReason: this.prInfoCard[0].reasonId? this.prInfoCard[0].reasonId: null,
      ueuSite: this.prInfoCard[0].leSiteId? this.prInfoCard[0].leSiteId: null,
      deliveryLocation: this.prInfoCard[0].deliveryLocationId? this.prInfoCard[0].deliveryLocationId: null,
      contactPerson: this.prInfoCard[0].custConId? this.prInfoCard[0].custConId: null,
    });
  }

  submit(){}

  onBackClickHandle(){}
}
