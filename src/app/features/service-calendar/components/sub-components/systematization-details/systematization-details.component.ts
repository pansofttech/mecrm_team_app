import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ServiceCalendarService, svcDependentComboData, svcGetSRLCDetails } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-systematization-details',
  templateUrl: './systematization-details.component.html',
  styleUrl: './systematization-details.component.scss'
})
export class SystematizationDetailsComponent {
  @Input() public systematizationDetails!: FormGroup;
  @Input() srid: number = 0;
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  showAPILoader: boolean = false;
  dependantComboDataForClassification: svcDependentComboData[] = [];
  dependantComboDataForApplication: svcDependentComboData[] = [];
  dependantComboDataForComplexity: svcDependentComboData[] = [];
  dependantOnLoadDataForProduct: svcDependentComboData[] =[];
  dependantOnLoadDataForProductFiltered: svcDependentComboData[] =[];
  public virtual: any = {
    itemHeight: 28,
  };

  constructor(
    private loginService: LoginService,
    private loaderService: LoaderService,
    private serviceCalendarService: ServiceCalendarService
  ){}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.getPrerequisiteCombo();
    this.getPrerequisiteComboDataOnLoad();
    // this.patchFormValues('systematizationDetails');
  }

  getPrerequisiteCombo(){
    this.serviceCalendarService.getPrerequisiteCombo("SRLC", this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForClassification = data.filter(
        (item: any) => item.comboType === 'PRODCLASSIFICATION'
      );
      this.dependantComboDataForApplication = data.filter(
        (item: any) => item.comboType === 'APPLICATION'
      );
      this.dependantComboDataForComplexity = data.filter(
        (item: any) => item.comboType === 'COMPLEXITY'
      );
    });
  }

  getPrerequisiteComboDataOnLoad(){
    this.serviceCalendarService.getDependentComboDataOnLoad(this.srid, this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantOnLoadDataForProduct = data.filter(
        (item: any) => item.comboType === 'PRODUCT'
      );
      this.dependantOnLoadDataForProductFiltered = data.filter(
        (item: any) => item.comboType === 'PRODUCT'
      );
    });
  }

  handleProductFilter(comboID: string) {
    if (comboID && comboID.length >= 1) {
      this.dependantOnLoadDataForProductFiltered = this.dependantOnLoadDataForProductFiltered.filter(
        (s: svcDependentComboData) =>
          s.comboName!.toLowerCase().indexOf(comboID.toLowerCase()) !== -1
      );
    } else {
      this.dependantOnLoadDataForProductFiltered = this.dependantOnLoadDataForProduct;
    }
  }

  // patchFormValues(formGroupName: string){
  //   if (this.serviceCalendarService.hasPatchedMap[formGroupName]) return;
  //   this.serviceCalendarService.hasPatchedMap[formGroupName] = true;

  //   this.systematizationDetails.patchValue({
  //     systemHandle: this.srlcDetails[0].systemHandle? this.srlcDetails[0].systemHandle: '',
  //     classification: this.srlcDetails[0].prodClassificationId? this.srlcDetails[0].prodClassificationId: null,
  //     manufacturer: this.srlcDetails[0].manufacturer? this.srlcDetails[0].manufacturer: '',
  //     installbaseProduct: this.srlcDetails[0].productName? this.srlcDetails[0].productName: '',
  //     applicationCode: this.srlcDetails[0].applicationId? this.srlcDetails[0].applicationId: null,
  //     complexity: this.srlcDetails[0].complexityId? this.srlcDetails[0].complexityId: null
  //   });
  // }

}
