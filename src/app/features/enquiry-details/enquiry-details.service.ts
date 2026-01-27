import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { LoginService } from '../login/components/login/login.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/features/common/common.service';

export interface EnquiryList {
  id: string | number;
  dealNo: string;
  enqID: number;
  soldToLEID: number;
  soldToLE: string;
  salesChannel: string;
  enqStatusId: number;
  enqStatus: string;
  salesExecutiveID: number;
  salesExecutive: string;
  soldToContact: string;
  wsApprovalPendingWith: string;
  soldToContPhoneNo: number;
}

export interface EnquiryTypeBody {
  soldToLEID: string | number;
  soldToContactID: any;
  soldToLESiteID: any;
  regionID: string | number;
  salesChannelID: any;
  salesExecutiveID: any;
  workflowID: any;
  generatedFromID: any;
  quoteCompanyID: any;
  quoteCurrencyID: any;
  enquiryDescription: any;
  loginID: number | string;
  generatedByID?: any; // Make generatedByID property optional
  attachment: any;
}

export interface EnquiryDetailsHistory {
  remarksID: number;
  remarks: string;
  leadLogGUID: number;
  leadLogDocName: string;
  leadLogSrcType: string;
  leadLogDocPath: string;
  updDate: string;
  createdByID: number;
  updatedBy: string;
  isMultiple: number;
  modeOfContactId: number;
  modeOfContact: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnquiryDetailsService {
  private getLEContactsUrl = `${this.configService.apiUrl}/api/Enquiry/GetLEContacts`;
  private getLESiteByContactUrl = `${this.configService.apiUrl}/api/Enquiry/GetLESiteByContact`;
  private getLERegionBySiteUrl = `${this.configService.apiUrl}/api/Enquiry/GetLegalEntityRegionBySite`;
  private putAddEnquiryUrl = `${this.configService.apiUrl}/api/Enquiry/AddEnquiry`;
  private putUpdateEnquiryUrl = `${this.configService.apiUrl}/api/Enquiry/UpdateEnquiry`;
  private getGeneratedFromUrl = `${this.configService.apiUrl}/api/Enquiry/GetGeneratedFrom`;
  private getGeneratedByUrl = `${this.configService.apiUrl}/api/Enquiry/GetGeneratedBy`;
  private getQuoteEntityCompanyUrl = `${this.configService.apiUrl}/api/Enquiry/GetQuoteCompany`;
  private getQuoteCurrencyByCompanyUrl = `${this.configService.apiUrl}/api/Enquiry/GetQuoteCurrencyByCompany`;
  private getSalesWorkflowUrl = `${this.configService.apiUrl}/api/Enquiry/GetSalesWorkflow`;
  private getSalesChannelUrl = `${this.configService.apiUrl}/api/Enquiry/GetSalesChannel`;
  private getSalesExecutivesUrl = `${this.configService.apiUrl}/api/Enquiry/GetSalesExecutives`;
  private getFunnelWorklistUrl = `${this.configService.apiUrl}/api/Enquiry/FetchFunnelWorklist`;
  private getAccountLogDetailsUrl = `${this.configService.apiUrl}/api/Enquiry/GetAccountLogDetails`;
  private getUpdateEnqDropdownUrl = `${this.configService.apiUrl}/api/Enquiry/GetUpdateEnqDropdowns`;
  private getEnquiryDetailsUrl = `${this.configService.apiUrl}/api/Enquiry/GetEnqDetails`;

  public regionId: string | number = '';
  public leID: string | number = '';
  public salesExecID: string | number = '';
  public poExpectedDate: string | number = '';
  public soldToLESiteID: string | number = '';

  constructor(
    private http: HttpService,
    private loginService: LoginService,
    private configService: ConfigService,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {}

  getSoldToContactsList() {
    return this.http.get(this.getLEContactsUrl);
  }

  getSoldToSiteList(contactId: number) {
    const body = {
      leContactID: contactId,
    };
    return this.http.post(this.getLESiteByContactUrl, body);
  }

  getRegionFromSiteList(siteId: number) {
    const body = {
      leSiteID: siteId,
    };
    return this.http.post(this.getLERegionBySiteUrl, body);
  }
  
  //API call to add enquiry
  AddEnquiry(formData: any) {
    const attachmentfile =
    formData.enquiryDescription.attachment && formData.enquiryDescription.attachment.length > 0
          ? formData.enquiryDescription.attachment[0]
          : null;
    if (attachmentfile) {
      formData.enquiryDescription.attachment = attachmentfile;
    } else {
      formData.enquiryDescription.attachment = '';
    }  

    const body = new FormData();
    body.append('soldToLEID', this.leID as string);
    body.append('soldToContactID', formData.contactDetails.soldToContact);
    body.append('soldToLESiteID', formData.contactDetails.soldToSite);
    body.append('regionID', this.regionId as string);
    body.append('salesChannelID', formData.enquiryDetailsForms.salesChannel);
    body.append('salesExecutiveID', this.salesExecID as string);
    body.append('workflowID', formData.enquiryDetailsForms.salesWorkFlow);
    body.append('generatedFromID', formData.enquiryDetailsForms.generatedFrom);
    body.append('quoteCompanyID', formData.enquiryDetailsForms.quoteEntityCompany);
    body.append('quoteCurrencyID', formData.enquiryDetailsForms.quoteEntityCurrency);
    body.append('enquiryDescription', formData.enquiryDescription.enterDescription);
    body.append('loginID', this.loginService.employeeId as string);
    body.append('docSrcType', this.commonService.docSrcTypeAttachment as unknown as string);
    body.append('attachment', formData.enquiryDescription.attachment);
    if (formData.enquiryDetailsForms.generatedBy) {
      body.append('generatedByID', formData.enquiryDetailsForms.generatedBy);
    } else {
      body.append('generatedByID', String(0) );
    }
    return this.http.put(this.putAddEnquiryUrl, body);
  }

  //API call to update enquiry
  UpdateEnquiry(formData: any,enqID: string) {
    const file =
    formData.enquiryUpdateForm.interaction_attachment && formData.enquiryUpdateForm.interaction_attachment.length > 0
          ? formData.enquiryUpdateForm.interaction_attachment[0]
          : null;
    if (file) {
      formData.enquiryUpdateForm.interaction_attachment = file;
    } else {
      formData.enquiryUpdateForm.interaction_attachment = '';
    }

    const attachmentfile =
    formData.enquiryDescription.attachment && formData.enquiryDescription.attachment.length > 0
          ? formData.enquiryDescription.attachment[0]
          : null;
    if (attachmentfile) {
      formData.enquiryDescription.attachment = attachmentfile;
    } else {
      formData.enquiryDescription.attachment = '';
    }  
    
    const formattedDate = formData.enquiryUpdateForm.poExpectedDate
      ? this.datePipe.transform(formData.enquiryUpdateForm.poExpectedDate, 'dd/MM/yyyy')
      : null;

    const body = new FormData();
    body.append('soldToLEID', this.leID as string);
    body.append('soldToContactID', formData.contactDetails.soldToContact);
    body.append('soldToLESiteID', formData.contactDetails.soldToSite);
    body.append('regionID', this.regionId as string);
    body.append('salesChannelID', formData.enquiryDetailsForms.salesChannel);
    body.append('salesExecutiveID', this.salesExecID as string);
    body.append('workflowID', formData.enquiryDetailsForms.salesWorkFlow);
    body.append('generatedFromID', formData.enquiryDetailsForms.generatedFrom);
    body.append('quoteCompanyID', formData.enquiryDetailsForms.quoteEntityCompany);
    body.append('quoteCurrencyID', formData.enquiryDetailsForms.quoteEntityCurrency);
    body.append('enquiryDescription', formData.enquiryDescription.enterDescription);
    body.append('loginID', this.loginService.employeeId as string);
    body.append('attachment', formData.enquiryDescription.attachment);
    body.append('enqId', enqID);
    body.append('remarks', formData.enquiryUpdateForm.remarksValue);
    body.append('probabilityID', formData.enquiryUpdateForm.probability);
    body.append('dealPositionID', formData.enquiryUpdateForm.dealPosition);
    body.append('dealValue', formData.enquiryUpdateForm.dealValue);
    body.append('poExpectedDate', formattedDate as string);
    body.append('modeOfCommunicationID', formData.enquiryUpdateForm.modeOfCommunication);
    body.append('docSrcType', this.commonService.docSrcTypeAttachment as unknown as string);
    body.append('interaction_attachment', formData.enquiryUpdateForm.interaction_attachment);

    if (formData.enquiryDetailsForms.generatedBy) {
      body.append('generatedByID', formData.enquiryDetailsForms.generatedBy);
    } else {
      body.append('generatedByID', String(0) );
    }
    return this.http.put(this.putUpdateEnquiryUrl, body);
  }

  getgeneratedFrom() {
    return this.http.get(this.getGeneratedFromUrl);
  }

  getgeneratedBy(generatedFrom: string) {
    const body = {
      generatedFrom: generatedFrom,
    };
    return this.http.post(this.getGeneratedByUrl, body);
  }

  getquoteEntityCompany() {
    return this.http.get(this.getQuoteEntityCompanyUrl);
  }

  getquoteEntityCurrency(companyID: number) {
    const body = {
      quoteCompanyID: companyID,
    };
    return this.http.post(this.getQuoteCurrencyByCompanyUrl, body);
  }

  getsalesWorkFlow() {
    return this.http.get(this.getSalesWorkflowUrl);
  }

  getsalesChannel() {
    return this.http.get(this.getSalesChannelUrl);
  }

  getsalesExecutive(
    enId: string | number,
    leId: string | number,
    salesChannelID: string | number,
    leSiteID: string | number
  ) {
    const body = {
      enqId: enId,
      leid: leId,
      salesChannelID: salesChannelID,
      LESiteID: leSiteID,
    };
    return this.http.post(this.getSalesExecutivesUrl, body);
  }

  //Get enquiry lists to display in funnel update
  getEnquirylist() {
    const body = {
      loginID: this.loginService.employeeId,
    };
    return this.http.post(this.getFunnelWorklistUrl, body);
  }

  //Get previous interactions history
  getEnquiryDetailsHistory(endId: string) {
    const body = {
      enqID: endId,
    };
    return this.http.post(this.getAccountLogDetailsUrl, body);
  }

  getupdateEnqDropdown() {
    return this.http.get(this.getUpdateEnqDropdownUrl);
  }

  getEnquiryDetails(enqID: string | null) {
    const body = {
      enqID,
      loginID: this.loginService.employeeId,
    };
    return this.http.post(this.getEnquiryDetailsUrl, body);
  }
}
