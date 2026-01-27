import { Component, Input, Output, OnDestroy, OnInit, ViewChild, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcGetSRLCDetails } from '../../service-calendar.service';

@Component({
  selector: 'app-call-hold',
  templateUrl: './call-hold.component.html',
  styleUrl: './call-hold.component.scss'
})
export class CallHoldComponent implements OnInit, OnDestroy{
  private popstateSubscription?: Subscription;
  showAPILoader = false;
  loaderMessage: string = 'Loading Call Hold Details...';
  public currentStep = 0;
  invalid = false;
  @ViewChild('stepper', { static: true })
  public stepper!: StepperComponent;
  callCategory: string = "";
  isPORequired: boolean = false;
  isEditable: boolean = false;
  @Input() srid: number = 0;
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  @Output() widgetSelected: EventEmitter<void> = new EventEmitter<void>();

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid || this.currentGroup.untouched;
  };

  private shouldValidate = (index: number): boolean => {
    return this.getGroupAt(index)?.touched && this.currentStep >= index;
  };

  public steps = [
    {
      label: 'Customer Delay',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
      icon: '',
    },
    {
      label: 'Other Reasons',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
      icon: '',
    },
    {
      label: 'Parts Required',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
      icon: '',
    }
  ];
  current: any;

  callHoldForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private router: Router,
    private notificationService: NotificationService,
    private commonService: CommonService,
    private serviceCalendarService: ServiceCalendarService
  ) {}

  ngOnInit(): void {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();

    this.callCategory = this.srlcDetails[0].callCategory? this.srlcDetails[0].callCategory : '';
    this.isPORequired = (this.srlcDetails[0].callCategory == "noncontract svc") 
                      && this.srlcDetails[0].poRequiredRemarks != '' 
                      && this.srlcDetails[0].poRequiredRemarks != null
                      && (this.srlcDetails[0].poRequiredRemarks == "no entitlement");
    this.isEditable = this.srlcDetails[0].srStatus?.toLowerCase() == "in_progress";

    this.callHoldForm = this.formBuilder.group({
      customerDelayDetails: new FormGroup({
        leDelay: new FormControl({value:false, disabled: !this.isEditable}, [Validators.nullValidator]),
        leDelayRecoverDate: new FormControl({value: '', disabled: !this.isEditable}, [Validators.nullValidator]),
        leDelayHoldRemarks: new FormControl({value: '', disabled: !this.isEditable}, [Validators.nullValidator]),
      }),
      otherReasonsDetails: new FormGroup({
        otherReasons: new FormControl({value: false, disabled: !this.isEditable}, [Validators.nullValidator]),
        otherReasonsRecoveryDate: new FormControl({value: '', disabled: !this.isEditable}, [Validators.nullValidator]),
        otherReasonHoldRemarks: new FormControl({value: '', disabled: !this.isEditable}, [Validators.nullValidator]),
      }),
      partsRequiredDetails: new FormGroup({
        partsRequired: new FormControl({value: false, disabled: true},[Validators.nullValidator]),
        partsRequiredHoldRemarks: new FormControl({value: '', disabled: !this.isEditable}, [Validators.nullValidator]),
      }),
      poRequiredDetails: new FormGroup({
        poRequired: new FormControl({value: false, disabled: !this.isEditable},[Validators.nullValidator]),
        poRequiredHoldRemarks: new FormControl({value: '', disabled: !this.isEditable}, [Validators.nullValidator]),
      }),
    });


    if(this.isPORequired){
      this.steps = [
        {
          label: 'Customer Delay',
          isValid: this.isStepValid,
          validate: this.shouldValidate,
          icon: '',
        },
        {
          label: 'Other Reasons',
          isValid: this.isStepValid,
          validate: this.shouldValidate,
          icon: '',
        },
        {
          label: 'Parts Required',
          isValid: this.isStepValid,
          validate: this.shouldValidate,
          icon: '',
        },
        {
          label: 'PO Required',
          isValid: this.isStepValid,
          validate: this.shouldValidate,
          icon: '',
        }
      ];
    }

    this.patchFormValues();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  onStepSelect(event: any): void{
    this.ngOnInit();
  }

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  public next(): void {
    if (this.currentGroup.valid && this.currentStep !== this.steps.length) {
      this.currentStep += 1;
      return;
    }
    this.currentGroup.markAllAsTouched();
    this.stepper.validateSteps();
  }

  public prev(): void {
    this.currentStep -= 1;
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.callHoldForm.controls).map(
      groupName => this.callHoldForm.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }

  patchFormValues(){
    this.callHoldForm.patchValue({
      customerDelayDetails: {
        leDelay: this.srlcDetails[0].isCustomerDelay? this.srlcDetails[0].isCustomerDelay: false,
        leDelayRecoverDate: this.srlcDetails[0].expCustomerDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].expCustomerDate): null,
        leDelayHoldRemarks: this.srlcDetails[0].mainTaskEngrResponse? this.srlcDetails[0].mainTaskEngrResponse: ''
      },
      otherReasonsDetails: {
        otherReasons: this.srlcDetails[0].isOtherReason? this.srlcDetails[0].isOtherReason: false,
        otherReasonsRecoveryDate: this.srlcDetails[0].expDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].expDate): null,
        otherReasonHoldRemarks: this.srlcDetails[0].mainTaskEngrResponse? this.srlcDetails[0].mainTaskEngrResponse: ''
      },
      partsRequiredDetails: {
        partsRequired: this.srlcDetails[0].isPartsRequired? this.srlcDetails[0].isPartsRequired: false,
        partsRequiredHoldRemarks: this.srlcDetails[0].mainTaskEngrResponse? this.srlcDetails[0].mainTaskEngrResponse: this.srlcDetails[0].callCategory?.toLowerCase() == 'noncontract svc'? 
        'Parts request created for non contract service call.' : 'Parts required'
      },
      poRequiredDetails: {
        poRequired: this.srlcDetails[0].isPORequired? this.srlcDetails[0].isPORequired: false ,
        poRequiredHoldRemarks: this.srlcDetails[0].mainTaskEngrResponse? this.srlcDetails[0].mainTaskEngrResponse: ''
      }
    });    
  }

  submit(){
    this.loaderService.showLoader();
    this.loaderMessage = 'Submitting Call Hold Details...';
    this.serviceCalendarService.assignCallActionParams(this.srlcDetails[0]);
    const formValue = this.callHoldForm.getRawValue();
    if(this.callHoldForm.valid){
      //Customer delay
      this.serviceCalendarService.callActionDetails.IsCustomerDelay = formValue.customerDelayDetails.leDelay;
      this.serviceCalendarService.callActionDetails.ExpCustomerDate = formValue.customerDelayDetails.leDelay? formValue.customerDelayDetails.leDelayRecoverDate: null;
      if(formValue.customerDelayDetails.leDelay)
        this.serviceCalendarService.callActionDetails.Remarks = formValue.customerDelayDetails.leDelayHoldRemarks;
      //Other reasons
      this.serviceCalendarService.callActionDetails.IsOtherReason = formValue.otherReasonsDetails.otherReasons;
      this.serviceCalendarService.callActionDetails.ExpDate = formValue.otherReasonsDetails.otherReasons? formValue.otherReasonsDetails.otherReasonsRecoveryDate: null;
      if(formValue.customerDelayDetails.otherReasons)
        this.serviceCalendarService.callActionDetails.Remarks = formValue.otherReasonsDetails.otherReasonHoldRemarks;
      //Parts required
      this.serviceCalendarService.callActionDetails.IsPartsRequired = formValue.partsRequiredDetails.partsRequired;
      if(formValue.customerDelayDetails.partsRequired)
        this.serviceCalendarService.callActionDetails.Remarks = formValue.partsRequiredDetails.partsRequiredHoldRemarks;
      //PO required
      this.serviceCalendarService.callActionDetails.IsPORequired = formValue.partsRequiredDetails.poRequired;
      if(formValue.customerDelayDetails.poRequired)
        this.serviceCalendarService.callActionDetails.Remarks = formValue.partsRequiredDetails.poRequiredHoldRemarks;
      //Submit API
      this.serviceCalendarService.postCallAction(this.serviceCalendarService.callActionDetails).subscribe((data: any) =>{
        this.loaderService.hideLoader();
        this.loaderMessage = 'Loading Call Hold Details...';
        if (data) {
          const notificationMessage = data.outPut;
          const notificationType = data.outPut.indexOf('Success') !== -1 ? 'success' : 'error';
          this.notificationService.showNotification(
            notificationMessage,
            notificationType,
            'center',
            'bottom'
          );
          if(notificationType == 'success'){
            this.router.navigate([AppRoutePaths.ServiceCalendar]);
          }
        }
      },
      error => {
        this.loaderService.hideLoader();
        this.loaderMessage = 'Loading Call Hold Details...';
        this.notificationService.showNotification(
          'Call hold unsuccessful ' + error,
          'error', 
          'center', 
          'bottom'
        );
      });  
    }
    else{
      this.callHoldForm.markAllAsTouched();
    }
    this.loaderService.hideLoader();
    this.loaderMessage = 'Loading Call Hold Details...';
  }

  onBackClickHandle() {
    this.serviceCalendarService.delayRemarks = "";
    this.widgetSelected.emit();
  }
}