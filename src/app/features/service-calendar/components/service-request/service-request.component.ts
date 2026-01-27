import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcDependentComboData, svcGetSRLCDetails, svcPrerequisites } from '../../service-calendar.service';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrl: './service-request.component.scss'
})
export class ServiceRequestComponent implements OnInit{
  @Input() srid: number = 0;
  showAPILoader = false;
  dependantComboDataForContactName: svcDependentComboData[] = [];
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  EmailError: string = 'Customer contact email is required'
  serviceRequestDetails!: FormGroup;
  isCustContactConfirmed: boolean = false;
  isIBConfirmed: boolean = false;
  isIBConfirmEnabled: boolean = false;
  isSaveDisabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    public commonService: CommonService,
    private serviceCalendarService: ServiceCalendarService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.isCustContactConfirmed = this.srlcDetails[0].isContactConfirmed? this.srlcDetails[0].isContactConfirmed: false;
    this.isIBConfirmed = this.srlcDetails[0].isIBConfirmed? this.srlcDetails[0].isIBConfirmed: false;
    this.isIBConfirmEnabled = this.isIBConfirmed == false && this.srlcDetails[0].callType?.toLowerCase() == 'service' &&
                              this.srlcDetails[0].srStatusID != this.serviceCalendarService.SRCompletedStatus && this.srlcDetails[0].srStatusID != this.serviceCalendarService.SRClosedStatus &&
                              ((this.srlcDetails[0].poType == '' || this.srlcDetails[0].poType == null) 
                              || (this.srlcDetails[0].poType != '' && this.srlcDetails[0].poType != null && this.srlcDetails[0].poType.toLowerCase() != "wait for po" && this.srlcDetails[0].poType.toLowerCase() != "po available")) 
    
    this.serviceRequestDetails = new FormGroup({
      contactConfirmCheckbox: new FormControl(false, Validators.nullValidator),
      contactName: new FormControl({value: '', disabled: false}, Validators.nullValidator),
      contactEmail: new FormControl({value: '', disabled: true}, Validators.nullValidator),
      yesConfirmIB: new FormControl({value: false, disabled: !(this.isIBConfirmEnabled)}, Validators.nullValidator),
      noConfirmIB: new FormControl({value: false, disabled: !(this.isIBConfirmEnabled)}, Validators.nullValidator),
      callDescription: new FormControl(false, Validators.nullValidator),
    });
    this.getPrerequisiteCombo();
    this.serviceRequestDetails.get('contactName')?.valueChanges.subscribe((value: number) => {
      this.getCustContactById(value);
    });

    this.serviceRequestDetails.patchValue({
      contactConfirmCheckbox: this.srlcDetails[0].isContactConfirmed? this.srlcDetails[0].isContactConfirmed: false,
      contactName: this.srlcDetails[0].contactPersonId? this.srlcDetails[0].contactPersonId: null,
      contactEmail: this.srlcDetails[0].contactPerson? this.srlcDetails[0].contactPerson: '',
      yesConfirmIB: this.isIBConfirmed? true: false,
      // noConfirmIB: this.isIBConfirmed ? false: true,
      callDescription: this.srlcDetails[0].callDescription? this.srlcDetails[0].callDescription: '',
    });

    this.serviceRequestDetails.get('yesConfirmIB')?.valueChanges.subscribe((isChecked: boolean) => {
      if (isChecked) {
        this.serviceRequestDetails.get('noConfirmIB')?.setValue(false, { emitEvent: false });
      } else {
        this.serviceRequestDetails.get('noConfirmIB')?.setValue(true, { emitEvent: false });
        this.serviceRequestDetails.get('yesConfirmIB')?.setValue(false, { emitEvent: false });
      }
    });
 
    this.serviceRequestDetails.get('noConfirmIB')?.valueChanges.subscribe((isChecked: boolean) => {
      if (isChecked) {
        this.serviceRequestDetails.get('yesConfirmIB')?.setValue(false, { emitEvent: false });
      } else {
        this.serviceRequestDetails.get('yesConfirmIB')?.setValue(true, { emitEvent: false });
        this.serviceRequestDetails.get('noConfirmIB')?.setValue(false, { emitEvent: false });
      }
    });

    this.isSaveDisabled = (this.srlcDetails[0].srStatusID == this.serviceCalendarService.SRWaitingStatus);
  }

  getPrerequisiteCombo(){
    this.serviceCalendarService.getDependentComboDataOnLoad(this.srid, this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForContactName = data.filter(
        (item: any) => item.comboType === 'SiteContactData'
      );
    });
  }

  getCustContactById(ContactId: number){
    this.serviceCalendarService.getCustContactById(ContactId, this.loginService.employeeId as number).subscribe((data: any) =>{
      if(data){
        this.serviceRequestDetails.patchValue({
          contactEmail: data[0].emailId,
        });
      }
    },
    error =>{
        this.EmailError = "Customer Email doesn't exist please check the desktop version"
    })
  }

  submit(){
    if (this.serviceRequestDetails.valid) {
      const formValue = this.serviceRequestDetails.getRawValue();
      if (formValue) {
        this.loaderService.showLoader();
        this.serviceCalendarService.postServiceRequest(
          this.srid,
          formValue.contactName,
          formValue.contactEmail,
          formValue.contactConfirmCheckbox,
          formValue.callDescription,
          formValue.yesConfirmIB? formValue.yesConfirmIB: false
        ).subscribe((data: any) => {
            this.loaderService.hideLoader();
            const notificationMessage = data.outPut;
            const notificationType = data.outPut.indexOf('Success') !== -1 ? 'success' : 'error';
            this.notificationService.showNotification(
              notificationMessage,
              notificationType,
              'center',
              'bottom'
            );
            if (notificationType == 'success') {
              //this.router.navigate([AppRoutePaths.ServiceCalendar]);
              // this.router.navigate([AppRoutePaths.SRLC],{state: {id: this.serviceCalendarService.selectedSRID, date: this.commonService.displayDateFormat(this.serviceCalendarService.selectedDate)}});
            
              this.router.navigateByUrl(AppRoutePaths.ServiceCalendar, { skipLocationChange: true }).then(() => {
                this.router.navigate([AppRoutePaths.SRLC],{state: {id: this.serviceCalendarService.selectedSRID, date: this.commonService.displayDateFormat(this.serviceCalendarService.selectedDate)}});
              });

            }
          },
            error => {
              this.loaderService.hideLoader();
              this.notificationService.showNotification(
                'Unsuccessful' + error,
                'error', 'center', 'bottom'
              );
            });
      }

    } else {
      this.serviceRequestDetails.markAllAsTouched();
    }
  }

  onBackClickHandle(){
    this.serviceCalendarService.resetValues();
    this.router.navigate([AppRoutePaths.ServiceCalendar]);
  }

}
