import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EnquiryDetailsService } from '../../enquiry-details.service';
import { CommonService } from 'src/app/features/common/common.service';
import { FormStateService } from '../../form-state.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-enquiry-details-update',
  templateUrl: './enquiry-details-update.component.html',
  styleUrls: ['./enquiry-details-update.component.scss']
})

export class EnquiryDetailsUpdateComponent implements OnInit, OnDestroy {
  private popstateSubscription?: Subscription;
  public currentStep = 3;
  showAPILoader = false;
  invalid = false;
  current: any;
  @ViewChild('stepper', { static: true })
  public stepper!: StepperComponent;
  id!: string | null;
  poExpectedDate: Date = new Date();
  enqId!: string;
  modeOfCommunicationValue = false;
  modeOfCommunicationControl!: FormControl;
  public dealPositionList: Array<string> = [];
  public probabilityList: Array<string> = [];
  public enquiryModeList: Array<string> = [];
  enquiryCaptureForm!: FormGroup;

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid || this.currentGroup.untouched;
  };

  private shouldValidate = (index: number): boolean => {
    return this.getGroupAt(index)?.touched && this.currentStep >= index;
  };
  
  public steps = [
    {
      label: 'Contact Details',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
      icon: '',
    },
    {
      label: 'Enquiry Details',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
      icon: '',
    },
    {
      label: 'Enquiry Description',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
      icon: '',
    },
    {
      label: 'Deal Number',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
      icon: '',
    },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    public enquiryDetailsService: EnquiryDetailsService,
    private router: Router,
    private notificationService: NotificationService,
    private formStateService: FormStateService,
    private commonService : CommonService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state){
      this.id = navigation.extras.state['id'];
    }
  }

  ngOnInit(): void {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();

    this.enquiryCaptureForm = this.formBuilder.group({
      contactDetails: new FormGroup({
        soldToContact: new FormControl('', Validators.required),
        soldToSite: new FormControl('', Validators.required),
        soldToLE: new FormControl(
          { value: '', disabled: true },
          Validators.required
        ),
        region: new FormControl(
          { value: '', disabled: true },
          Validators.required
        ),
      }),
      enquiryDetailsForms: new FormGroup({
        generatedBy: new FormControl(''),
        generatedFrom: new FormControl('', [Validators.required]),
        quoteEntityCompany: new FormControl('', [Validators.required]),
        quoteEntityCurrency: new FormControl('', [Validators.required]),
        salesWorkFlow: new FormControl('', [Validators.required]),
        salesChannel: new FormControl('', [Validators.required]),
        salesExecutive: new FormControl('', [Validators.required]),
      }),
      enquiryDescription: new FormGroup({
        enterDescription: new FormControl('', [Validators.required]),
        attachment: new FormControl('', [Validators.nullValidator]),
      }),
      enquiryUpdateForm: new FormGroup({
        enqId: new FormControl(this.enqId ,Validators.nullValidator),
        poExpectedDate: new FormControl('', Validators.required),
        dealPosition: new FormControl('', Validators.required),
        probability: new FormControl('', Validators.required),
        dealValue: new FormControl('', Validators.required),
        currency: new FormControl('', Validators.required),
        modeOfCommunication: new FormControl('', Validators.nullValidator),
        remarksValue: new FormControl('', Validators.nullValidator),
        interaction_attachment: new FormControl([null], Validators.nullValidator),
      })
    });
    this.modeOfCommunicationControl = this.enquiryCaptureForm.get('enquiryUpdateForm.modeOfCommunication') as FormControl;

    if (this.modeOfCommunicationControl) {
      this.modeOfCommunicationControl.valueChanges.subscribe((modeValue) => {
        this.updateValidatorsBasedOnMode(modeValue);
        this.modeOfCommunicationValue = this.modeOfCommunicationControl.value? true: false;
        this.updateValidatorsBasedOnMode(this.modeOfCommunicationValue);
      });
    }
    this.getEnqdetails();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  private updateValidatorsBasedOnMode(modeValue: any): void {
    const remarksControl = this.enquiryCaptureForm.get('enquiryUpdateForm.remarksValue')!;
    const attachmentControl = this.enquiryCaptureForm.get('enquiryUpdateForm.interaction_attachment')!;
    modeValue? remarksControl.setValidators([Validators.required]) : remarksControl.setValidators(null);
    remarksControl.updateValueAndValidity();
    !this.modeOfCommunicationValue? attachmentControl.disable():attachmentControl.enable();
    this.enquiryCaptureForm.markAllAsTouched();
  }

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  onStepSelect(event: any): void{
    this.ngOnInit();
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

  public submit(): void {
    if (!this.currentGroup.valid) {
      this.currentGroup.markAllAsTouched();
      this.stepper.validateSteps();
    }
    if (this.enquiryCaptureForm.valid) {
      this.loaderService.showLoader();
      this.enquiryDetailsService
        .UpdateEnquiry(this.enquiryCaptureForm.value, this.enqId)
        .subscribe((data: any) => {
          this.loaderService.hideLoader();
          if (data) {
            const notificationMessage = data.outPut;
            const notificationType = data.outPut.indexOf('success') !== -1 ? 'success' : 'error';
            this.notificationService.showNotification(
              notificationMessage,
              notificationType,
              'center',
              'bottom'
            );
          }
          this.router.navigate([AppRoutePaths.EnquiryDetailsListView]);
        },
        error => {
          this.loaderService.hideLoader();;
          this.notificationService.showNotification(
            'Enquiry not  updated' + error,
            'error', 'center', 'bottom'
          );
        });
        this.formStateService.resetValues();
    }
    this.loaderService.hideLoader();
    this.enquiryCaptureForm.markAllAsTouched();
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.enquiryCaptureForm.controls).map(
      groupName => this.enquiryCaptureForm.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }

  filterContactByID(contactID: number): void {
    this.enquiryDetailsService.getSoldToContactsList().subscribe((data: any) => {
      this.formStateService.selectedContact = data.filter(
        (item: any) => item.contactID === contactID
      );
      if (this.formStateService.selectedContact.length > 0) {
        this.formStateService.selectedContact = this.formStateService.selectedContact[0];
      } else {
        this.formStateService.selectedContact = null;
      }
    });
  }
  filterGeneratedFrom(generatedFromID: number): void {
    this.enquiryDetailsService.getgeneratedFrom().subscribe((data: any) => {
      this.formStateService.selectedGeneratedFrom = data.filter(
        (item: any) => item.generatedFromID === generatedFromID
      );
      if (this.formStateService.selectedGeneratedFrom.length > 0) {
        this.formStateService.selectedGeneratedFrom = this.formStateService.selectedGeneratedFrom[0];
      } else {
        this.formStateService.selectedGeneratedFrom = null;
      }
    });
  }
  filterSalesChannelByID(salesChannelID: number): void {
    this.enquiryDetailsService.getsalesChannel().subscribe((data: any) => {
      this.formStateService.selectedSales = data.filter(
        (item: any) => item.salesChannelID === salesChannelID
      );
      if (this.formStateService.selectedSales.length > 0) {
        this.formStateService.selectedSales = this.formStateService.selectedSales[0];
      } else {
        this.formStateService.selectedSales = null;
      }
    });
  }
  filterEntityByID(quoteCompanyID: number): void {
    this.enquiryDetailsService.getquoteEntityCompany().subscribe((data: any) => {
      this.formStateService.selectedCompany = data.filter(
        (item: any) => item.companyID === quoteCompanyID
      );
      if (this.formStateService.selectedCompany.length > 0) {
        this.formStateService.selectedCompany = this.formStateService.selectedCompany[0];
      } else {
        this.formStateService.selectedCompany = null;
      }
    });
  }
  
  getAttachmentDetails(enqID: string){
    this.commonService.getAttachmentDetails(enqID, this.commonService.docSrcTypeAttachment, "").subscribe((data: any) => {
      if(data!=null){
        this.formStateService.attachments = data;
      }
      else{
        this.formStateService.attachments = null;
      }
    });
  }

  getEnqdetails() {
    this.enquiryDetailsService
      .getEnquiryDetails(this.id)
      .subscribe((res: any) => {
        if (this.enquiryCaptureForm.get('enquiryUpdateForm.dealPosition')) {
          this.enqId = res[0].enqID;
          this.formStateService.enqId=this.enqId;
          this.filterContactByID(res[0]?.soldToContactID);
          this.filterGeneratedFrom(res[0]?.generatedFromID);
          this.filterSalesChannelByID(res[0]?.salesWorkflowID);
          this.filterEntityByID(res[0].quoteCompanyID);
          this.enquiryDetailsService.regionId= res[0].regionID;
          this.enquiryDetailsService.leID = res[0].soldToLEID;
          this.enquiryDetailsService.salesExecID = res[0].salesExecutiveID;
          this.enquiryDetailsService.soldToLESiteID = res[0].soldToSite;
          this.getAttachmentDetails(this.enqId);
          this.enquiryCaptureForm.patchValue({
            contactDetails: {
              soldToContact: res[0]?.soldToContactID,
              soldToSite: res[0]?.soldToSiteID,
              soldToLE: res[0]?.soldToLEID,
              region: res[0]?.regionID,
            },
            enquiryDetailsForms: {
              generatedFrom: res[0]?.generatedFromID,
              generatedBy: res[0]?.generatedByID,
              quoteEntityCompany: res[0]?.quoteCompanyID,
              quoteEntityCurrency: res[0]?.quoteCurrencyID,
              salesWorkFlow: res[0]?.salesChannelID,
              salesChannel: res[0]?.salesWorkflowID,
              salesExecutive: res[0]?.salesExecutiveID,
            },
            enquiryDescription: {
              enterDescription: res[0]?.enquiryDescription,
            },
            enquiryUpdateForm: {
              poExpectedDate: new Date(res[0]?.poExpectedDate),
              dealPosition: res[0]?.dealPositionID,
              probability: res[0]?.probabilityID,
              dealValue: res[0]?.dealValue,
              currency: res[0]?.quoteCurrency,
            }
          });
          this.modeOfCommunicationValue = this.modeOfCommunicationControl.value? true: false;
          this.updateValidatorsBasedOnMode(this.modeOfCommunicationValue);
        }
      });
  }

  onBackClickHandle() {
    this.formStateService.resetValues();
    this.router.navigate([AppRoutePaths.EnquiryDetailsListView]);
  }

  onReset() {
    this.enquiryCaptureForm.reset();
    this.getEnqdetails();
    this.enquiryCaptureForm.get('enquiryUpdateForm.modeOfCommunication')?.setValue('');
  }

}

