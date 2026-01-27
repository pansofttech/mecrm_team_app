import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators} from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcGetSRLCDetails } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-customer-delay',
  templateUrl: './customer-delay.component.html',
  styleUrl: './customer-delay.component.scss'
})
export class CustomerDelayComponent implements OnInit{
  @Input() public customerDelayDetails!: FormGroup;
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
    this.customerDelayDetails.get('leDelayHoldRemarks')?.valueChanges.subscribe((value: string | null) => {
      this.serviceCalendarService.delayRemarks = value? value: '';
    });
    this.patchFormValues();
    // this.patchFormValues('customerDelay');

    this.customerDelayDetails.get('leDelay')?.valueChanges.subscribe((checked: boolean) => {
      const remarksControl = this.customerDelayDetails.get('leDelayHoldRemarks');
      if (checked) {
        remarksControl?.setValidators([Validators.required]);
      } else {
        remarksControl?.clearValidators();
      }
      remarksControl?.updateValueAndValidity();
    });
  }

  patchFormValues(){
    this.customerDelayDetails.patchValue({
      leDelayHoldRemarks: this.serviceCalendarService.delayRemarks? this.serviceCalendarService.delayRemarks: ''
    });
  }

  // patchFormValues(formGroupName: string){
  //   if (this.serviceCalendarService.hasPatchedMap[formGroupName]) return;
  //   this.serviceCalendarService.hasPatchedMap[formGroupName] = true;

  //   this.customerDelayDetails.patchValue({
  //     leDelay: this.srlcDetails[0].isCustomerDelay? this.srlcDetails[0].isCustomerDelay: false,
  //     leDelayRecoverDate: this.srlcDetails[0].expCustomerDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].expCustomerDate): null,
  //     leDelayHoldRemarks: this.srlcDetails[0].mainTaskEngrResponse? this.srlcDetails[0].mainTaskEngrResponse: ''
  //   });
  // }
}
