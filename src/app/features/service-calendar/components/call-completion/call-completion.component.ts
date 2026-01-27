import { Component, Input, Output, OnDestroy, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, 
         ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FileInfo } from "@progress/kendo-angular-upload";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcPrerequisites, engEffortsList, svcGetOtherTasksDetails, svcGetSRLCDetails, svcIBModuleDetails } from '../../service-calendar.service';

@Component({
  selector: 'app-call-completion',
  templateUrl: './call-completion.component.html',
  styleUrl: './call-completion.component.scss'
})
export class CallCompletionComponent implements OnInit, OnDestroy{
  private popstateSubscription?: Subscription;
  showAPILoader = false;
  loaderMessage: string = 'Loading Call Completion...';
  public currentStep = 0;
  invalid = false;
  @ViewChild('stepper', { static: true })
  public stepper!: StepperComponent;
  isEditable: boolean = false;
  isOtherTaskDetailsValid: boolean = false;
  isInstallationCall: boolean = false;
  isContractSVCCall: boolean = false;
  isCustContactConfirmed: boolean = true;
  isInnerScreen: boolean = false;
  engeffortListCards: engEffortsList[] = [];
  IBStickerAttachment: Array<FileInfo> = [];
  CSRAttachment: Array<FileInfo> = [];

  @Input() srid: number = 0;
  @Input() servicePrerequisites: svcPrerequisites[] = [];
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  @Input() moduleDetails: svcIBModuleDetails[] = [];
  @Input() otherTasksDetails: svcGetOtherTasksDetails[] = [];
  @Output() widgetSelected: EventEmitter<void> = new EventEmitter<void>();
  @Output() moduleDetailsCardChange: EventEmitter<svcIBModuleDetails[]> = new EventEmitter<svcIBModuleDetails[]>();

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid || this.currentGroup.untouched;
  };

  private shouldValidate = (index: number): boolean => {
    return this.getGroupAt(index)?.touched && this.currentStep >= index;
  };

  validateModules(moduleDetails: svcIBModuleDetails[]): boolean {
    const dummyControl = this.callCompletionForm.get('moduleDetails.dummyModuleControl');
  
    if (!moduleDetails || moduleDetails.length === 0) {
      dummyControl?.setValidators(null);
      dummyControl?.updateValueAndValidity();
      return true;
    }
  
    const isValid = moduleDetails.every(item => 
      item.modelNo !== null && item.modelNo!.trim().length > 0 &&
      item.serialNo !== null && item.serialNo!.trim().length > 0
    );
  
    if (isValid) {
      dummyControl?.setValidators(null);
      dummyControl?.updateValueAndValidity();
    } else {
      dummyControl?.setValidators([Validators.required]);
      dummyControl?.updateValueAndValidity();
      dummyControl?.markAsTouched();
    }
  
    dummyControl?.updateValueAndValidity();
    return isValid;
  }

  updateModuleDetailsCard(updatedList: svcIBModuleDetails[]) {
    this.moduleDetailsCardChange.emit(updatedList);
  }

  validateOtherTasks(otherTasksDetails: svcGetOtherTasksDetails[]): boolean {
    const dummyControl = this.callCompletionForm.get('otherDetails.dummyOtherTaskControl');
  
    if (!otherTasksDetails || otherTasksDetails.length === 0 || this.srlcDetails[0].srStatusID == this.serviceCalendarService.SRCompletedStatus) {
      dummyControl?.setValidators(null);
      dummyControl?.updateValueAndValidity();
      return true;
    }
  
    const isValid = otherTasksDetails.every(item => 
      (item.exceptional === true && item.expectedCompletionDate !== null && item.expectedCompletionDate) || 
      (item.exceptional !== true && item.completedDate !== null && item.completedDate)
    );
  
    if (isValid) {
      dummyControl?.setValidators(null);
      dummyControl?.updateValueAndValidity();
    } else {
      dummyControl?.setValidators([Validators.required]);
      dummyControl?.updateValueAndValidity();
      dummyControl?.markAsTouched();
    }
  
    dummyControl?.updateValueAndValidity();
    return isValid;
  }

  public steps = [
    {
      label: 'Completion Details',
      isValid: (index: number) => this.isStepValid(index),
      validate: (index: number) => this.shouldValidate(index),
      icon: '',
    },
    {
      label: 'Installation Details',
      isValid: (index: number) => this.isStepValid(index),
      validate: (index: number) => this.shouldValidate(index),
      icon: '',
    },
    {
      label: 'Systematization Details',
      isValid: (index: number) => this.isStepValid(index),
      validate: (index: number) => this.shouldValidate(index),
      icon: '',
    },
    {
      label: 'Module Details',
      isValid: (index: number) => this.isStepValid(index),
      validate: (index: number) => this.shouldValidate(index),
      icon: '',
    },
    {
      label: 'Other Details',
      isValid: (index: number) => this.isStepValid(index),
      validate: (index: number) => this.shouldValidate(index),
      icon: '',
    },
  ];
  current: any;

  callCompletionForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private router: Router,
    private notificationService: NotificationService,
    public loginService: LoginService,
    public serviceCalendarService: ServiceCalendarService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.callCompletionValidator();
    this.isEditable = this.srlcDetails[0].srStatus?.toLowerCase() == "in_progress" && this.srlcDetails[0].callCategory?.toLowerCase() == "install";
    this.callCompletionForm = this.formBuilder.group({
      completionDetails: new FormGroup({
        completedCheckBox: new FormControl({value: false, disabled: (this.srlcDetails[0].srStatus?.toLowerCase() == "completed")}, Validators.nullValidator),
        completedDate: new FormControl({value:'', disabled: true}, Validators.nullValidator),
        calibrationCheckBox: new FormControl({value:false, disabled: this.isInstallationCall}, Validators.nullValidator),
        oqpvCheckBox: new FormControl({value: false, disabled: this.isInstallationCall}, Validators.nullValidator),
        bdServiceCheckBox: new FormControl({value: false, disabled: this.isInstallationCall}, Validators.nullValidator),
        pmCheckBox: new FormControl({value: false, disabled: this.isInstallationCall}, Validators.nullValidator),
        otherCalls: new FormControl({value: '', disabled: !this.isContractSVCCall}, Validators.nullValidator),
        resolutionType: new FormControl({value:'', disabled: this.isInstallationCall}, this.isInstallationCall? Validators.nullValidator: [Validators.required]),
        awaitingCSR: new FormControl(false, Validators.nullValidator),
        CSR: new FormControl('', Validators.nullValidator),
        csrAttachment: new FormControl({value: '', disabled: false}, [Validators.nullValidator]),
        csrRemarks: new FormControl('', this.servicePrerequisites[0].isQuoteClosePrv? Validators.required: Validators.nullValidator),
      }),
      installationDetails: new FormGroup({
        productSerialNo: new FormControl({value: '', disabled: !this.isEditable},  Validators.required),
        sapNo: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
        productCategory: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        leTag: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
        location: new FormControl({value: '', disabled: !this.isEditable},  Validators.required),
        principalWarrantyStart: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
        principalWarrantyEnd: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
        clientWarrantyStart: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
        clientWarrantyEnd: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
        ibStickerStatus: new FormControl({value: '', disabled: false}, Validators.nullValidator),
        ibStickerAttachment: new FormControl({value: '', disabled: true}, [Validators.nullValidator]),
      }),
      systematizationDetails: new FormGroup({
        systemHandle: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        classification: new FormControl({value: '', disabled: !this.isEditable}, Validators.required),
        manufacturer: new FormControl({value: '', disabled: true}, Validators.nullValidator),
        installbaseProduct: new FormControl({value: '', disabled: !this.isEditable}, Validators.nullValidator),
        applicationCode: new FormControl({value: '', disabled: !this.isEditable}, Validators.required),
        complexity: new FormControl({value: '', disabled: !this.isEditable}, Validators.required)
      }),
      moduleDetails: new FormGroup({
        dummyModuleControl: new FormControl('', Validators.nullValidator)
      }),
      otherDetails: new FormGroup({
        dummyOtherTaskControl: new FormControl('', Validators.nullValidator)
      }),
      surveyDetails: new FormGroup({
        contactConfirmCheckbox: new FormControl(false, Validators.nullValidator),
        contactName: new FormControl({value: '', disabled: this.isCustContactConfirmed}, Validators.nullValidator),
        contactEmail: new FormControl({value: '', disabled: true}, Validators.nullValidator),
      })
    });
    this.surveyValidator();
    this.patchFormValues();
    this.getIBStickerAttachmentDetails(this.srlcDetails[0].installBaseID as unknown as string);
    this.getCSRAttachmentDetails(this.srid as unknown as string);
  }

  checkboxRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value === true ? null : { required: true };
    };
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

  // public next(): void {
  //   if (this.currentGroup.valid && this.currentStep !== this.steps.length) {
  //     this.currentStep += 1;
  //     return;
  //   }
  //   this.currentGroup.markAllAsTouched();
  //   this.stepper.validateSteps();
  // }

  public next(): void {
    const contentContainer = document.querySelector('.app-scrollable--container');
    if (contentContainer) {
      contentContainer.scrollTop = 0;
    }
    
    const group = this.currentGroup;
    const groupdisabled = group.disabled;
    const originalDisabledState = new Map<string, boolean>();
    if (groupdisabled) {
      group.enable();
    }

    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (control?.disabled) {
        originalDisabledState.set(key, true);
        control.enable();
      }
    });

    if (group.valid && this.currentStep !== this.steps.length) {
      this.currentStep += 1;
      originalDisabledState.forEach((wasDisabled, key) => {
        if (wasDisabled) {
          group.get(key)?.disable();
        }
      });
      if (groupdisabled) {
        group.disable();
      }
      return;
    }

    originalDisabledState.forEach((wasDisabled, key) => {
      if (wasDisabled) {
        group.get(key)?.disable();
      }
    });
    if (groupdisabled) {
      group.disable();
    }
    group.markAllAsTouched();
    this.stepper.validateSteps();
  }
  
  public prev(): void {
    this.currentStep -= 1;
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.callCompletionForm.controls).map(
      groupName => this.callCompletionForm.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }

  getIBStickerAttachmentDetails(srcId: string){
    this.commonService.getAttachmentDetails(srcId, this.commonService.docIBStickerAttachment, "").subscribe((data: any) => {
      if(data!=null){
        this.IBStickerAttachment = data;
      }
    });
  }

  getCSRAttachmentDetails(srcId: string){
    this.commonService.getAttachmentDetails(srcId, this.commonService.docSrcTypeCSRAttachment, "").subscribe((data: any) => {
      if(data!=null){
        this.CSRAttachment = data;
      }
    });
  }

  patchFormValues(){
    this.callCompletionForm.patchValue({
      completionDetails: {
        completedCheckBox: this.srlcDetails[0].completedDate != null && this.srlcDetails[0].completedDate != "",
        completedDate: this.srlcDetails[0].completedDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].completedDate): null,
        calibrationCheckBox: this.srlcDetails[0].isCalibration,
        oqpvCheckBox: this.srlcDetails[0].isOQPV,
        bdServiceCheckBox: this.srlcDetails[0].isBDService,
        pmCheckBox: this.srlcDetails[0].isPreventiveMaintenance,
        otherCalls: this.srlcDetails[0].otherCallsId? this.srlcDetails[0].otherCallsId: null,
        resolutionType: this.srlcDetails[0].resolutionTypeId? this.srlcDetails[0].resolutionTypeId: null,
        awaitingCSR: this.srlcDetails[0].awaitingCSR,
        csrRemarks: this.srlcDetails[0].csrRemarks == null? '': this.srlcDetails[0].csrRemarks
      },
      installationDetails: {
        productSerialNo: this.srlcDetails[0].serialNumber? this.srlcDetails[0].serialNumber: '',
        sapNo: this.srlcDetails[0].sapNo? this.srlcDetails[0].sapNo: '',
        productCategory: this.srlcDetails[0].productCategory? this.srlcDetails[0].productCategory: '',
        leTag: this.srlcDetails[0].customerTagNo? this.srlcDetails[0].customerTagNo: '',
        location: this.srlcDetails[0].custSiteLocation? this.srlcDetails[0].custSiteLocation: '',
        principalWarrantyStart: this.srlcDetails[0].warrantyStartDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].warrantyStartDate): null,
        principalWarrantyEnd: this.srlcDetails[0].warrantyFinishDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].warrantyFinishDate): null,
        clientWarrantyStart: this.srlcDetails[0].extendedWarStartDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].extendedWarStartDate): null,
        clientWarrantyEnd: this.srlcDetails[0].extendedWarEndDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].extendedWarEndDate): null,
        ibStickerStatus: this.srlcDetails[0].stickerStatusID? this.srlcDetails[0].stickerStatusID: this.serviceCalendarService.ibStickerPendingStatus
      },
      systematizationDetails: {
        systemHandle: this.srlcDetails[0].systemHandle? this.srlcDetails[0].systemHandle: '',
        classification: this.srlcDetails[0].prodClassificationId? this.srlcDetails[0].prodClassificationId: null,
        manufacturer: this.srlcDetails[0].manufacturer? this.srlcDetails[0].manufacturer: '',
        installbaseProduct: this.srlcDetails[0].productID? this.srlcDetails[0].productID: null,
        applicationCode: this.srlcDetails[0].applicationId? this.srlcDetails[0].applicationId: null,
        complexity: this.srlcDetails[0].complexityId? this.srlcDetails[0].complexityId: null
      },
      surveyDetails: {
        contactName: this.srlcDetails[0].contactPersonId? this.srlcDetails[0].contactPersonId: null,
        contactEmail: this.srlcDetails[0].contactPerson? this.srlcDetails[0].contactPerson: '',
      }
    });    
  }

  callCompletionValidator(){
    this.isInstallationCall = this.srlcDetails[0].callCategory? this.srlcDetails[0].callCategory.toLowerCase() == "install" : false;
    this.isContractSVCCall = this.srlcDetails[0].callCategory? this.srlcDetails[0].callCategory.toLowerCase() == "contract svc" : false;
    this.isCustContactConfirmed = this.srlcDetails[0].isContactConfirmed? this.srlcDetails[0].isContactConfirmed: false;
    this.serviceCalendarService.isCallCompleted = (this.srlcDetails[0].completedDate != null && this.srlcDetails[0].completedDate != "");
  }

  serviceCallFormValidation(): string{
    const formValue = this.callCompletionForm.getRawValue();

    if(formValue.completionDetails.completedCheckBox && !this.isInstallationCall){
        if(!(formValue.completionDetails.oqpvCheckBox || formValue.completionDetails.bdServiceCheckBox ||
             formValue.completionDetails.calibrationCheckBox || formValue.completionDetails.pmCheckBox)){
              return 'Please select either OQPV, BD, PM or Calibration'         
        }
        else if(formValue.installationDetails.ibStickerStatus == this.serviceCalendarService.ibStickerPendingStatus){
            if(this.servicePrerequisites[0].ibWorkingStatus == 'To Be Installed'){
              return 'Cannot complete the call with pending sticker update status'
            }
            // else if(formValue.installationDetails.ibStickerAttachment.length == 0 && this.IBStickerAttachment.length == 0){
            //   return 'IB sticker attachment is needed'
            // }
            // else if((formValue.installationDetails.ibStickerAttachment.length + this.IBStickerAttachment.length) > 1){
            //   return 'Please change status to image uploaded'
            // }
            else{
              return 'Success'
            }
        }
        else if(formValue.installationDetails.ibStickerStatus == this.serviceCalendarService.ibStickerImageUploadedStatus){
            if(formValue.installationDetails.ibStickerAttachment.length == 0 && this.IBStickerAttachment.length == 0){
              return 'IB sticker attachment is needed'
            }
            else if((formValue.installationDetails.ibStickerAttachment.length + this.IBStickerAttachment.length) > 1){
              return 'Only one sticker can be attached'
            }
            else{
              return 'Success'
            }
        }
        else{
              return 'Success'
        }
    }
    else if(formValue.completionDetails.completedCheckBox && this.isInstallationCall){
      if(this.moduleDetails.length <= 0){
        return 'Please select atleast one module in module details stepper'
      }
      else if(!((formValue.installationDetails.principalWarrantyStart && formValue.installationDetails.principalWarrantyEnd) ||
                (formValue.installationDetails.clientWarrantyStart && formValue.installationDetails.clientWarrantyEnd)))
      {
        return 'Please enter warranty date or client warranty date'
      }
      else if(formValue.installationDetails.ibStickerStatus == this.serviceCalendarService.ibStickerPendingStatus){
        // if(formValue.installationDetails.ibStickerAttachment.length == 0 && this.IBStickerAttachment.length == 0){
        //   return 'IB sticker attachment is needed'
        // }
        // else if((formValue.installationDetails.ibStickerAttachment.length + this.IBStickerAttachment.length) > 1){
        //   return 'Please change status to image uploaded'
        // }
        if(this.servicePrerequisites[0].ibWorkingStatus == 'To Be Installed'){
          return 'Cannot complete the call with pending sticker update status'
        }
        else{
          return 'Success'
        }
      }
      else if(formValue.installationDetails.ibStickerStatus == this.serviceCalendarService.ibStickerImageUploadedStatus){
          if(formValue.installationDetails.ibStickerAttachment.length == 0 && this.IBStickerAttachment.length == 0){
            return 'IB sticker attachment is needed'
          }
          else if((formValue.installationDetails.ibStickerAttachment.length + this.IBStickerAttachment.length) > 1){
            return 'Only one sticker can be attached'
          }
          else{
            return 'Success'
          }
      }
      else{
        return 'Success'
      }
    }
    else{
      return 'Success'
    } 
  }

  surveyValidator(){
    this.serviceCalendarService.isSurveyRequired = (this.srlcDetails[0].isSurveyReq? this.srlcDetails[0].isSurveyReq: false)  && this.serviceCalendarService.isCallCompleted && this.srlcDetails[0].srStatus?.toLowerCase() == "in_progress";
    const surveyControl = this.callCompletionForm.get('surveyDetails.contactConfirmCheckbox');
    if(this.serviceCalendarService.isSurveyRequired){
      this.steps = [
        {
          label: 'Completion Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
        {
          label: 'Installation Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
        {
          label: 'Systematization Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
        {
          label: 'Module Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
        {
          label: 'Other Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
        {
          label: 'Survey Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        }
      ]; 
      surveyControl?.setValidators([this.checkboxRequiredValidator()]);
    }
    else{
      this.steps = [
        {
          label: 'Completion Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
        {
          label: 'Installation Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
        {
          label: 'Systematization Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
        {
          label: 'Module Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
        {
          label: 'Other Details',
          isValid: (index: number) => this.isStepValid(index),
          validate: (index: number) => this.shouldValidate(index),
          icon: '',
        },
      ];
      surveyControl?.clearValidators();
    }
    surveyControl?.updateValueAndValidity();
  }

  async submit(): Promise<void> {
    this.loaderService.showLoader();
    this.loaderMessage = 'Submitting call completion details...';
    this.serviceCalendarService.assignCallActionParams(this.srlcDetails[0]);
    const formValue = this.callCompletionForm.getRawValue();
    const serviceCallValidation = this.serviceCallFormValidation();
    if(serviceCallValidation == 'Success'){
      if(this.callCompletionForm.valid){
        this.serviceCalendarService.getValidateCSR(
          this.srid,
          formValue.completionDetails.awaitingCSR? formValue.completionDetails.awaitingCSR: false,
          formValue.completionDetails.resolutionType? formValue.completionDetails.resolutionType: 0,
          formValue.completionDetails.completedDate? formValue.completionDetails.completedDate: null,
          this.srlcDetails[0].isPartsRequired? this.srlcDetails[0].isPartsRequired: false,
          this.srlcDetails[0].isCustomerDelay? this.srlcDetails[0].isCustomerDelay: false,
          this.srlcDetails[0].isPORequired? this.srlcDetails[0].isPORequired: false,
          this.srlcDetails[0].isOtherReason? this.srlcDetails[0].isOtherReason: false,
          this.srlcDetails[0].isExpertiseRequirement? this.srlcDetails[0].isExpertiseRequirement: false,
          this.servicePrerequisites[0].isQuoteClosePrv? this.servicePrerequisites[0].isQuoteClosePrv: false
        ).subscribe((data: any)=>{
          if(data[0].csrMandatory == 'Success' || formValue.completionDetails.csrAttachment.length > 0){
            this.ValidateEfforts().then((isValid) => {
              if(isValid){
                if (!formValue.completionDetails.awaitingCSR && formValue.completionDetails.completedCheckBox != "" && formValue.completionDetails.completedCheckBox != null
                    && this.srlcDetails[0].isPartsRequired == false && this.srlcDetails[0].isCustomerDelay == false && this.srlcDetails[0].isOtherReason == false && this.srlcDetails[0].isPORequired == false)
                {
                  this.serviceCalendarService.callActionDetails.SubTaskStatusId = this.serviceCalendarService.isSurveyRequired ? 3 : 1;
                }
                else if (this.srlcDetails[0].isPartsRequired == true || this.srlcDetails[0].isCustomerDelay == true || this.srlcDetails[0].isOtherReason == true || this.srlcDetails[0].isPORequired == true) {
                  this.serviceCalendarService.callActionDetails.SubTaskStatusId = 1;
                }
                else {
                  this.serviceCalendarService.callActionDetails.SubTaskStatusId = 1;
                }
          
                //Completion params
                if (this.srlcDetails[0].isPartsRequired == true || this.srlcDetails[0].isCustomerDelay == true || this.srlcDetails[0].isOtherReason == true || this.srlcDetails[0].isPORequired == true)
                  this.serviceCalendarService.callActionDetails.CompletedOn = null;
                else
                  this.serviceCalendarService.callActionDetails.CompletedOn =  formValue.completionDetails.completedDate? formValue.completionDetails.completedDate: null;
          
                  this.serviceCalendarService.callActionDetails.IsCalibration =  formValue.completionDetails.calibrationCheckBox;
                  this.serviceCalendarService.callActionDetails.IsOQPV =  formValue.completionDetails.oqpvCheckBox;
                  this.serviceCalendarService.callActionDetails.IsBDService =  formValue.completionDetails.bdServiceCheckBox;
                  this.serviceCalendarService.callActionDetails.IsPreventiveMaintenance =  formValue.completionDetails.pmCheckBox;
                  this.serviceCalendarService.callActionDetails.OtherCallsId =  formValue.completionDetails.otherCalls? formValue.completionDetails.otherCalls: 0;
                  this.serviceCalendarService.callActionDetails.ResolutionTypeId =  formValue.completionDetails.resolutionType? formValue.completionDetails.resolutionType: 0;
                  this.serviceCalendarService.callActionDetails.AwaitingCSR =  formValue.completionDetails.awaitingCSR;
                  this.serviceCalendarService.callActionDetails.CSRAttachment = formValue.completionDetails.csrAttachment? formValue.completionDetails.csrAttachment: null;
                  this.serviceCalendarService.callActionDetails.CSRRemarks =  formValue.completionDetails.csrRemarks;
                //Installation params
                  this.serviceCalendarService.callActionDetails.SerialNo =  formValue.installationDetails.productSerialNo;
                  this.serviceCalendarService.callActionDetails.SapNo =  formValue.installationDetails.sapNo;
                  this.serviceCalendarService.callActionDetails.CustomerTagNo =  formValue.installationDetails.leTag;
                  this.serviceCalendarService.callActionDetails.Location =  formValue.installationDetails.location;
                  this.serviceCalendarService.callActionDetails.WarrantyStartDate =  formValue.installationDetails.principalWarrantyStart;
                  this.serviceCalendarService.callActionDetails.WarrantyFinishDate =  formValue.installationDetails.principalWarrantyEnd;
                  this.serviceCalendarService.callActionDetails.ExtendedWarStartDate =  formValue.installationDetails.clientWarrantyStart;
                  this.serviceCalendarService.callActionDetails.ExtendedWarEndDate =  formValue.installationDetails.clientWarrantyEnd;
                  this.serviceCalendarService.callActionDetails.StickerStatusId = formValue.installationDetails.ibStickerStatus? formValue.installationDetails.ibStickerStatus: this.serviceCalendarService.ibStickerPendingStatus;
                  this.serviceCalendarService.callActionDetails.IBStickerAttachment = formValue.installationDetails.ibStickerAttachment? formValue.installationDetails.ibStickerAttachment: null;
                //Systematization params
                  this.serviceCalendarService.callActionDetails.ProdClassificationId =  formValue.systematizationDetails.classification;
                  this.serviceCalendarService.callActionDetails.ModProductId =  formValue.systematizationDetails.installbaseProduct;
                  this.serviceCalendarService.callActionDetails.ApplicationId =  formValue.systematizationDetails.applicationCode;
                  this.serviceCalendarService.callActionDetails.ComplexityId =  formValue.systematizationDetails.complexity;
                //Module Details
                  this.serviceCalendarService.callActionDetails.InstallbasemoduleDetails = this.moduleDetails 
                //Other Details
                  this.serviceCalendarService.callActionDetails.LstOtherSubTask = this.otherTasksDetails  
                //Survey params
                  if(this.serviceCalendarService.isSurveyRequired){
                    // if(formValue.surveyDetails.contactConfirmCheckbox){
                    //   this.serviceCalendarService.callActionDetails.IsFromSurvey = true;
                    //   this.serviceCalendarService.callActionDetails.IsStatusChangeRequired = true;
                    // }
                    this.serviceCalendarService.callActionDetails.IsFromSurvey = formValue.surveyDetails.contactConfirmCheckbox;
                    this.serviceCalendarService.callActionDetails.IsStatusChangeRequired = formValue.surveyDetails.contactConfirmCheckbox;
                  }
                  if(!this.serviceCalendarService.isSurveyRequired && this.serviceCalendarService.isCallCompleted){
                    this.serviceCalendarService.callActionDetails.IsStatusChangeRequired = true;
                  }
          
                //Submit API
                  this.serviceCalendarService.postCallAction(this.serviceCalendarService.callActionDetails).subscribe((data: any) =>{
                    this.loaderService.hideLoader();
                    this.loaderMessage = 'Loading Call Completion...';
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
                        this.resetValues();
                        this.router.navigate([AppRoutePaths.ServiceCalendar]);
                      }
                    }
                  },
                  error => {
                    this.loaderService.hideLoader();
                    this.loaderMessage = 'Loading Call Completion Details...';
                    this.notificationService.showNotification(
                      'Call completion unsuccessful' + error,
                      'error', 
                      'center', 
                      'bottom'
                    );
                  });
              }
              else{
                this.notificationService.showNotification(
                  'Please fill engineer effort log',
                  'error',
                  'center',
                  'bottom'
                );
              }
            });         
          }
          else{
            this.notificationService.showNotification(
              data[0].csrMandatory,
              'error',
              'center',
              'bottom'
            );
          }
        },
        error =>{
          this.loaderService.hideLoader();
          this.loaderMessage = 'Loading Call Completion Details...';
          this.notificationService.showNotification(
            'CSR Copy is mandatory',
            'error', 
            'center', 
            'bottom'
          );
        });     
      }
      else{
        this.callCompletionForm.markAllAsTouched();
      }
    }
    else{
      this.notificationService.showNotification(
        serviceCallValidation,
        'error',
        'center',
        'bottom'
      );
    }
    this.loaderService.hideLoader();
    this.loaderMessage = 'Loading Call Completion Details...';
  }

  ValidateEfforts(): Promise<boolean>{
    return new Promise((resolve) => {
    const mainSubTaskId = 
    this.srlcDetails[0].callCategory == 'Install' && this.srlcDetails[0].srStatusID == this.serviceCalendarService.SRStatusId? this.serviceCalendarService.SRSubTaskId:
    this.srlcDetails[0].callCategory == 'Install'? this.serviceCalendarService.InstallationSubTaskId:
    this.srlcDetails[0].callCategory != 'Install'? this.serviceCalendarService.FieldServiceSubTaskId: this.serviceCalendarService.FieldServiceSubTaskId;

    this.serviceCalendarService.getEngEfforts(this.loginService.employeeId as number, this.srid).subscribe((data: any) => {
      this.engeffortListCards = data.filter((item: any) =>{
        return  item.isPrimary == true &&
                item.subTaskId == mainSubTaskId &&
                item.empId == this.loginService.employeeId as number &&
                item.remarks != '' &&
                item.remarks != null &&
                ((item.startTime != '' && item.startTime != null && item.endTime != '' && item.endTime != null) || 
                (item.travelHours != '' && item.travelHours != null) ||
                (item.effortHours != '' && item.effortHours != null) ||
                item.isNoEffortSpent == true)
                });
      resolve(this.engeffortListCards.length > 0);
    },
    () => {
      resolve(false);
    });
    });
  }

  hideShowFooter(value: boolean){
    this.isInnerScreen = value;
  }

  resetValues(){
    this.serviceCalendarService.addedPartsDetailsCard = [];
  }

  onBackClickHandle() {
    this.widgetSelected.emit();
  }
  
}