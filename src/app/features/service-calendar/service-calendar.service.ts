import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { LoginService } from '../login/components/login/login.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { DatePipe } from '@angular/common';
import { CommonService } from '../common/common.service';
import { guid } from '@progress/kendo-angular-common';

export interface callsList {
  srid: number;
  ueu: string;
  siteName: string;
  contactName: string;
  phoneNumber: string;
  primaryAddress: string;
  email: string;
  gpsCoordinate: string;
  productName: string;
  manufacturer: string;
  serialNumber: string;
  callCategory: string;
  callType: string;
  status: string;
  callDescription: string;
  isCallCompleted: boolean;
}

export interface engEffortsList {
  empId: number;
  srid: number;
  name: string;
  ondate: string;
  startTime?: string;
  endTime?: string;
  effortHours: string;
  travelHours: string;
  taskType: string;
  remarks: string;
  isPrimary: boolean;
  isEffortEdit: boolean;
}

export interface svcPartsDetails {
  partNo?: string;
  option?: string;
  description?: string;
  productLine?: string;
  partsTypeID?: number | null;
  currency?: number | null;
  currencyName?: string;
  discount?: number | null;
  isActive?: boolean | null;
  partsMasterID?: number | null;
  price?: number | null;
  partsTypeName?: string;
  isServiceItem?: boolean | null;
  rateType?: number | null;
  isVendorQoteMandat?: boolean | null;
  isCurrencyEdit?: boolean | null;
  partReqId?: number | null;
  partsID?: number | null;
  partListID?: number | null;
  eono?: string;
  eoDate?: string;
  supplierID?: number | null;
  supplierName?: string;
  quantity?: number | null;
  retQuantity?: number | null;
  unitPrice?: number | null;
  status?: number | null;
  partStatus?: string;
  arrivedDate?: string;
  orderValue?: number | null;
  conversionRate?: number | null;
  pL_ArrivedDate?: string;
  remark?: string;
  procurementReasonId?: number | null;
  procurementReason?: string;
  configItemId?: number | null;
  itemSP?: number | null;
  unitItemSP?: number | null;
  isQuoteEnable?: boolean | null;
  isPartItemEdit?: boolean | null;
  isChecked?: boolean | null;
  isCardSelected?: boolean | null;
  isDescOpen?: boolean | null;
}

export interface svcDependentComboData {
  comboId?: number;
  comboName?: string;
  comboType?: string;
  refId?: number;
  specialType?: string;
}

export interface PrerequisiteBO {
  comboName: string;
  comboType: string;
  comboId: number;
  refId: number;
  specialType: string;
  referenceId: number;
  parentId?: number | null;
  referenceValue?: number | null;
}

export interface svcPrerequisites {
  customerId: number;
  partReqId?: number;
  callIOID?: number;
  isInProgress: boolean | null;
  serviceComments: string | null;
  isPartsRequestShow: boolean | null;
  isGenerateCSR: boolean | null;
  isQuoteClosePrv: boolean;
  isIBConfirmed: boolean;
  isIBStickerUsed: boolean;
  ibWorkingStatus: string | null;
}

export interface svcPartsRequest {
  partReqId: number;
  partsMasterId: number;
  partListId: number;
  supplierId: number;
  partsId: number;
  partNo: string;
  option: string | null;
  description: string;
  productLine: string;
  quantity: number;
  retQuantity: number;
  status: number;
  currency: number;
  unitPrice: number;
  discount: number;
  partsTypeId: number;
  conversionRate: number;
  arrivedDate: string | null;
  createdBy: number;
  createdDate?: Date | null;
  modifiedBy: number;
  modifiedDate?: Date | null;
  remark: string | null;
  procurementReasonId: number;
  procurementReason: string;
  spCurrencyId: number;
  itemSp: number;
  configItemId: number;
  partsContractId: number;
  isChecked: boolean;
  supplierName: string;
  orderValue: number;
  unitItemSp: number;
  isActive: boolean;
  isVendorQoteMandat: boolean;
  isCurrencyEdit: boolean;
  plArrivedDate: string | null;
  suppDiscount: number;
  installBaseId?: number | null;
  ibSerialNumber: string | null;
  entitlementPartNo: string | null;
  entitlementSupplier: string | null;
  entitlementSupplierId: number;
  entitlementOption: string | null;
  entitlementPartId?: number | null;
}

