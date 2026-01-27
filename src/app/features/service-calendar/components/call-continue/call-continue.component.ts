import { Component, Input, Output, OnDestroy, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcGetSRLCDetails } from '../../service-calendar.service';

@Component({
  selector: 'app-call-continue',
  templateUrl: './call-continue.component.html',
  styleUrl: './call-continue.component.scss'
})
export class CallContinueComponent implements OnInit, OnDestroy{
  private popstateSubscription?: Subscription;
  showAPILoader = false;
  loaderMessage: string = 'Loading Call Hold...';
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  @Output() widgetSelected: EventEmitter<void> = new EventEmitter<void>();

  callContinueForm!: FormGroup;

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

    this.callContinueForm = this.formBuilder.group({
      continueDetails: new FormGroup({
         continueRemarks: new FormControl('', Validators.nullValidator),
      })
    });
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  submit(){
    this.loaderService.showLoader();
    this.loaderMessage = 'Submitting Call Continue Details...';
    this.serviceCalendarService.assignCallActionParams(this.srlcDetails[0]);
    //Clear all hold details
      this.serviceCalendarService.callActionDetails.IsCustomerDelay = false;
      this.serviceCalendarService.callActionDetails.ExpCustomerDate =  '';
      this.serviceCalendarService.callActionDetails.IsOtherReason = false;
      this.serviceCalendarService.callActionDetails.ExpDate = '';
      this.serviceCalendarService.callActionDetails.IsPartsRequired = false;
      this.serviceCalendarService.callActionDetails.IsPORequired = false;
      this.serviceCalendarService.callActionDetails.Remarks = ''; //check these 6 statements
      this.serviceCalendarService.callActionDetails.IsInProgress = (this.srlcDetails[0].isPartsRequired? this.srlcDetails[0].isPartsRequired: false) && (this.srlcDetails[0].srStatus?.toLowerCase() == 'in_progress')
    //Submit API
      this.serviceCalendarService.postCallAction(this.serviceCalendarService.callActionDetails).subscribe((data: any) =>{
        this.loaderService.hideLoader();
        this.loaderMessage = 'Loading Call Continue Details...';
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
        this.loaderMessage = 'Loading Call Continue Details...';
        this.notificationService.showNotification(
          'Call continue unsuccessful ' + error,
          'error', 
          'center', 
          'bottom'
        );
      });  
    this.loaderService.hideLoader();
    this.loaderMessage = 'Loading Call Hold Details...';
  }

  onBackClickHandle() {
    this.widgetSelected.emit();
  }
}
