import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { LoginService } from '../login/components/login/login.service';
import { ConfigService } from 'src/app/core/services/config.service';


export interface prDependentComboData {
  comboId?: number;
  comboName?: string;
  comboType?: string;
  refId?: number;
  specialType?: string;
}

export interface partsRequestList {
  partReqId?: number;
  claimStatusId?: number;
  customerName?: string;
  customerId?: number;
  ioid?: number;
  ioNo?: string;
  prvalue?: string;
  srvalue?: string;
  claimMode?: string;
  claimStatus?: string;
  amendmentStatusId?: number;
  amendmentStatus?: string;
  isEditable?: boolean;
  eono?: string;
  custPONO?: string;
  respDeptId?: number;
  departmentName?: string;
  reason?: string;
  leSiteId?: number;
  leSiteName?: string;
  shiptoSiteRegion?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface partsRequestResult {
  partReqId?: number | null;
  customerId?: number | null;
  customerName?: string | null;
  leSiteId?: number | null;
  leSiteName?: string | null;
  custConId?: number | null;
  reqEmpId?: number | null;
  requestedBy?: string | null;
  requestedDate?: string | null;
  approvedBy?: number | null;
  reqApprover?: string | null;
  reqModeId?: number | null;
  srId?: number | null;
  ioid?: number | null;
  ioNo?: string | null;
  mfgStatusId?: number | null;
  orderValue?: number | null;
  mfgClaimDate?: string | null;
  mfgApprvedBy?: number | null;
  mfgApprvedName?: string | null;
  mfgApprovalDoc?: string | null;
  respDeptId?: number | null;
  responsibleDept?: string | null;
  reasonId?: number | null;
  reason?: string | null;
  reqComments?: string | null;
  deliverToID?: number | null;
  deliveryTo?: string | null;
  deliveryLocationId?: number | null;
  deliveryLocation?: string | null;
  orderPriorityId?: number | null;
  priority?: string | null;
  claimReject?: number | null;
  claimRejComments?: string | null;
  mfgQuoteDocument?: string | null;
  createdDate?: Date | string | null;
  createdBy?: number | null;
  modifiedDate?: Date | string | null;
  modifiedBy?: number | null;
  modifiedName?: string | null;
  createdName?: string | null;
  requestedMode?: string | null;
  approverComments?: string | null;
  ofApproverComments?: string | null;
  plApproverComments?: string | null;
  waitingRemarks?: string | null;
  engineerComments?: string | null;
  sapNo?: string | null;
  claimStatusId?: number | null;
  claimStatus?: string | null;
  installationDate?: string | null;
  isClaimDoc?: string | null;
  isManuAppDoc?: string | null;
  isQuoteDoc?: string | null;
  ofApprover?: string | null;
  enquiryID?: string | null;
  remarks?: string | null;
  approvedDate?: string | null;
  isFromSRLC?: boolean | null;
  totalOrderValue?: number | null;
  isInstallCall?: boolean | null;
  salProductId?: number | null;
  orderCategoryType?: string | null;
  isSRID?: number | null;
  expectedArrivaldate?: string | null;
  isInstrumentMand?: boolean | null;
  quoteValue?: number | null;
  isBillable?: boolean | null;
  sparesProvisionAmt?: number | null;
  consumedvalue?: number | null;
  eono?: string | null;
  eoDate?: string | null;
  eoRemarks?: string | null;
  srvalue?: string | null;
  isAmendQuote?: boolean | null;
  afterMarginBC?: number | null;
  beforeMarginBC?: number | null;
  afterMarginBCPC?: number | null;
  beforeMarginBCPC?: number | null;
  subOrderId?: number | null;
  subOrdRefNo?: string | null;
  subOrderAmtFC?: number | null;
  soFileCount?: string | null;
  isProjects?: string | null;
  soldToLEId?: number | null;
  soldToLE?: string | null;
  soldToContact?: string | null;
  soldToContactId?: number | null;
  ofPartId?: number | null;
  ofPartNo?: string | null;
  srIOID?: number | null;
  installbaseId?: number | null;
  instrument?: string | null;
  manufacturer?: string | null;
  supplier?: string | null;
  serialNo?: string | null;
  systemId?: string | null;
  systemStatus?: string | null;
  principlewarrantyPeriod?: string | null;
  companyWarrantyPeriod?: string | null;
  isUnformalized?: boolean | null;
  procurementModeID?: number | null;
  reasonTypeId?: number | null;
  pliono?: string | null;
  orderId?: string | null;
  orderSubCategoryType?: string | null;
  validity?: string | null;
  entitlement?: string | null;
  callCategoryId?: number | null;
  callCategory?: string | null;
  callTypeId?: number | null;
  callType?: string | null;
  callDescription?: string | null;
  amendmentStatus?: string | null;
  amendmentStatusId?: number | null;
  amendmentRequesterComments?: string | null;
  amendmentApproverComments?: string | null;
}

export interface searchPartsBySRID {
  partReqId?: number;
  partsID?: number;
  partListID?: number;
  eono?: string;
  eoDate?: string;
  partNo?: string;
  hcbPart?: string;
  supplierID?: number;
  supplierName?: string;
  option?: string;
  description?: string;
  productLine?: string;
  quantity?: number;
  retQuantity?: number;
  amendmentQty?: number;
  discount?: number;
  unitPrice?: number;
  currency?: number;
  currencyName?: string;
  status?: number;
  partStatus?: string;
  arrivedDate?: string;
  orderValue?: number;
  conversionRate?: number;
  pl_ArrivedDate?: string;
  remark?: string;
  procurementReasonId?: number;
  procurementReason?: string;
  isPartItemEdit?: boolean;
  configItemId?: number;
  itemSP?: number;
  unitItemSP?: number;
  isVendorQoteMandat?: boolean;
  isCurrencyEdit?: boolean;
  isDiscountEdit?: boolean;
  isPricingShow?: boolean;
  isGenericPart?: boolean;
  isActive?: boolean;
  partsContractId?: number;
  suppDiscount?: number;
  installBaseId?: number;
  ibSerialNumber?: string;
  entitlementPartID?: number;
  entitlementPartNo?: string;
  entitlementSupplierID?: number;
  entitlementSupplier?: string;
  entitlementOption?: string;
  isEntitlementEdit?: boolean;
  errorMessage?: string;
  isCardSelected?: boolean; 
  isDescriptionOpen?: boolean;
}

export interface currencyConversion {
  buyingCurrencyID?: number | null;
  sellingCurrencyID?: number | null;
  conversionRate?: number | null;
}

@Injectable({
  providedIn: 'root'
})

export class PrlcService {
  skip = 0;
  total = 0;
  isAllCardSelected: boolean = false;