export interface svcGetSRLCDetails {
  srid?: number;
  callLogDate?: string;
  customerId?: number;
  customerName?: string;
  customerSiteId?: number;
  siteName?: string;
  contactPerson?: string;
  custContactNumber?: string;
  productID?: number;
  productName?: string;
  productGroupID?: number;
  productGroup?: string;
  callCategoryID?: number;
  callCategory?: string;
  callTypeID?: number;
  callType?: string;
  supplierId?: number;
  supplierName?: string;
  serialNumber?: string;
  callDescription?: string;
  coordinatorComments?: string;
  createdBy?: number;
  contactPersonId?: number;
  productTypeID?: number;
  systemEmp?: string;
  srStatusID?: number;
  srStatus?: string;
  isExpertiseRequirement?: boolean;
  expertAvalableDate?: string;
  isPartsRequired?: boolean;
  expPartsArriveDate?: string;
  isShipmentArriveRequired?: boolean;
  expShipArriveDate?: string;
  isCustomerDelay?: boolean;
  expCustomerDate?: string;
  isOtherReason?: boolean;
  expDate?: string;
  isSiteNotReady?: boolean;
  expSiteReadyDate?: string;
  ioNo?: string;
  plOrderId?: number;
  ioRef?: string;
  isEditEnable?: boolean;
  priority?: string;
  priorityId?: number;
  installBaseID?: number;
  isUnwantedCallClose?: number;
  closedReasonId?: number;
  closedReason?: string;
  closedReasonRemarks?: string;
  contractId?: number;
  contractNo?: string;
  leadNo?: string;
  salesPersonName?: string;
  salesIONo?: string;
  applicationDetail?: string;
  isPreSaleVisit?: boolean;
  preSaleDate?: string;
  readyReasonNotes?: string;
  enqDetail?: string;
  enqId?: number;
  isPORequired?: boolean;
  poExpectedDate?: string;
  salesProductId?: number;
  createdByName?: string;
  modifiedByName?: string;
  createdDate?: Date;
  modifiedDate?: Date;
  isListAllEmp?: boolean;
  actualDeliveryDate?: string;
  expectedDeliveryDate?: string;
  shipArrivedDate?: string;
  cdd?: string;
  isIBConfirmed?: boolean;
  poType?: string;
  engEmployeeNames?: string;
  quoteSubmissionDate?: string;
  svcWOPTATHrs?: number;
  escallationID?: number;
  vendorQuoteExists?: boolean;
  partReqId?: number;
  isConfigProduct?: boolean;
  isEffortsEntered?: boolean;
  psgPerson?: string;
  ioBookedDate?: string;
  canSendSurvey?: boolean;
  contactEmail?: string;
  isContactConfirmed?: boolean;
  isSurveyReq?: boolean;
  ioID?: number;
  hssrId?: number;
  isPsgScheduleBlock?: boolean;
  installedDate?: string;
  warrantyStartDate?: string;
  warrantyFinishDate?: string;
  extendedWarStartDate?: string;
  extendedWarEndDate?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  isPartsReqAllowed?: boolean;
  invoiceStatus?: string;
  isQualificationReq?: boolean;
  warrentyYear?: string;
  addWarrentyYear?: string;
  contractType?: string;
  depth?: number;
  length?: number;
  height?: number;
  roomTemperatureId?: number;
  roomTemperature?: string;
  humidityId?: number;
  humidity?: string;
  ductSize?: string;
  exhaust?: number;
  noOfLan?: number;
  pirgCreatedBy?: number;
  pirgCreatedDate?: Date;
  pirgModifiedBy?: number;
  pirgModifiedDate?: Date;
  svcPIRGenId?: number;
  pirgProductId?: number;
  pirCopy?: string;
  pirContactPersonId?: number;
  pirContactPerson?: string;
  pirEmail?: string;
  custSiteLocation?: string;
  sapNo?: string;
  productCategory?: string;
  customerTagNo?: string;
  manufacturerId?: number;
  manufacturer?: string;
  dueDate?: string;
  subTaskDtls?: string;
  srCompletedDate?: string;
  completedDate?: string;
  srConfirmedByCustConId?: number;
  isThirdPartyEngineer?: boolean;
  poTypeId?: number;
  poFSReasonId?: number;
  poFSRemark?: string;
  reschReason?: number;
  reschRemark?: string;
  awaitingCSR?: boolean;
  resolutionTypeId?: number;
  otherCallsId?: number;
  otherCalls?: string;
  engrResponse?: string;
  csrRemarks?: string;
  isPsgReject?: boolean;
  isLabModfReq?: boolean;
  isCalibration?: boolean;
  isOQPV?: boolean;
  isBDService?: boolean;
  isPreventiveMaintenance?: boolean;
  completedBy?: string;
  completedOn?: string;
  custObserveTargetDate?: string;
  reopenReason?: string;
  custObserveDays?: number;
  cordCommentsONShipment?: string;
  engrHoldReason?: string;
  cordCommentsONPartsReq?: string;
  custDelayRemarks?: string;
  cordCmtsONCustDelay?: string;
  otherReasonRemarks?: string;
  cordCommentsONOthers?: string;
  poRequiredRemarks?: string;
  isNCCall?: boolean;
  isGeneral?: boolean;
  isOthers?: boolean;
  isLab?: boolean;
  isPower?: boolean;
  isUtility?: boolean;
  isCustomer?: boolean;
  isShipmentArrived?: boolean;
  receivedByEmpId?: number;
  isATMandatory?: boolean;
  isPMKitsReq?: boolean;
  isInProgress?: boolean;
  resolutionTime?: number;
  siteReadyEndDate?: string;
  isCustIntimationNeeded?: boolean;
  expertReasonRemarks?: string;
  isScopeDocApplicable?: boolean;
  isPIRMailSent?: boolean;
  suppCategory?: string;
  showPartReqBtn?: boolean;
  partsMasterId?: number;
  partNo?: string;
  applicationId?: number;
  complexityId?: number;
  prodClassificationId?: number;
  systemID?: string;
  systemHandle?: string;
  systemStatusId?: number;
  isInternal?: boolean;
  entitlementPRID?: number;
  isConfigReject?: boolean;
  configRejectRemark?: string;
  isPSGCheckReject?: boolean;
  isPSGCheckCorrected?: boolean;
  psgCheckRejectComments?: string;
  atStatus?: string;
  atComments?: string;
  isATCallContinue?: boolean;
  isATUserAcceptance?: boolean;
  atMissingPartCmts?: string;
  soldToLEId?: number;
  soldToLE?: string;
  soldToContactId?: number;
  soldToContact?: string;
  ticketReference?: string;
  serviceComments?: string;
  subOrdRefNo?: string;
  mainTaskEngrResponse?: string;
  pddAttachment?: string;
  stickerStatusID? : number;
}

