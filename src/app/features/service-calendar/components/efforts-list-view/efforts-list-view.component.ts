import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService, AttachmentPopupDetails } from 'src/app/features/common/common.service';
import { ServiceCalendarService, engEffortsList, svcPrerequisites, svcGetSRLCDetails } from '../../service-calendar.service';

@Component({
  selector: 'app-efforts-list-view',
  templateUrl: './efforts-list-view.component.html',
  styleUrls: ['./efforts-list-view.component.scss']
})
export class EffortsListViewComponent {
  csrGenerateForm!: FormGroup;
  @Input() servicePrerequisites: svcPrerequisites[] = [];
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  @Input() engeffortListCards: engEffortsList[] = [];
  @Input() filteredEngeffortListCards: engEffortsList[] = [];
  @Input() filteredOtherDaysEngeffortListCards: engEffortsList[] = [];
  @Input() srid: number = 0;
  @Input() currentDate: string = '';
  @Output() srlcRefresh: EventEmitter<void> = new EventEmitter<void>();

  showAPILoader = false;

  otherEngEffortsList: engEffortsList[] = [];
  effortCardDetails!: engEffortsList;
  isEditEffortOpen: boolean = false;
  isOtherEffortsOpen: boolean = false;
  isIBConfirmEnabled: boolean = false;

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
    this.isEditEffortOpen = false;
    this.csrGenerateForm = this.formBuilder.group({
      csrComments: new FormControl(null, this.servicePrerequisites[0]?.isGenerateCSR ? Validators.required : Validators.nullValidator),
      completedCheckBox: new FormControl(false, Validators.nullValidator),
      inProgressCheckBox: new FormControl(false, Validators.nullValidator),
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.csrGenerateForm.patchValue({
      csrComments: this.serviceCalendarService.csrComments ? this.serviceCalendarService.csrComments : null,
      completedCheckBox: this.serviceCalendarService.selectedCallCompletion? true: false,
      inProgressCheckBox: this.serviceCalendarService.selectedCallCompletion? false: true
    });
    this.csrGenerateForm.get('completedCheckBox')?.valueChanges.subscribe((isChecked: boolean) => {
      if (isChecked) {
        this.csrGenerateForm.get('inProgressCheckBox')?.setValue(false, { emitEvent: false });
      } else {
        this.csrGenerateForm.get('inProgressCheckBox')?.setValue(true, { emitEvent: false });
        this.csrGenerateForm.get('completedCheckBox')?.setValue(false, { emitEvent: false });
      }
    });
    this.csrGenerateForm.get('inProgressCheckBox')?.valueChanges.subscribe((isChecked: boolean) => {
      if (isChecked) {
        this.csrGenerateForm.get('completedCheckBox')?.setValue(false, { emitEvent: false });
      } else {
        this.csrGenerateForm.get('completedCheckBox')?.setValue(true, { emitEvent: false });
        this.csrGenerateForm.get('inProgressCheckBox')?.setValue(false, { emitEvent: false });
      }
    });
    this.isIBConfirmEnabled = (this.srlcDetails[0].isIBConfirmed == false && this.srlcDetails[0].callType?.toLowerCase() == 'service' &&
                               this.srlcDetails[0].srStatusID != this.serviceCalendarService.SRCompletedStatus && this.srlcDetails[0].srStatusID != this.serviceCalendarService.SRClosedStatus &&
                              ((this.srlcDetails[0].poType == '' || this.srlcDetails[0].poType == null) 
                              || (this.srlcDetails[0].poType != '' && this.srlcDetails[0].poType != null && this.srlcDetails[0].poType.toLowerCase() != "wait for po" && this.srlcDetails[0].poType.toLowerCase() != "po available"))) 
  }

  iseditable(cardIndex: number, filteredCard: engEffortsList[]): boolean {
    const selectedCard = filteredCard[cardIndex];
    const today = this.datePipe.transform(new Date(), "yyyy-MM-dd")!;
    const srTask = this.engeffortListCards.find(card => card.taskType === "Site Readiness");
    if (selectedCard.isEffortEdit && this.servicePrerequisites[0].isInProgress) {
      // If there is an SR task, it must be completed before allowing other tasks
      if (srTask) {
        if (selectedCard.taskType === 'Site Readiness') {
          if (selectedCard.remarks === null && selectedCard.ondate <= today && this.loginService.employeeId === selectedCard.empId) {
            return true;
          }
          return false;
        }

        if (srTask.remarks === null || srTask.remarks === undefined) {
          return false;
        }
      }

      // Allow editing of other tasks only if there are no PIR or SR tasks, and conditions are met
      if (selectedCard.ondate <= today && this.loginService.employeeId === selectedCard.empId) {
        return true;
      }
      return false;
    }
    return false;
  }

  addEffort(cardIndex: number, filteredCard: engEffortsList[]) {
    if(!this.isIBConfirmEnabled){
      const selectedCard = filteredCard[cardIndex];
      this.otherEngEffortsList = this.engeffortListCards.filter(
        (item: any) => {
          const isSelectedCard = item === selectedCard;
          const hasValidRemarks = item.remarks != null;
          return !isSelectedCard && hasValidRemarks;
        }
      );
      this.effortCardDetails = selectedCard;
      this.isEditEffortOpen = true;
    }
    else{
      this.notificationService.showNotification(
        'Please confirm Installbase in SR Tab',
        'error',
        'center',
        'bottom'
      );
    }
  }

  onBackClickHandle() {
    this.serviceCalendarService.resetValues();
    this.router.navigate([AppRoutePaths.ServiceCalendar]);
  }

  EditEffortClose() {
    this.ngOnInit();
    this.srlcRefresh.emit();
  }

  onOtherEffortsClick(){
    this.isOtherEffortsOpen = !this.isOtherEffortsOpen;
  }

  generateCSR(event: MouseEvent | TouchEvent | null) {
    const formValue = this.csrGenerateForm.value;
    this.serviceCalendarService.csrComments = formValue.csrComments ? formValue.csrComments : "";
    this.serviceCalendarService.selectedCallCompletion = this.srlcDetails[0].srStatusID == this.serviceCalendarService.SRCompletedStatus;
    if(!this.serviceCalendarService.selectedCallCompletion){
      this.showCSRPopup = true;
      let clientX = 0;
      let clientY = 0;
    
      if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      } 
      else if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      this.popupPosition = { x: clientX, y: clientY };
    }
    else
      this.router.navigate([AppRoutePaths.ServiceCSRGenerator]);
  }

  generateCSRFromPopUp() {
    const formValue = this.csrGenerateForm.value;
    this.serviceCalendarService.csrComments = formValue.csrComments ? formValue.csrComments : "";
    this.serviceCalendarService.selectedCallCompletion =  formValue.completedCheckBox? formValue.completedCheckBox: false
    this.showCSRPopup = false;
    this.router.navigate([AppRoutePaths.ServiceCSRGenerator]);
    // this.serviceCalendarService.selectedCallCompletion = this.srlcDetails[0].srStatusID == this.serviceCalendarService.SRCompletedStatus;
  }

  async startListeningCSRComments() {
    await this.commonService.startListeningAndPatch(this.csrGenerateForm, 'csrComments')
  }

  showCSRPopup: boolean = false;
  title: string = 'Generate CSR';
  popupPosition = { x: 0, y: 0 };

  onCSRPopupClose(){
    this.showCSRPopup = false;
  }

}