  private getServiceComboUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetServiceCombo`;
  private getPRLCDependentComboUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetPRLCDependentCombo`;
  private getPRLCWorklistUrl = `${this.configService.apiUrl}/api/ServiceCalendar/SearchPartsRequest`;
  private getPartsListBySRIDUrl = `${this.configService.apiUrl}/api/ServiceCalendar/SearchPartsBySRID`;
  private getPartsRequestDetailsUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetPartsRequest`;
  private getCurrencyConversionDetailsUrl = `${this.configService.apiUrl}/api/ServiceCalendar/GetCurrencyConversion`;

  //Default Status
  public ManagerApproval = "Manager Approval";
  public PLApprlPending = "PL Approval Pending";
  public ManagementApproval = "Management Approval";
  public WithPL = "With PL";
  public Draft = "Draft";

  constructor(
    private http: HttpService,
    private loginService: LoginService,
    private configService: ConfigService,
  ) {}

  //API call to get service combo data
  getServiceCombo(Formname: string, EmpId: number) {
    const body = {
      Formname: Formname,
      EmpId: EmpId
    };
    return this.http.post(this.getServiceComboUrl, body);
  }

  //API call to get dependent combo data
  getPRLCDependentCombo(FieldName: string, Id: number, EmpId: number) {
    const body = {
      fieldName: FieldName,
      id: Id,
      empId: EmpId
    };
    return this.http.post(this.getPRLCDependentComboUrl, body);
  }

  //API call to get fetch PRLC Worklist data
  getPRLCWorklist(EmpId: number) {
    const body = {
      srid: 0,
      customerId: 0,
      reqModeId: null,
      respDepartmentId: null,
      srStatusId: "10,4,12,6,1,11,13,9,5",
      orderRef: null,
      reqById: 0,
      empId: EmpId,
      isWorkingList: true,
      customerGroupId: 0,
      regionIds: null,
      dashBoardClaimStatusId: 0,
      createdById: 0,
      partsRequestId: 0,
      eono: null,
      isShipExp: false,
      custPONO: null
    };
    return this.http.post(this.getPRLCWorklistUrl, body);
  }

  //API call to get fetch Parts List based on SRID
  getPartsListBySRID(srid: number, partsReqId: number, type: string | null) {
    const body = {
      srid: srid,
      PartsReqId: partsReqId,
      LoginID: this.loginService.employeeId as number,
      Type: type
    };
    return this.http.post(this.getPartsListBySRIDUrl, body);
  }

  //API call to get fetch Parts Request Details
  getPartsRequestDetails(partsReqId: number, srid: number) {
    const body = {
      partsId: partsReqId,
      srid: 0
    };
    return this.http.post(this.getPartsRequestDetailsUrl, body);
  }

  //API call to get fetch Currency Conversion Rate Details
  getCurrencyConversionDetails() {
    return this.http.get(this.getCurrencyConversionDetailsUrl);
  }

  //Function to reset common values stored in sales-parts-service
  resetValues() {
    this.isAllCardSelected = false;
  }

  //Function to reset pagination related values stored in sales-parts-service
  resetPaginationValues(){
    this.skip = 0;
    this.total = 0;
  }

}