export interface svcIBModuleDetails {
  ibModuleId?: number;
  installBaseId?: number | null;
  supplierId?: number | null;
  supplier?: string;
  partNo?: string;
  description?: string;
  option?: string | null;
  serialNo?: string;
  moduleName?: string;
  modelNo?: string;
  partsMasterId?: number | null;
  isChecked?: boolean;
  oldSerialNo?: string;
  oldModuleName?: string;
  oldModelNo?: string;
  productLine?: string;
  versionNo?: string;
  notes?: string;
  isCardSelected?: boolean | null;
  isDescOpen?: boolean | null;
}

export interface svcGetOtherTasksDetails {
  srid?: number | null;
  subTaskId?: number | null;
  taskType?: string | null;
  completedDate: string | null;
  expectedCompletionDate: string | null;
  remarks?: string | null;
  subTaskStatusId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  exceptional?: boolean | null;
  isExceptional?: boolean | null;
  isCardSelected?: boolean | null;
  isDescOpen?: boolean | null;
}

export interface svcGetIBSalesConfigDetails {
  partsMasterID?: number;
  supplierID?: number;
  supplierName?: string;
  partNo?: string;
  option?: string;
  productLine?: string;
  salesProductId?: number;
  description?: string;
  qty?: number;
  quantity?: number | null;
  isCardSelected?: boolean | null;
  isDescOpen?: boolean | null;
}

