import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { ServiceCalendarService, engEffortsList, callsList, svcPrerequisites, svcGetSRLCDetails, 
         svcIBModuleDetails, svcGetOtherTasksDetails, svcGetSRLCPartDiagnosisDetails } from '../../service-calendar.service';

@Component({
  selector: 'app-srlc',
  templateUrl: './srlc.component.html',
  styleUrls: ['./srlc.component.scss']
})
export class SrlcComponent implements OnInit, OnDestroy{
  private popstateSubscription?: Subscription;
  currentStep!: number;
  showAPILoader = false;
  loaderMessage!: string;
  invalid = false;

  isServiceRequestSelected: boolean = false;
  isEffortsSelected: boolean = false;
  isPRSelected: boolean = false;
  isCallActionSelected: boolean = false;
  isPrimaryEngineerForTask: boolean = false;
  isSRIDInfoSelected: boolean = false;
  selectedSRID: number = 0;
  currentDate: string = '';
  stepName: string = '';

  engeffortListCards: engEffortsList[] = [];
  filteredEngeffortListCards: engEffortsList[] = [];
  filteredOtherDaysEngeffortListCards: engEffortsList[] = [];
  servicePrerequisites: svcPrerequisites[] = [];
  srlcDetails: svcGetSRLCDetails[] = [];
  moduleDetails: svcIBModuleDetails[] = [];
  otherTasksDetails: svcGetOtherTasksDetails[] = [];
  srlcPartDiagnosisDetails: svcGetSRLCPartDiagnosisDetails[] = [];
  schCallCards: callsList[] = [];

  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private loginService: LoginService,
    private commonService : CommonService,
    private serviceCalendarService: ServiceCalendarService,
    ) {
      const navigation = this.router.getCurrentNavigation();
      if(navigation?.extras.state){
        this.selectedSRID = navigation.extras.state['id'];
        this.currentDate = navigation.extras.state['date']
      }
    }

    ngOnInit(): void {
      this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
        this.onBackClickHandle();
      });
      this.loaderMessage = "";
      this.loaderService.loaderState.subscribe(res => {
        this.showAPILoader = res;
      });
      
      this.loaderService.hideLoader();
      this.engEffortsList();
      this.getServicePrereq();
      this.getSRLCDetails();
      this.getOtherTasksDetails();
      this.getSRLCPartDiagnosisDetails();
      this.scheduledCallsDetails();
      this.onStepperClick(1);
    }

    ngOnDestroy(): void {
      this.popstateSubscription?.unsubscribe();
    }

    engEffortsList() {
      this.loaderService.showLoader();
      this.serviceCalendarService.getEngEfforts(this.loginService.employeeId as number, this.selectedSRID).subscribe((data: any) => {
        this.engeffortListCards = data;
        this.filteredEngeffortListCards = data.filter(
          (item: any) => item.empId === this.loginService.employeeId &&
                         this.commonService.displayDateFormat(item.ondate) === this.currentDate
        );
        this.filteredOtherDaysEngeffortListCards = data.filter(
          (item: any) => item.empId === this.loginService.employeeId &&
                         this.commonService.displayDateFormat(item.ondate) !== this.currentDate
        );

      if(data.filter((item: any) =>{
        return  item.isPrimary == true &&
                item.empId == this.loginService.employeeId as number
      }).length > 0)
      {
        this.isPrimaryEngineerForTask = true;
      }

        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();
      });
    }

    scheduledCallsDetails() {
      this.loaderService.showLoader();
      this.serviceCalendarService.getScheduledCalls(this.loginService.employeeId as number, this.serviceCalendarService.selectedDate).subscribe((data: any) => {
        this.schCallCards = data.filter(
          (item: any) => item.srid === this.selectedSRID
        );
        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();;
      });
    }

    onStepperClick(currentStep: number){
      this.isServiceRequestSelected = false;
      this.isEffortsSelected = false;
      this.isPRSelected = false;
      this.isCallActionSelected = false;
      this.currentStep = currentStep;
      this.stepName = '';
  
      if(currentStep == 0){
        this.isServiceRequestSelected = true;
        this.stepName = 'Service Request';
      }
      if(currentStep == 1){
        this.isEffortsSelected = true;
        this.stepName = 'Effort Log';
      }
      else if(currentStep == 2){
        this.isPRSelected = true;
        this.stepName = 'Parts Request';
      }
      else if(currentStep == 3){
        this.isCallActionSelected = true;
        this.stepName = 'Call Action';
      }
    }

    getServicePrereq(){
      this.serviceCalendarService.getServicePrerequisites(this.selectedSRID,this.loginService.employeeId as number).
      subscribe((data: any) => {
        this.servicePrerequisites = data;
        this.serviceCalendarService.csrComments = data[0].serviceComments;
      });
    }

    getSRLCDetails(){
      this.serviceCalendarService.getSRLCDetails(this.selectedSRID,this.loginService.employeeId as number).
      subscribe((data: any) => {
        this.srlcDetails = data;
        this.serviceCalendarService.getModuleDetails(
          this.srlcDetails[0].installBaseID? data[0].installBaseID : 0,
          this.loginService.employeeId as number)
          .subscribe((data: any) => {
            this.moduleDetails = data;
            this.serviceCalendarService.moduleDetailsCard = data;
        });
      });
    }

    getOtherTasksDetails(){
      this.serviceCalendarService.getOtherTasksDetails(this.selectedSRID,this.loginService.employeeId as number).
      subscribe((data: any) => {
        data = data.map((task: any) => {
          return {
            ...task,
            exceptional: task.exceptional ?? false,
            completedDate: task.completedDate ?? "",
            expectedCompletionDate: task.expectedCompletionDate ?? ""
          };
        });
        this.otherTasksDetails = data;
        this.serviceCalendarService.otherTasksDetailsCard = data;
      });
    }
        
    getSRLCPartDiagnosisDetails(){
      this.serviceCalendarService.getSRLCPartDiagnosis(this.selectedSRID).
      subscribe((data: any) => {
        this.srlcPartDiagnosisDetails = data;
        this.serviceCalendarService.pdUsageDetailsCard = data;
      });
    }
    
    updateModuleDetailsCard(updatedList: svcIBModuleDetails[]) {
      this.moduleDetails = updatedList;
    }
    
    updatePartDiagnosisCard(updatedList: svcGetSRLCPartDiagnosisDetails[]) {
      this.srlcPartDiagnosisDetails = updatedList;
    }

    onStepLabelChange(stepLabel: string) {
      this.stepName = stepLabel;
    }

    onSRIDInfoClick(){
      this.isSRIDInfoSelected = !this.isSRIDInfoSelected;
    }

    onBackClickHandle() {
      this.serviceCalendarService.resetValues();
      this.router.navigate([AppRoutePaths.ServiceCalendar]);
    }

    onScroll() {
      this.isSRIDInfoSelected = false;
    }
  
    onRefresh(){
      this.serviceCalendarService.resetValues();
      this.ngOnInit();
    }

    onSave(){
      this.ngOnInit();
    }
}
