import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EnquiryDetailsService } from '../../enquiry-details.service';
import { CommonService } from 'src/app/features/common/common.service';

@Component({
  selector: 'app-enquiry-update',
  templateUrl: './enquiry-update.component.html',
  styleUrls: ['./enquiry-update.component.scss'],
})

export class EnquiryUpdateComponent implements OnInit {
  public currentStep = 3;
  showAPILoader = false;
  invalid = true;
  id!: string | null;
  poExpectedDate: Date = new Date();
  modeOfCommunicationValue = false;
  modeOfCommunicationControl!: FormControl;
  @Input() enqId: string | null = null;
  @Input() public enquiryUpdateForm!: FormGroup;
  
  constructor(
    private loaderService: LoaderService,
    private router: Router,
    public enquiryDetailsService: EnquiryDetailsService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.enquiryDetailsService.getupdateEnqDropdown().subscribe((data: any) => {
      this.dealPositionList = data.filter(
        (item: any) => item.comboType === 'DEALPOSITION'
      );
      this.probabilityList = data.filter(
        (item: any) => item.comboType === 'PROBABILITY'
      );
      this.enquiryModeList = data.filter(
        (item: any) => item.comboType === 'ENQUIRYMODE'
      );
    });
  }

  public step = [
    {
      label: 'Contact Details',
      isValid: true,
    },
    {
      label: 'Enquiry Details',
      isValid: true,
    },
    {
      label: 'Enquiry Description',
      isValid: true,
    },
    {
      label: 'Deal Number',
    },
  ];

  public dealPositionList: Array<string> = [];
  public probabilityList: Array<string> = [];
  public enquiryModeList: Array<string> = [];
  public dealPositionDefaultValue: {
    comboID: unknown;
    comboName: unknown;
    comboType: string;
    isActive: boolean;
  } | null = null;

  handleHistoryButton() {
    this.router.navigate([AppRoutePaths.EnquiryDetailsHistory],{state: {id: this.enqId}});
  }
  
}
