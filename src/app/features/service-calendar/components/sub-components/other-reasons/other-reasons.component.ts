import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcGetSRLCDetails } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-other-reasons',
  templateUrl: './other-reasons.component.html',
  styleUrl: './other-reasons.component.scss'
})
export class OtherReasonsComponent implements OnInit{
  @Input() public otherReasonsDetails!: FormGroup;
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
    this.otherReasonsDetails.get('otherReasonHoldRemarks')?.valueChanges.subscribe((value: string | null) => {
      this.serviceCalendarService.delayRemarks = value? value: '';
    });
    this.patchFormValues();
    // this.patchFormValues('otherReasonDelay');

    this.otherReasonsDetails.get('otherReasons')?.valueChanges.subscribe((checked: boolean) => {
      const remarksControl = this.otherReasonsDetails.get('otherReasonHoldRemarks');
      if (checked) {
        remarksControl?.setValidators([Validators.required]);
      } else {
        remarksControl?.clearValidators();
      }
      remarksControl?.updateValueAndValidity();
    });
  }

  patchFormValues(){
    this.otherReasonsDetails.patchValue({
      otherReasonHoldRemarks: this.serviceCalendarService.delayRemarks? this.serviceCalendarService.delayRemarks: ''
    });
  }

  // patchFormValues(formGroupName: string){
  //   if (this.serviceCalendarService.hasPatchedMap[formGroupName]) return;
  //   this.serviceCalendarService.hasPatchedMap[formGroupName] = true;

  //   this.otherReasonsDetails.patchValue({
  //     otherReasons: this.srlcDetails[0].isOtherReason? this.srlcDetails[0].isOtherReason: false,
  //     otherReasonsRecoveryDate: this.srlcDetails[0].expDate? this.commonService.convertDateStringToDate(this.srlcDetails[0].expDate): null,
  //     otherReasonHoldRemarks: this.srlcDetails[0].mainTaskEngrResponse? this.srlcDetails[0].mainTaskEngrResponse: ''
  //   });
  // }

}
