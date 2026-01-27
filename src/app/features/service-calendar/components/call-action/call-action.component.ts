import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ServiceCalendarService, engEffortsList, svcGetSRLCDetails, svcPrerequisites, svcIBModuleDetails, svcGetOtherTasksDetails} from '../../service-calendar.service';

@Component({
  selector: 'app-call-action',
  templateUrl: './call-action.component.html',
  styleUrl: './call-action.component.scss'
})
export class CallActionComponent implements OnInit{
  showAPILoader = false;
  loaderMessage: string = 'Loading Call Action...';
  callCompletionSelected: boolean = false;
  callHoldSelected: boolean = false;
  callFieldVisitSelected: boolean = false;
  callContinueSelected: boolean = false;

  callCompletionEnabled: boolean = false;
  callHoldEnabled: boolean = false;
  callFieldVisitEnabled: boolean = false;
  callContinueEnabled: boolean = false;

  engScheduleListCards: engEffortsList[] = [];
  isCallActionAccess: boolean = false;
  engeffortListCards: engEffortsList[] = [];

  @Input() srid: number = 0;
  @Input() servicePrerequisites: svcPrerequisites[] = [];
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  @Input() moduleDetails: svcIBModuleDetails[] = [];
  @Input() otherTasksDetails: svcGetOtherTasksDetails[] = [];
  @Output() moduleDetailsCardChange: EventEmitter<svcIBModuleDetails[]> = new EventEmitter<svcIBModuleDetails[]>();

  constructor(
    private serviceCalendarService: ServiceCalendarService,
    private loginService: LoginService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.CheckPrimaryUser((isPrimaryUser: boolean) => {
      this.EnableDisableWidget(isPrimaryUser);
    });
  }

  async widgetSelected(selectedWidget: string): Promise<void>{
    this.callCompletionSelected =false;
    this.callHoldSelected = false;
    this.callFieldVisitSelected = false;
    this.callContinueSelected = false;

    switch (selectedWidget) {
      case 'callCompletion':
        this.ValidateEfforts().then((isValid) => {
          if(isValid){
            this.callCompletionSelected = true;
          }
          else if(this.srlcDetails[0].contactPersonId == 0){
            this.notificationService.showNotification(
              'Please confirm contact person in SR Tab',
              'error',
              'center',
              'bottom'
            );
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
        break;
      case 'callHold':
        this.callHoldSelected = true;
        break;
      case 'callFieldVisit':
        this.callFieldVisitSelected = true;
        break;
      case 'callContinue':
        this.callContinueSelected = true;
        break;
      case 'back':
        break;
    }
  }

  EnableDisableWidget(isPrimaryUser: boolean){
    if(isPrimaryUser){
      this.callCompletionEnabled = true;
      this.callHoldEnabled = true;
      this.callFieldVisitEnabled = true;
      this.callContinueEnabled = false;

      if (this.srlcDetails[0].isPartsRequired != true && this.srlcDetails[0].isExpertiseRequirement != true && this.srlcDetails[0].isCustomerDelay != true && this.srlcDetails[0].isPORequired != true) {
        if ((this.srlcDetails[0].completedDate != null && this.srlcDetails[0].completedDate != "") || this.srlcDetails[0].awaitingCSR == true) {
          this.callCompletionEnabled = true;
          this.callHoldEnabled = false;
          this.callFieldVisitEnabled = false;
          this.callContinueEnabled = false;
        }
      }
      else if (this.srlcDetails[0].srStatus?.toLowerCase() == "in_progress") {
        this.callCompletionEnabled = true;
        this.callHoldEnabled = true;
        this.callFieldVisitEnabled = false;
        this.callContinueEnabled = true;
      }
      else if (this.srlcDetails[0].expCustomerDate != "" || this.srlcDetails[0].expDate != "" || this.srlcDetails[0].isPartsRequired == true) {
        this.callCompletionEnabled = false;
        this.callHoldEnabled = true;
        this.callFieldVisitEnabled = false;
        this.callContinueEnabled = false;
      }
      else if (this.srlcDetails[0].isExpertiseRequirement == true) {
        this.callCompletionEnabled = false;
        this.callHoldEnabled = false;
        this.callFieldVisitEnabled = true;
        this.callContinueEnabled = false;
      }
    }
    else{
      this.callCompletionEnabled = false;
      this.callHoldEnabled = false;
      this.callFieldVisitEnabled = false;
      this.callContinueEnabled = false;
    }
  }

  CheckPrimaryUser(callback: (isPrimaryUser: boolean) => void): void {
    const mainSubTaskId =
      this.srlcDetails[0].callCategory == 'Install' && this.srlcDetails[0].srStatusID == this.serviceCalendarService.SRStatusId
        ? this.serviceCalendarService.SRSubTaskId
        : this.srlcDetails[0].callCategory == 'Install'
        ? this.serviceCalendarService.InstallationSubTaskId
        : this.serviceCalendarService.FieldServiceSubTaskId;
  
    this.serviceCalendarService.getEngEfforts(this.loginService.employeeId as number, this.srid).subscribe(
      (data: any) => {
        this.engScheduleListCards = data.filter((item: any) => {
          return (
            item.isPrimary == true &&
            item.subTaskId == mainSubTaskId &&
            item.empId == this.loginService.employeeId
          );
        });
  
        callback(this.engScheduleListCards.length > 0);
      },
      (error) => {
        callback(false);
      }
    );
  }

  updateModuleDetailsCard(updatedList: svcIBModuleDetails[]) {
    this.moduleDetailsCardChange.emit(updatedList);
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

}
