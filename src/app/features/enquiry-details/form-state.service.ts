import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  contactDetailsFormState: any = {};
  enquiryDetailsFormState: any = {};
  selectedGeneratedFrom: any = null;
  selectedGeneratedBy: any = null;
  selectedCompany:any={};
  selectedContact: any = null;
  selectedSales:any = null;
  attachments: any = [];
  enqId!: any;
  regionId!: any;
  soldToLEId!: any;
  salesExecutiveId!: any;
  skip = 0;
  total = 0;
  public generatedByVisible = false;

  constructor() {}

  ngOnInit(){
    this.resetValues();
  }

  resetValues(){
    this.contactDetailsFormState = null;
    this.enquiryDetailsFormState = null;
    this.selectedGeneratedFrom = null;
    this.selectedGeneratedBy = null;
    this.selectedCompany = null;
    this.selectedContact = null;
    this.selectedSales = null;
    this.attachments = null;
    this.enqId = null;
    this.salesExecutiveId = null;
    this.regionId = null;
    this.soldToLEId = null;
    this.generatedByVisible = false;
  }

  resetPaginationValues(){
    this.skip = 0;
    this.total = 0;
  }
}