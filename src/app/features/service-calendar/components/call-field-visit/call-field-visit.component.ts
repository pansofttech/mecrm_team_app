import { Component, Input, Output, OnDestroy, OnInit, ViewChild, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcGetSRLCDetails } from '../../service-calendar.service';

@Component({
  selector: 'app-call-field-visit',
  templateUrl: './call-field-visit.component.html',
  styleUrl: './call-field-visit.component.scss'
})
export class CallFieldVisitComponent implements OnInit, OnDestroy {
  private popstateSubscription?: Subscription;
  showAPILoader = false;
  loaderMessage: string = 'Loading Field Visit Details...';
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  @Output() widgetSelected: EventEmitter<void> = new EventEmitter<void>();
  isEditable: boolean = false;
  callFieldVisitForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private router: Router,
    private notificationService: NotificationService,
    private commonService: CommonService,
    public serviceCalendarService: ServiceCalendarService,
  ) {}

  ngOnInit(): void {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();

    this.isEditable = this.srlcDetails[0].srStatus?.toLowerCase() == "in_progress";
    this.callFieldVisitForm = new FormGroup({
      fieldVisitRemarks: new FormControl({value: false, disabled: !this.isEditable}, Validators.nullValidator)
    });
    this.patchFormValues();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  patchFormValues(){
    this.callFieldVisitForm.patchValue({
      fieldVisitRemarks: this.srlcDetails[0].srStatusID == 5? this.srlcDetails[0].mainTaskEngrResponse: '',
    });
  }

  submit(){
    this.loaderService.showLoader();
    this.loaderMessage = 'Submitting Field Visit Details...';
    this.serviceCalendarService.assignCallActionParams(this.srlcDetails[0]);
    const formValue = this.callFieldVisitForm.getRawValue();
    if(this.callFieldVisitForm.valid){
      //Field visit params
      this.serviceCalendarService.callActionDetails.IsExpertiseRequirement = true;
      this.serviceCalendarService.callActionDetails.Remarks =  formValue.fieldVisitRemarks;
      //Submit API
      this.serviceCalendarService.postCallAction(this.serviceCalendarService.callActionDetails).subscribe((data: any) =>{
        this.loaderService.hideLoader();
        this.loaderMessage = 'Loading Field Visit Details...';
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
        this.loaderMessage = 'Loading Field Visit Details...';
        this.notificationService.showNotification(
          'Call completion unsuccessful' + error,
          'error', 
          'center', 
          'bottom'
        );
      });     
    }
    else{
      this.callFieldVisitForm.markAllAsTouched();
    }
    this.loaderService.hideLoader();
    this.loaderMessage = 'Loading Field Visit Details...';
  }

  async startListeningFieldVisitRemarks() {
    await this.commonService.startListeningAndPatch(this.callFieldVisitForm, 'fieldVisitRemarks')
  }

  async getGeoCoords() {
    var coordinates = await this.commonService.getCurrentLocation();
    var addRes: any = await this.commonService.getAddress(coordinates[0], coordinates[1]);
    const address = (coordinates[0] !=0 && coordinates[1] != 0)? addRes.display_name: '';

    this.callFieldVisitForm.patchValue({
      fieldVisitRemarks: '\n Geo-coordinates : ' +coordinates[0]+ ' , ' +coordinates[1] + '\n Address : ' +address,
    });
  }

  onBackClickHandle() {
    this.widgetSelected.emit();
  }
}