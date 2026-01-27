import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcGetSRLCDetails } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-parts-required',
  templateUrl: './parts-required.component.html',
  styleUrl: './parts-required.component.scss'
})
export class PartsRequiredComponent implements OnInit{
  @Input() public partsRequiredDetails!: FormGroup;
  @Input() srlcDetails: svcGetSRLCDetails[] = [];
  showAPILoader: boolean = false;

  constructor(
    private loaderService: LoaderService,
    public commonService: CommonService,
    private serviceCalendarService: ServiceCalendarService
  ){}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.partsRequiredDetails.get('partsRequiredHoldRemarks')?.valueChanges.subscribe((value: string | null) => {
      this.serviceCalendarService.delayRemarks = value? value: '';
    });
    this.patchFormValues();
    // this.patchFormValues('partsRequiredDelay');

    this.partsRequiredDetails.get('partsRequired')?.valueChanges.subscribe((checked: boolean) => {
      const remarksControl = this.partsRequiredDetails.get('partsRequiredHoldRemarks');
      if (checked) {
        remarksControl?.setValidators([Validators.required]);
      } else {
        remarksControl?.clearValidators();
      }
      remarksControl?.updateValueAndValidity();
    });
  }

  patchFormValues(){
    this.partsRequiredDetails.patchValue({
      partsRequiredHoldRemarks: this.serviceCalendarService.delayRemarks? this.serviceCalendarService.delayRemarks: ''
    });
  }

  // patchFormValues(formGroupName: string){
  //   if (this.serviceCalendarService.hasPatchedMap[formGroupName]) return;
  //   this.serviceCalendarService.hasPatchedMap[formGroupName] = true;

  //   this.partsRequiredDetails.patchValue({
  //     partsRequired: this.srlcDetails[0].isPartsRequired? this.srlcDetails[0].isPartsRequired: false,
  //     partsRequiredHoldRemarks: this.srlcDetails[0].mainTaskEngrResponse? this.srlcDetails[0].mainTaskEngrResponse: this.srlcDetails[0].callCategory?.toLowerCase() == 'noncontract svc'? 
  //     'Parts request created for non contract service call.' : 'Parts required'
  //   });
  // }

}