export interface callActionBO {
  SRID?: number;
  SubTaskId?: number;
  SubTaskStatusId?: number;
  CompletedOn?: string | null;
  LoginID?: number;
  Remarks?: string;
  IsPartsRequired?: boolean;
  ExpPartsArriveDate?: string;
  IsExpertiseRequirement?: boolean;
  IsCustomerDelay?: boolean;
  ExpCustomerDate?: string;
  IsOtherReason?: boolean;
  ExpDate?: string;
  IsPORequired?: boolean;
  AwaitingCSR?: boolean;
  CSRRemarks?: string;
  SerialNo?: string;
  Labmodifcation?: boolean;
  WarrantyFinishDate?: string;
  WarrantyStartDate?: string;
  ExtendedWarStartDate?: string;
  ExtendedWarEndDate?: string;
  Location?: string;
  CustomerTagNo?: string;
  IsCalibration?: boolean;
  IsOQPV?: boolean;
  IsBDService?: boolean;
  IsPreventiveMaintenance?: boolean;
  CustomerId?: number;
  IOID?: number;
  IsInProgress?: boolean;
  ContactPersonId?: number;
  VendorQuoteDocument?: string;
  VendorQuoteSouceTypeID?: number;
  PartReqXml?: string;
  InstallbasemoduleDetails?: svcIBModuleDetails[];
  SapNo?: string;
  ResolutionTypeId?: number;
  OtherCallsId?: number;
  IsConfigReject?: boolean;
  ConfigRejectRemark?: string;
  IsPSGCheckReject?: boolean;
  IsPSGCheckCorrected?: boolean;
  IsThirdPartyEngineer?: boolean;
  ModProductId?: number;
  IsStatusChangeRequired?: boolean;
  IsFromSurvey?: boolean;
  NOSurveyReason?: string;
  LstOtherSubTask?: svcGetOtherTasksDetails[];
  ApplicationId?: number;
  ComplexityId?: number;
  ProdClassificationId?: number;
  StickerStatusId?: number;
  IBStickerAttachment?: any;
  IBStickerAttachmentSrcType?: number;
  CSRAttachment?: any;
  CSRAttachmentSrcType?: number;
  Guid?: string;
  IsAwaitingUserAccptance?: boolean;
  IsATCallContinue?: boolean;
  ATCommentsForMissing?: string;
  ServiceComments?: string;
  ELATRandomNumber?: string;
  ELATAcceptRemarks?: string;
  InstallBaseId?: number;
  Type: string | null;
  SRStatusId? : number;
  SRStatus?: string;
  IsSiteVisitRequired?: boolean; 
  IsReopen?: boolean,
  IsPSG?: boolean,
  CustomerSiteId?: number,
}

@Injectable({
  providedIn: 'root'
})

export class ServiceCalendarService {
  selectedDate!: Date;
  selectedSRID!: number;
  selectedCallCat!: string;
  selectedCallCompletion!: boolean;
  csrComments!: string;
  CSRUploadSrcType: number = 11;
  SRStatusId: number = 3;
  SRSubTaskId: number = 9;
  InstallationSubTaskId: number = 6;
  FieldServiceSubTaskId: number = 11;
  SRCompletedStatus: number = 8;
  SRWaitingStatus: number = 4;
  SRClosedStatus: number = 10;
  delayRemarks!: string;
  addedPartsDetailsCard: svcPartsDetails[] = [];
  moduleDetailsCard: svcIBModuleDetails[] = [];
  otherTasksDetailsCard: svcGetOtherTasksDetails[] = []
  callActionDetails!: callActionBO;
  isSurveyRequired: boolean = false;
  isCallCompleted: boolean = false;

  //IB Sticker Status
  ibStickerPendingStatus: number= 4;
  ibStickerGluedStatus: number= 3;
  ibStickerNotAllowingStatus: number= 2;
  ibStickerImageUploadedStatus: number= 1;

  // public hasPatchedMap: { [key: string]: boolean } = {
  //   completionDetails: false,
  //   installationDetails: false,
  //   systematizationDetails: false,
  //   customerDelay: false,
  //   otherReasonDelay: false,
  //   partsRequiredDelay: false,
  // };

