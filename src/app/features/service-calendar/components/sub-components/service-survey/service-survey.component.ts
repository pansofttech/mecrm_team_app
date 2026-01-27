import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/features/common/common.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ServiceCalendarService, svcGetSRLCDetails, svcDependentComboData } from '../../../service-calendar.service';

@Component({
  selector: 'app-service-survey',
  templateUrl: './service-survey.component.html',
  styleUrl: './service-survey.component.scss'
})
export class ServiceSurveyComponent {
  @Input() srid: number = 0;
  @Input() public surveyDetails!: FormGroup;
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  showAPILoader: boolean = false;
  dependantComboDataForContactName: svcDependentComboData[] = [];
  EmailError: string = 'Customer contact email is required'

  constructor(
    private loginService: LoginService,
    private loaderService: LoaderService,
    public commonService : CommonService,
    public serviceCalendarService: ServiceCalendarService
  ){}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.getPrerequisiteCombo();
    this.surveyDetails.get('contactName')?.valueChanges.subscribe((value: number) => {
        this.getCustContactById(value);
    });  
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
        this.surveyDetails.patchValue({
          contactEmail: data[0].emailId,
        });
      }
    },
    error =>{
        this.EmailError = "Customer Email doesn't exist please check the desktop version"
    })
  }
}
