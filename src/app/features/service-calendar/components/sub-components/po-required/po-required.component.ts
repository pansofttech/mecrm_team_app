import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcGetSRLCDetails } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-po-required',
  templateUrl: './po-required.component.html',
  styleUrl: './po-required.component.scss'
})
export class PoRequiredComponent implements OnInit{
  @Input() public poRequiredDetails!: FormGroup;
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
    this.poRequiredDetails.get('poRequiredHoldRemarks')?.valueChanges.subscribe((value: string | null) => {
      this.serviceCalendarService.delayRemarks = value? value: '';
    });
    this.patchFormValues();

    this.poRequiredDetails.get('poRequired')?.valueChanges.subscribe((checked: boolean) => {
      const remarksControl = this.poRequiredDetails.get('poRequiredHoldRemarks');
      if (checked) {
        remarksControl?.setValidators([Validators.required]);
      } else {
        remarksControl?.clearValidators();
      }
      remarksControl?.updateValueAndValidity();
    });
  }

  patchFormValues(){
    this.poRequiredDetails.patchValue({
      poRequiredHoldRemarks: this.serviceCalendarService.delayRemarks? this.serviceCalendarService.delayRemarks: ''
    });
  }
}