  private getServicePrerequisitesUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetSVCPrerequisites`;
  private getSRLCDetailsUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetSRLCDetails`;
  private getDependentComboUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetDependentCombo`;
  private getDependentComboDataOnLoadUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetServiceDependentComboOnLoad`;
  private getPrerequisiteComboUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetPrerequisiteCombo`;
  private getCustContactByIdUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetCustContactById`;
  private getValidateCSRUrl = `${this.configService.apiUrl}/api/ServiceCalendar/SRLCValidateCSR`;
  private getScheduledCallsUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetScheduledCalls`;
  private postServiceRequestUrl = `${this.configService.apiUrl}/api/ServiceCalendar/UpdServiceRequest`;
  private getEngEffortsUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetEngEfforts`;
  private postEngEffortsUrl = `${this.configService.apiUrl}/api/ServiceCalendar/AddEngEfforts`;
  public  postGenerateCSRUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GenerateCSRPath`;
  private getCSRDownloadFileUrl = `${this.configService.apiUrl}/api/UploadDownload/GetCSRDownloadFile`;
  private postUploadCSRUrl = `${this.configService.apiUrl}/api/ServiceCalendar/UploadCSR`;
  private getPartsSearchUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetPartsDetails`;
  private postPartsRequestUrl = `${this.configService.apiUrl}/api/ServiceCalendar/PartsRequest`;
  private getModuleDetailsUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetModuleDetails`;
  private getOtherTasksDetailsUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetOtherTasksDetails`;
  private getIBSalesConfigDetailsUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetIBSalesConfigDetails`;
  private postCallActionUrl = `${this.configService.apiUrl}/api/ServiceCalendar/UpdateCallAction`;

  constructor(
    private http: HttpService,
    private loginService: LoginService,
    private commonService: CommonService,
    private configService: ConfigService,
    private datePipe: DatePipe
  ) {}

  //API call to get dependent combo data
  getDependentCombo(FieldName: string, Id: number, EmpId: number) {
    const body = {
      fieldName: FieldName,
      id: Id,
      empId: EmpId
    };
    return this.http.post(this.getDependentComboUrl, body);
  }

  //API call to get dependent combo data on load
  getDependentComboDataOnLoad(SRID: number, EmpId: number) {
    const body = {
      srid: SRID,
      empId: EmpId
    };
    return this.http.post(this.getDependentComboDataOnLoadUrl, body);
  }

  //API call to get prerequisite combo data
  getPrerequisiteCombo(Formname: string, EmpId: number) {
    const body = {
      Formname: Formname,
      EmpId: EmpId
    };
    return this.http.post(this.getPrerequisiteComboUrl, body);
  }

  getServicePrerequisites(SRID: number, EmpId: number) {
    const body = {
      srid: SRID,
      empId: EmpId,
    };
    return this.http.post(this.getServicePrerequisitesUrl, body);
  }

  //API call to get contact details by contact id
  getCustContactById(ContactId: number, EmpId: number) {
    const body = {
      contactId: ContactId,
      empId: EmpId,
    };
    return this.http.post(this.getCustContactByIdUrl, body);
  }

  //API call to validate csr details
  getValidateCSR(
    SRID: number, isAwaitingCSR: boolean, resolutionTypeId: boolean,
    completedDate: string, isPartsRequired: boolean, isCustomerDelay: boolean,
    isPORequired: boolean, isOtherReason: boolean, isExpertiseRequirement: boolean,
    isQuoteClose: boolean) {
    const body = {
      srid: SRID,
      isAwaitingCSR: isAwaitingCSR,
      resolutionTypeId: resolutionTypeId,
      completedDate: completedDate,
      isPartsRequired: isPartsRequired,
      isCustomerDelay: isCustomerDelay,
      isPORequired: isPORequired,
      isOtherReason: isOtherReason,
      isExpertiseRequirement: isExpertiseRequirement,
      isQuoteClose: isQuoteClose
    };
    return this.http.post(this.getValidateCSRUrl, body);
  }

  //API call to get SRLC Details
  getSRLCDetails(SRID: number, EmpId: number) {
    const body = {
      SRID: SRID,
      EmpID: EmpId
    };
    return this.http.post(this.getSRLCDetailsUrl, body);
  }

  //API call to get Module Details
  getModuleDetails(InstallBaseId: number, EmpId: number) {
    const body = {
      InstallBaseId: InstallBaseId,
      LoginID: EmpId
    };
    return this.http.post(this.getModuleDetailsUrl, body);
  }

  //API call to get Other Tasks Details
  getOtherTasksDetails(SRID: number, EmpId: number) {
    const body = {
      SRID: SRID,
      EmpID: EmpId
    };
    return this.http.post(this.getOtherTasksDetailsUrl, body);
  }

  //API call to get IB Sales Config Details
  getIBSalesConfigDetails(InstallBaseId: number, LoginId: number) {
    const body = {
      installBaseId: InstallBaseId,
      loginId: LoginId
    };
    return this.http.post(this.getIBSalesConfigDetailsUrl, body);
  }

  //API call to fetch calls scheduled for that day
  getScheduledCalls(EmpId: number, ScheduledDate: Date) {
    const formattedDate = ScheduledDate
      ? this.datePipe.transform(ScheduledDate, 'yyyy-MM-dd')
      : null;
    const body = {
      empId: EmpId,
      scheduledDate: formattedDate
    };
    return this.http.post(this.getScheduledCallsUrl, body);
  }

  //API call to fetch engineer efforts
  getEngEfforts(EmpId: number, SRID: number) {
    const body = {
      empId: EmpId,
      srid: SRID
    };
    return this.http.post(this.getEngEffortsUrl, body);
  }

  //API call to update service request screen changes
  postServiceRequest(SRID: number, ContactPersonId: number, ContactEmail: string, IsContactConfirmed: boolean,
    CallDescription: string, IsIBConfirmed: boolean) {
    const body = {
      srid: SRID,
      contactPersonId: ContactPersonId,
      contactEmail: ContactEmail,
      isContactConfirmed: IsContactConfirmed,
      callDescription: CallDescription,
      isIBConfirmed: IsIBConfirmed,
      loginID: this.loginService.employeeId as number
    };
    return this.http.post(this.postServiceRequestUrl, body);
  }

  //API call to update service efforts entered by engineer
  putServiceEfforts(formData: any) {
    const formattedStartDate = formData.startTime
      ? this.datePipe.transform(formData.startTime, "yyyy-MM-dd'T'HH:mm:ss")
      : null;

    const formattedEndDate = formData.endTime
      ? this.datePipe.transform(formData.endTime, "yyyy-MM-dd'T'HH:mm:ss")
      : null;

    const body = {
      srid: formData.srid,
      lstEfforts: [
        {
          empId: this.loginService.employeeId,
          srSchId: formData.sRSchId,
          subTaskId: formData.subTaskId,
          calendarId: formData.calendarId,
          onDate: formData.onDate,
          startTime: formData.startTime ? formattedStartDate : '',
          endTime: formData.endTime ? formattedEndDate : '',
          effortHours: formData.effortHours,
          travelHours: formData.travelHours,
          isNoEffortSpent: formData.isNoEffortSpent,
          remarks: formData.remarks ? formData.remarks : '',
          subTaskScheduleDtlId: formData.subTaskScheduleDtlId
        }
      ],
      loginId: this.loginService.employeeId
    };
    return this.http.post(this.postEngEffortsUrl, body);
  }

  //API call to generate new CSR file after signature
  getCSRfile(SRID: number, CSRSummary: string, CallCategory: string, IsCallCompleted: boolean, CustomerSign: string, EngineerSign: string) {
    const body = {
      "SRID": SRID,
      "LoginID": this.loginService.employeeId,
      "CSRSummary": CSRSummary,
      "CallCategory": CallCategory,
      "IsCallCompleted": IsCallCompleted,
      "CustomerSign": CustomerSign ? CustomerSign : null,
      "EngineerSign": EngineerSign ? EngineerSign : null
    };
    return this.http.post(this.postGenerateCSRUrl, body);
  }

  //API call to get generated CSR file
  getCSRPdf(FilePath: string) {
    const body = {
      "FilePath": FilePath
    };
    return this.http.post(this.getCSRDownloadFileUrl, body, { responseType: 'arraybuffer', observe: 'response' });
  }

  //API call to upload CSR file
  putUploadCSR(docSrcVal: string, attachment: any) {

    const body = new FormData();
    body.append('docSrcVal', docSrcVal);
    body.append('docSrcType', this.CSRUploadSrcType as any);
    body.append('LoginID', this.loginService.employeeId as string);
    body.append('attachment', attachment ? attachment : null);

    return this.http.put(this.postUploadCSRUrl, body);
  }

  //API call to get searched parts details
  getSearchPartsDetails(ManufacturerId: number, SupplierId: number, PartNo: string, Description: string, ProductLine: string, PartsReqId: number, SRID: number) {
    const body = {
      manufactureId: ManufacturerId,
      supplierId: SupplierId ? SupplierId : 0,
      partNo: PartNo,
      description: Description,
      productLine: ProductLine,
      partReqId: PartsReqId,
      SRID: SRID
    };
    return this.http.post(this.getPartsSearchUrl, body);
  }

  //API call to request for added parts
  postPartsRequest(SRID: number, PartReqId: number, CustomerId: number, IOID: number,
    VendorQuoteDocument: string, VendorQuoteSouceTypeID: number,
    lstPartReq: svcPartsRequest[], Source: string, IsInProgress: boolean) {
    const body = {
      srid: SRID,
      partReqId: PartReqId,
      customerId: CustomerId,
      ioid: IOID,
      CreatedBy: this.loginService.employeeId,
      ModifiedBy: this.loginService.employeeId,
      vendorQuoteDocument: VendorQuoteDocument,
      vendorQuoteSouceTypeID: VendorQuoteSouceTypeID,
      lstPartReq: lstPartReq,
      source: Source,
      isInProgress: IsInProgress
    };
    return this.http.post(this.postPartsRequestUrl, body);
  }

  //Assigning call action parameters
  assignCallActionParams(SRLCLabel: svcGetSRLCDetails){
    this.callActionDetails = {
      SRID: SRLCLabel.srid,
      SubTaskId: 0, //check
      SubTaskStatusId: 1,
      CompletedOn: SRLCLabel.completedDate? SRLCLabel.completedDate: '',
      LoginID: this.loginService.employeeId as number,
      Remarks: '',
      IsPartsRequired: SRLCLabel.isPartsRequired? SRLCLabel.isPartsRequired : false,
      ExpPartsArriveDate: SRLCLabel.expPartsArriveDate? SRLCLabel.expPartsArriveDate: '',
      IsExpertiseRequirement: SRLCLabel.isExpertiseRequirement? SRLCLabel.isExpertiseRequirement : false,
      IsCustomerDelay: SRLCLabel.isCustomerDelay? SRLCLabel.isCustomerDelay : false,
      ExpCustomerDate: SRLCLabel.expCustomerDate? SRLCLabel.expCustomerDate: '',
      IsOtherReason: SRLCLabel.isOtherReason? SRLCLabel.isOtherReason : false,
      ExpDate: SRLCLabel.expDate? SRLCLabel.expDate: '',
      IsPORequired: SRLCLabel.isPORequired? SRLCLabel.isPORequired : false,
      AwaitingCSR: SRLCLabel.awaitingCSR? SRLCLabel.awaitingCSR : false,
      CSRRemarks: SRLCLabel.csrRemarks? SRLCLabel.csrRemarks: "",
      SerialNo: SRLCLabel.serialNumber? SRLCLabel.serialNumber: '',
      Labmodifcation: SRLCLabel.isLabModfReq? SRLCLabel.isLabModfReq : false,
      WarrantyFinishDate: SRLCLabel.warrantyFinishDate? SRLCLabel.warrantyFinishDate: '',
      WarrantyStartDate: SRLCLabel.warrantyStartDate? SRLCLabel.warrantyStartDate: '',
      ExtendedWarStartDate: SRLCLabel.extendedWarStartDate? SRLCLabel.extendedWarStartDate: '',
      ExtendedWarEndDate: SRLCLabel.extendedWarEndDate? SRLCLabel.extendedWarEndDate: '',
      Location: SRLCLabel.custSiteLocation,
      CustomerTagNo: SRLCLabel.customerTagNo,
      IsCalibration: SRLCLabel.isCalibration? SRLCLabel.isCalibration : false,
      IsOQPV: SRLCLabel.isOQPV? SRLCLabel.isOQPV : false,
      IsBDService: SRLCLabel.isBDService? SRLCLabel.isBDService : false,
      IsPreventiveMaintenance: SRLCLabel.isPreventiveMaintenance? SRLCLabel.isPreventiveMaintenance : false,
      CustomerId: SRLCLabel.customerId,
      IOID: SRLCLabel.ioID,
      IsInProgress: SRLCLabel.isInProgress? SRLCLabel.isInProgress : false,
      ContactPersonId: SRLCLabel.contactPersonId,
      VendorQuoteDocument: '',
      VendorQuoteSouceTypeID: 0,
      PartReqXml: '',
      InstallbasemoduleDetails: this.moduleDetailsCard,
      SapNo: SRLCLabel.sapNo,
      ResolutionTypeId: SRLCLabel.resolutionTypeId? SRLCLabel.resolutionTypeId: 0,
      OtherCallsId: SRLCLabel.otherCallsId? SRLCLabel.otherCallsId: 0,
      IsConfigReject: SRLCLabel.isConfigReject? SRLCLabel.isConfigReject : false,
      ConfigRejectRemark: SRLCLabel.configRejectRemark? SRLCLabel.configRejectRemark: '',
      IsPSGCheckReject: SRLCLabel.isPsgReject? SRLCLabel.isPsgReject : false,
      IsPSGCheckCorrected: SRLCLabel.isPSGCheckCorrected? SRLCLabel.isPSGCheckCorrected : false,
      IsThirdPartyEngineer: SRLCLabel.isThirdPartyEngineer? SRLCLabel.isThirdPartyEngineer : false,
      ModProductId: SRLCLabel.productID? SRLCLabel.productID: 0,
      IsStatusChangeRequired: SRLCLabel.completedDate? true: false,
      IsFromSurvey: false, //check from survey
      NOSurveyReason: '',  //check from survey
      LstOtherSubTask: this.otherTasksDetailsCard,
      ApplicationId: SRLCLabel.applicationId,
      ComplexityId: SRLCLabel.complexityId,
      ProdClassificationId: SRLCLabel.prodClassificationId,
      StickerStatusId: SRLCLabel.stickerStatusID,
      Guid: '',
      IsAwaitingUserAccptance: SRLCLabel.srStatusID == 7? true: SRLCLabel.isATUserAcceptance? SRLCLabel.isATUserAcceptance : false,
      IsATCallContinue: SRLCLabel.isATCallContinue? SRLCLabel.isATCallContinue : false,
      ATCommentsForMissing: SRLCLabel.atMissingPartCmts? SRLCLabel.atMissingPartCmts : '',
      ServiceComments: SRLCLabel.serviceComments? SRLCLabel.serviceComments : '',
      ELATRandomNumber: '',
      ELATAcceptRemarks: SRLCLabel.atComments? SRLCLabel.atComments : '',
      InstallBaseId: SRLCLabel.installBaseID? SRLCLabel.installBaseID: 0,
      Type: null,
      SRStatusId: SRLCLabel.srStatusID? SRLCLabel.srStatusID: 0,
      SRStatus: SRLCLabel.srStatus? SRLCLabel.srStatus: '',
      IsSiteVisitRequired: true,
      IsReopen: false,
      IsPSG: false,
      CustomerSiteId: SRLCLabel.customerSiteId? SRLCLabel.customerSiteId: 0,
      IBStickerAttachmentSrcType: this.commonService.docIBStickerAttachment,
      CSRAttachmentSrcType: this.commonService.docSrcTypeCSRAttachment,
    };
  }

  // postCallAction(callActionBO: callActionBO){
  //   const body = {
  //     callActionBO: callActionBO
  //   };
  //   return this.http.post(this.postCallActionUrl, body);
  // }

  postCallAction(callActionBO: callActionBO) {
    const body = new FormData();

    Object.keys(callActionBO).forEach(key => {
      let value = callActionBO[key as keyof typeof callActionBO];
    
      if (value !== null && value !== undefined) {
        if (typeof value === "boolean") {
          body.append(key, value ? "true" : "false");
        } 
        else if (typeof value === "number") {
          body.append(key, value.toString());
        } 
        else if (value instanceof Date) {
          body.append(key, value.toISOString());
        }
        else if (typeof value === "string" && value.trim() === "") {
          body.append(key, "");
        } 
        else if (Array.isArray(value)) {
          body.append(key, JSON.stringify(value));
        } 
        else if (typeof value === "object") {
          body.append(key, JSON.stringify(value)); 
        } 
        else {
          body.append(key, value.toString());
        }
      }
    });
    if (callActionBO.IBStickerAttachment && callActionBO.IBStickerAttachment.length > 0) {
      body.append("ibStickerAttachment", callActionBO.IBStickerAttachment[0]);
    }
    if (callActionBO.CSRAttachment && callActionBO.CSRAttachment.length > 0) {
      body.append("csrAttachment", callActionBO.CSRAttachment[0]);
    }
  
    return this.http.post(this.postCallActionUrl, body);
  }

  //Function to reset all the common values stored in calendar service
  resetValues() {
    this.selectedSRID = 0;
    this.selectedCallCat = "";
    this.selectedCallCompletion = false;
    this.csrComments = "";
    this.delayRemarks = "";
    this.addedPartsDetailsCard = [];
    this.moduleDetailsCard = [];
    this.otherTasksDetailsCard = [];
    this.callActionDetails =  null as any;
    this.isSurveyRequired = false;
    // Object.keys(this.hasPatchedMap).forEach(key => {
    //   this.hasPatchedMap[key] = false;
    // });
  }

}
