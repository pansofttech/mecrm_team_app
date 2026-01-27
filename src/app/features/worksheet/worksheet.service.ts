import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { LoginService } from '../login/components/login/login.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { DatePipe } from '@angular/common';

//All interfaces used in worksheet module
export interface WorkSheetSO {
  workSheetId: number;
  enqId: number;
  poExpectedDate: string;
  leadNo: string;
  leadStatus: string;
  isDeliveryMileType: number;
  customerName: string;
  quoteCompanyId?: number;
  paymentNoOfDays?: number;
  grossSPQC: number;
  grossSPBC?: number;
  advancedTraining?: number;
  otherCommitments?: number;
  gstExemptionValue?: number;
  gstExemptionPC?: number;
  sgst?: number;
  igst?: number;
  cgst?: number;
  sacCode: string;
  gstNo: string;
  trn?: string;
  vatPC?: number;
  vat?: number;
  netSPQC?: number;
  netSPBC?: number;
  taxPC?: number;
  taxTypeId?: number;
  taxValueQC?: number;
  taxValueBC?: number;
  quoteValueQC?: number;
  quoteValueBC: number;
  specialDiscountPC?: number;
  discountValue?: number;
  discountValueBC: number;
  isAccessWSApproval?: boolean;
  isPSGCheckPending?: number;
  totalTransOverheadQC?: number;
  totalTransOverheadBC?: number;
  soUnitRateWOPLCQC?: number;
  soTotRateWOPLCQC?: number;
  soUnitRateWOPLCBC?: number;
  soTotRateWOPLCBC?: number;
  totalSPQC?: number;
  totalSPBC?: number;
  plcQC?: number;
  plcBC?: number;
  sowspDifferenceQC: number;
  sowspDifferenceBC?: number;
  isDutyChangeAllowed?: boolean;
  isDutyFree?: boolean;
  sellingPriceMaintained?: boolean;
  isLeadLevelDiscount?: boolean;
  isProductLevelDiscount?: boolean;
  isItemLevelDiscount?: boolean;
  isFlatAmount?: boolean;
  isGSTExempted?: boolean;
  gstExemptedPC?: number;
  gstExemptedValue?: number;
  currentApproverComments?: string;
  currentApprovalLevel: string;
  nextApprovalLevel: number;
  level1Comments: string;
  level2Comments: string;
  level3Comments: string;
  level4Comments: string;
  otherCommitmentRemarks?: string;
  isDiscountCapExempted?: boolean;
  isContractRateChanged?: boolean;
  firstLevelApprover: string;
  secondLevelApprover: string;
  thirdLevelApprover: string;
  fourthLevelApprover: string;
  pendingApprovalMsg: string;
  isWSEditAllowed?: boolean;
  wsCreatedDate?: Date;
  wsCreatedBy: string;
  wsPreparedDate?: Date;
  wsPreparedBy: string;
  ssdContractTypeId?: number;
  isPriceEdited?: boolean;
  drqStatus: string;
  isOmanVATApplicable?: boolean;
  isOrderMapped: string;
  discFileExists?: number;
  additnSuppDiscQC?: number;
  additnSuppDiscBC?: number;
  loginLevel: string;
  totOutStanding: number;
  marginPC: number;
  marginQC: number;
  reasonForWSApproval: string;
  approvalLevelBGColor?: string;
  approvalLevelLBColor?: string;
  reCalcSysDisc: string;
  drqqC_PC?: number;
  drqbC_PC?: number;
}

export interface WorksheetPrerequisites{
  quoteCompanyName: string;
  baseCurrency: string;
  baseCurrencyId: number;
  quoteCurrencyName: string;
  quoteCurrencyId: number;
  conversionRate: number;
  marginExcelDownloadPrivilege?: number;
  isSalesManager?: boolean;
}

export interface WorksheetPaymentTerms {
  salePaymentId: number;
  payMileStoneId: number;
  paymentMilestone?: string;
  creditPercentage: number;
  percentage: number;
  creditDays: number;
  processDays: number;
  remarks?: string;
  isSelected: boolean;
  isDeleted: boolean;
  rankNo: number;
  color?: string;
}

export interface EnquiryDetails {
  dealNo: string;
  enqID: number;
  soldToLEID: number;
  soldToLE: string;
  salesChannel?: string;
  enqStatusId: number;
  enqStatus: string;
  salesExecutiveID: number;
  salesExecutive: string;
  soldToContact: string;
  wsApprovalPendingWith: string;
  soldToContPhoneNo: string;
  soldToContactEmail: string;
  discPct: number;
  drqStatus: string;
  approxQuotevalue: number;
}

export interface EnquiryProductsSO {
  salesProductId?: number;
  enqId?: number;
  prodSeqNo?: number;
  supplierId?: number;
  supplierName: string;
  productId?: number;
  productName: string;
  prodStatusId?: number;
  prodStatusName: string;
  leadPositionId?: number;
  leadPosition: string;
  productPositionId?: number;
  productPositionName: string;
  quantity?: number;
  warrantyPC?: number;
  addlWarrantyPC?: number;
  warrentyYear?: number;
  addWarrentyYear?: number;
  trainingCost?: number;
  specialDiscountAmt?: number;
  _ProdPurchaseCost?: number;
  _ProdWarranty?: number;
  _AdjProdAddlWarranty?: number;
  _ProdTrgCost?: number;
  _ProdAdvTrgCost?: number;
  _ProdCommitments?: number;
  _ProdSellingPrice?: number;
  _AdjProdSellingPrice?: number;
  prodSplDiscount?: number;
  _ProdAddlWarranty?: number;
  prodSp?: number;
  quoteCurrencyName: string;
  quotevalue?: number;
  createdBy?: number;
  createdByName: string;
  createdDate: Date | string; // Date represented as string for simplicity
  modifiedBy?: number;
  modifiedByName: string;
  modifiedDate: Date | string; // Date represented as string for simplicity
  totalTransOverheadQC?: number;
  totalDerivedDiscQC?: number;
  totalSPQC?: number;
  quoteSellingPriceQC?: number;
  quoteSellingPriceBC?: number;
  isMaintainSellingPrice?: boolean;
  soRateWOPLC?: number;
  soUnitRateWOPLCQC?: number;
  soTotRateWOPLCQC?: number;
  soUnitRateWOPLCBC?: number;
  soTotRateWOPLCBC?: number;
  s_USOP?: number;
  s_TSOP?: number;
  ttc?: number;
  tsd?: number;
  q_USOP?: number;
  q_TSOP?: number;
  tqd?: number;
  tqdpc?: number;
  nsop?: number;
  averageDiscountCapPCAllowed?: number;
  maximumDiscountAllowed?: number;
  isRefInstalmandate?: boolean;
}

export interface ConfigItems {
  configItemId?: number;
  salesProductId?: number;
  productId?: number;
  productName?: string;
  prodSeqNo?: number;
  supplierID?: number;
  supplierName?: string;
  productline?: string;
  partNo?: string;
  option?: string;
  description?: string;
  quoteQty?: number;
  itemPurchaseCost?: number;
  itemSP?: number;
  unitSORateQC?: number;
  totalSORateQC?: number;
  totalTransOverheadQC?: number;
  totalSPQC?: number;
  quoteSellingPriceQC?: number;
  quoteSellingPriceBC?: number;
  totalSONetSPQC?: number;
  splDiscountAmtQC?: number;
  totalDerivedDiscPC?: number;
  totalDerivedDiscQC?: number;
  isMaintainSellingPrice?: boolean;
  rateTypeId?: number;
  isOptional?: boolean;
  serialNumber?: string;
  reqdQty?: number;
  contractMarginPC?: number;
  contractOverheads?: number;
  contractRate?: number;
  isDeliveryMilestone?: boolean;
  priced?: number;
  s_USOP?: number;
  s_TSOP?: number;
  ttc?: number;
  tsd?: number;
  q_USOP?: number;
  q_TSOP?: number;
  tqd?: number;
  tqdpc?: number;
  nsop?: number;
  isStandingOrder?: boolean;
  maxDiscToBeAllowed?: number;
  maxDiscPCAllowed?: number;
  isAlternateProduct?: number;
  isPriceEdited?: boolean;
  hCBPart?: string;
  isHighQuoteSelloutok?: boolean;
  isDLCApplied?: boolean;
}

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
  approxQuotevalue: number;
  drqStatus: string;
  quoteCurrencyName: string;
}

export interface WorksheetDLCList {
  isDeletable?: boolean;
  dealLevelCostId?: number;
  enqId?: number;
  partsMasterId?: number;
  supplierId?: number;
  supplierName?: string;
  productLine?: string;
  description?: string;
  qty?: number;
  partNo?: string;
  options?: string;
  sellIn?: number;
  unitSellOut?: number;
  sellOutValue?: number;
  isAllowEdit?: boolean;
  remarks?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
  isDescriptionOpen?: boolean;
}

export interface WorksheetMarginList {
  productName?: string;
  supplierName?: string;
  productLine?: string;
  subCategoryName?: string;
  partNo?: string;
  partNoOption?: string;
  description?: string;
  isOptional?: boolean;
  isAlternateProduct?: boolean;
  listPrice?: number;
  supplierCurrency?: string;
  siDiscountPC?: number;
  reqdQty?: number;
  conversionRate?: number;
  warrantyPC?: number;
  finChargesPC?: number;
  freightPC?: number;
  incentivePC?: number;
  countrySpecPC?: number;
  dutyPC?: number;
  dgPC?: number;
  marginPC?: number;
  channelDiscountPC?: number;
  s_USOLP?: number;
  s_TSOLP?: number;
  totalDealLevelCostQC?: number;
  quoteSellingPriceQC?: number;
  quoteDiscQC?: number;
  drqPC?: number;
  isHighQuoteSelloutok?: boolean;
  unitQuoteSellingPriceQC?: number;
  isUnManagedSupplier?: boolean;
}

export interface WorksheetDRQList {
  DRQId?: number;
  DRQNo: string;
  LeadNo: string;
  Customer: string;
  SupplierId?: number;
  SupplierName: string;
  DRQStatusId?: number;
  DRQStatus: string;
  AccountManager: string;
  SalesManager: string;
  CategoryManager: string;
  DRQBy: string;
  DRQDate: string;
  ApprovedDate?: string;
  DRQValidityDate?: string;
  SMComments: string;
  CMComments: string;
}

export interface WorksheetDRQItemsList {
  drqDtlId?: number;
  configItemId?: number;
  partsMasterId?: number;
  salesProductId?: number;
  productId?: number;
  productName?: string;
  supplierId?: number;
  supplierName?: string;
  partNo?: string;
  option?: string;
  description?: string;
  productLine?: string;
  prodSeqNo?: number;
  configSeqNo?: number;
  isDRQ?: boolean;
  sellinDiscountPC?: number;
  drqDiscountPC?: number;
  reqDRQPC?: number;
  unitAddlDiscount?: number;
  addDiscount?: number;
  unitAddDiscount_QC?: number;
  addDiscount_QC?: number;
  unitDiscount?: number;
  totalDiscount?: number;
  unitDiscount_QC?: number;
  totalDiscount_QC?: number;
  sellInPrice?: number;
  drqNo?: string;
  drqDate?: string;
  approvedDate?: string;
  drqItemStatus?: number;
  smComments?: string;
  currency?: string;
  uom?: string;
  drqId?: number;
  reqdQty?: number;
  listPrice?: number;
  newParts?: number;
  deletedParts?: number;
  unitSellInPrice?: number;
  netSellIn?: number;
  drqStatusId?: number;
  isOptional?: boolean;
  alternateOfferNo?: number;
  drqpC_Prev?: number;
  reqDRQPC_Prev?: number;
  isDiscModified?: number;
  isQtyModified?: number;
}

export interface LstDRQRequestBO {
  drqDtlId?: number;
  configItemId?: number;
  partsMasterId?: number;
  supplierId?: number;
  drqId?: number;
  sellinDiscountPC?: number;
  drqDiscountPC?: number;
  reqDRQPC?: number;
  productLine?: string;
  smComments?: string;
  guId?: string;
}

export interface DRQRequestBO {
  EnqId: number;
  DRQId: number;
  SupplierId: number;
  DRQIds: string;
  SMComments: string;
  Type: string;
  ApprovedCommens: string;
  DRQValidityDate?: Date;
  LoginID: number;
  DRQItems: LstDRQRequestBO[];
  SupplierList: LstDRQRequestBO[];
  DRQApprovedListBO: LstDRQRequestBO[];
}

export interface MarginProductGridList {
  productName: string;
  _QuoteMarginPC?: number;
  _TotalCostQC?:number,
  _NetQuote?: number,
}

export interface MarginSupplierGridList {
  supplierName: string;
  _QuoteMarginPC?: number;
  _TotalCostQC?:number,
  _NetQuote?: number,
}

export interface MarginPartsGridList {
  productLine?: string;
  partNo?: string;
  partNoOption?: string;
  description?: string;
  _QuoteMarginPC?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorksheetService {
  private getWorksheetWorklistUrl = `${this.configService.apiUrl}/api/Enquiry/FetchWorksheetWorklist`;
  private getWorksheetDetailsUrl = `${this.configService.apiUrl}/api/Worksheet/GetWorksheetDetails`;
  private getWorksheetPrerequisiteUrl = `${this.configService.apiUrl}/api/Worksheet/GetWorksheetPrerequisites`;
  private getWorksheetDLCDetailsUrl = `${this.configService.apiUrl}/api/Worksheet/GetWorksheetDLCDetails`;
  private getWorksheetMarginDetailsUrl = `${this.configService.apiUrl}/api/Worksheet/GetWorksheetMarginDetails`;
  private getWorksheetDRQDetailsUrl = `${this.configService.apiUrl}/api/Worksheet/GetWorksheetDRQDetails`;
  private getWorksheetDRQItemsDetailsUrl = `${this.configService.apiUrl}/api/Worksheet/GetWorksheetDRQItemsDetails`;
  private getPaymentTermsUrl = `${this.configService.apiUrl}/api/Worksheet/GetPaymentTermsByCustomer`;
  private getEnquiryProductsUrl = `${this.configService.apiUrl}/api/Worksheet/GetProductOverviewGridDtls`;
  private getConfigItemsUrl = `${this.configService.apiUrl}/api/Worksheet/GetConfigItemsGridDtls`;
  private getQuoteCompareFileUrl = `${this.configService.apiUrl}/api/UploadDownload/GetConfigPriceCompareDtls`;
  private postSaveWorksheetUrl = `${this.configService.apiUrl}/api/Worksheet/SaveWorksheet`;
  private postDRQRequestUrl = `${this.configService.apiUrl}/api/Worksheet/SaveDRQRequest`;
  private getWorksheetMarginExcelUrl = `${this.configService.apiUrl}/api/UploadDownload/GetMarginExcelFile`;

  public worksheetDetailsCard: any[] = [];
  public paymentTerms: WorksheetPaymentTerms[] = [];
  public productItems: EnquiryProductsSO[] = [];
  public configItems: ConfigItems[] = [];
  public WorksheetPrerequisites: any[] = [];
  public WorksheetDLCDetailsCard: WorksheetDLCList[] = [];
  public WorksheetMarginDetailsCard: WorksheetMarginList[] = [];
  public WorksheetDRQDetailsCard: WorksheetDRQList[] = [];
  public WorksheetDRQItemsDetailsCard: WorksheetDRQItemsList[] = [];
  public wsSysDiscAttachments: any = [];

  skip = 0;
  total = 0;

  constructor(
    private http: HttpService,
    private loginService: LoginService,
    private configService: ConfigService,
    private datePipe: DatePipe
  ) {}

  //API call to fetch enquiry list for worksheet
  getEnquiryWorksheetlist() {
    const body = {
      loginID: this.loginService.employeeId,
    };
    return this.http.post(this.getWorksheetWorklistUrl, body);
  }

  //API call to fetch worksheet details of selected enquiry
  getWorksheetDetails(enqId: number) {
    const body = {
      EnqId: enqId,
      EmpId: this.loginService.employeeId
    };
    return this.http.post(this.getWorksheetDetailsUrl, body);
  }

  //API call to fetch worksheet prerequisite details
  getWorksheetPrerequisites(enqId: number) {
    const body = {
      EnqId: enqId,
      EmpId: this.loginService.employeeId as number
    };
    return this.http.post(this.getWorksheetPrerequisiteUrl, body);
  }

  //API call to fetch dlc details of selected enquiry
  getWorksheetDLCDetails(enqId: number) {
    const body = {
      EnqId: enqId,
      LoginId: this.loginService.employeeId as number
    };
    return this.http.post(this.getWorksheetDLCDetailsUrl, body);
  }

  //API call to fetch margin details of selected enquiry
  getWorksheetMarginDetails(enqId: number) {
    const body = {
      EnqId: enqId
    };
    return this.http.post(this.getWorksheetMarginDetailsUrl, body);
  }

  //API call to fetch drq details of selected enquiry
  getWorksheetDRQDetails(enqId: number) {
    const body = {
      EnqId: enqId,
      LoginId: this.loginService.employeeId as number
    };
    return this.http.post(this.getWorksheetDRQDetailsUrl, body);
  }

  //API call to fetch drq item details of selected enquiry
  getWorksheetDRQItemsDetails(enqId: number) {
    const body = {
      EnqId: enqId,
      DRQId: 0
    };
    return this.http.post(this.getWorksheetDRQItemsDetailsUrl, body);
  }
  
  //API call to fetch payment terms details of selected enquiry
  getPaymentTerms(enqId: number, worksheetId: number) {
    const body = {
      EnqId: enqId,
      WorkSheetId: worksheetId
    };
    return this.http.post(this.getPaymentTermsUrl, body);
  }

  //API call to fetch product item details of selected enquiry(Not displayed anywhere)
  getProductItems(enqId: number, loginId: number) {
    const body = {
      EnqID: enqId,
      LoginId: loginId
    };
    return this.http.post(this.getEnquiryProductsUrl, body);
  }

  //API call to fetch config item details of selected enquiry(Not displayed anywhere)
  getConfigItems(enqId: number) {
    const body = {
      EnqID: enqId
    };
    return this.http.post(this.getConfigItemsUrl, body);
  }

  getQuoteCompareFile(enqId: number, loginId: number) {
    const url = this.getQuoteCompareFileUrl;
    const body = {
      EnqId: enqId,
      LoginId: loginId
    };
    return this.http.post(url, body, {responseType: 'blob', observe: 'response'});
  }

  //API call to download worksheet's latest margin excel file
  getWorksheetMarginExcelFile(enqId: number) {
    const body = {
      EnqId: enqId,
      TokenId: this.loginService.tokenId,
      LoginId: this.loginService.employeeId as number
    };
    return this.http.post(this.getWorksheetMarginExcelUrl, body, {responseType: 'blob', observe: 'response'});
  }

  //Function to assign worksheet parameters
  assignWorksheetParam(formData: any, enqID: any, operationMode: string){
    const wsattachmentfile =
    formData.priceDetails.wsattachment && formData.priceDetails.wsattachment.length > 0
          ? formData.priceDetails.wsattachment[0]
          : null;
    if (wsattachmentfile) {
      formData.priceDetails.wsattachment = wsattachmentfile;
    } else {
      formData.priceDetails.wsattachment = '';
    }  
        
    // const body1 = {
    //   enqId: enqID,
    //   worksheetId: this.worksheetDetailsCard[0].workSheetId,
    //   advancedTraining: this.worksheetDetailsCard[0].advancedTraining,
    //   otherCommitments: this.worksheetDetailsCard[0].otherCommitments,
    //   specialDiscountPC: this.worksheetDetailsCard[0].specialDiscountPC,
    //   paymentNoOfDays: this.worksheetDetailsCard[0].paymentNoOfDays,
    //   taxComponent: "",
    //   wsTaxSouceTypeId: 35,
    //   milestoneGuid: "",
    //   milestoneSouceTypeId: 65,
    //   lstConfigItems: this.configItems,
    //   _GrossSP: this.worksheetDetailsCard[0].grossSPQC,
    //   _GrossSPBC: this.worksheetDetailsCard[0].grossSPBC,
    //   _NetSP: this.worksheetDetailsCard[0].netSPQC,
    //   _NetSPBC: this.worksheetDetailsCard[0].netSPBC,
    //   _SplDiscActual: this.worksheetDetailsCard[0].specialDiscountPC,
    //   taxPC: this.worksheetDetailsCard[0].taxPC,
    //   taxTypeId: this.worksheetDetailsCard[0].taxTypeId,
    //   lstLeadProducts: this.productItems,
    //   gstExemptionPC: this.worksheetDetailsCard[0].gstExemptionPC,
    //   gstExemptionValue: this.worksheetDetailsCard[0].gstExemptedValue,
    //   lstPaymentTerms: this.paymentTerms,
    //   _AdjWsQuoteValueBC: this.worksheetDetailsCard[0].quoteValueBC,
    //   _AdjWsQuoteValue: this.worksheetDetailsCard[0].quoteValueQC,
    //   saveType: operationMode,
    //   createdBy: this.loginService.employeeId,
    //   operationMode: operationMode,
    //   appRejComments: "",
    //   isPriced: true,
    //   tax: 0,
    //   _VAT: this.worksheetDetailsCard[0].vat,
    //   _SGST: this.worksheetDetailsCard[0].sgst,
    //   _CGST: this.worksheetDetailsCard[0].cgst,
    //   _IGST: this.worksheetDetailsCard[0].igst,
    //   isDutyFree: this.worksheetDetailsCard[0].isDutyFree,
    //   isLeadLevelDiscount: this.worksheetDetailsCard[0].isLeadLevelDiscount,
    //   isProdLevelDiscount: this.worksheetDetailsCard[0].isProductLevelDiscount,
    //   isItemLevelDiscount: this.worksheetDetailsCard[0].isItemLevelDiscount,
    //   isFlatAmount: this.worksheetDetailsCard[0].isFlatAmount,
    //   otherCommitmentRemarks: this.worksheetDetailsCard[0].otherCommitmentRemarks == null? "": this.worksheetDetailsCard[0].otherCommitmentRemarks,
    //   level1Comments: formData.priceDetails.amComments,
    //   level2Comments: formData.priceDetails.smComments,
    //   level3Comments: formData.priceDetails.finComments,
    //   level4Comments: formData.priceDetails.mgmtComments,
    //   wsattachment: formData.priceDetails.wsattachment,
    //   isDiscExempted: this.worksheetDetailsCard[0].isDiscountCapExempted,
    //   isPriceEdited: this.worksheetDetailsCard[0].isPriceEdited,
    //   wsDocumentGUID: "",
    //   wsDocumentSouceTypeId: 658,
    //   loginId: this.loginService.employeeId,
    //   outPut: ""
    // }; 

    const body = new FormData();
    body.append("enqId", enqID as string);
    body.append("worksheetId", this.worksheetDetailsCard[0].workSheetId as string as string);
    body.append("advancedTraining", this.worksheetDetailsCard[0].advancedTraining as string);
    body.append("otherCommitments", this.worksheetDetailsCard[0].otherCommitments as string);
    body.append("specialDiscountPC", this.worksheetDetailsCard[0].specialDiscountPC as string);
    body.append("paymentNoOfDays", this.worksheetDetailsCard[0].paymentNoOfDays as string);
    body.append("taxComponent", "''");
    body.append("wsTaxSouceTypeId", "35");
    body.append("milestoneGuid", "" as string);
    body.append("milestoneSouceTypeId", "65");
    body.append("lstConfigItems", this.configItems as unknown as string);
    body.append("_GrossSP", ((this.worksheetDetailsCard[0].grossSPQC ?? 0) < 0.05 ? 0 :(this.worksheetDetailsCard[0].grossSPQC ?? 0).toFixed(2)).toString());
    body.append("_GrossSPBC", this.worksheetDetailsCard[0].grossSPBC as string);
    body.append("_NetSP", (((this.worksheetDetailsCard[0].quoteValueQC ?? 0) - (this.worksheetDetailsCard[0].discountValue ?? 0)).toFixed(2)).toString());
    body.append("_NetSPBC", (((this.worksheetDetailsCard[0].quoteValueBC ?? 0) - (this.worksheetDetailsCard[0].discountValueBC ?? 0)).toFixed(2)).toString());
    body.append("_SplDiscActual", this.worksheetDetailsCard[0].discountValue as string);
    body.append("taxPC", this.worksheetDetailsCard[0].taxPC as string);
    body.append("taxTypeId", this.worksheetDetailsCard[0].taxTypeId as string);
    body.append("lstLeadProducts", this.productItems as unknown as string);
    body.append("gstExemptionPC", this.worksheetDetailsCard[0].gstExemptionPC as string);
    body.append("gstExemptionValue", this.worksheetDetailsCard[0].gstExemptedValue as string);
    body.append("lstPaymentTerms", this.paymentTerms as unknown as string);
    body.append("_AdjWsQuoteValueBC", this.worksheetDetailsCard[0].quoteValueBC as string);
    body.append("_AdjWsQuoteValue", this.worksheetDetailsCard[0].quoteValueQC as string);
    body.append("saveType", operationMode);
    body.append("createdBy", this.loginService.employeeId as string);
    body.append("operationMode", operationMode);
    body.append("appRejComments", "''");
    body.append("isPriced", "true");
    body.append("tax", "0");
    body.append("_VAT",  String(this.worksheetDetailsCard[0].vat ?? 0));
    body.append("_SGST", String(this.worksheetDetailsCard[0].sgst ?? 0));
    body.append("_CGST", String(this.worksheetDetailsCard[0].cgst ?? 0));
    body.append("_IGST", String(this.worksheetDetailsCard[0].igst ?? 0));
    body.append("isDutyFree", this.worksheetDetailsCard[0].isDutyFree as string);
    body.append("isLeadLevelDiscount", this.worksheetDetailsCard[0].isLeadLevelDiscount as string);
    body.append("isProdLevelDiscount", this.worksheetDetailsCard[0].isProductLevelDiscount as string);
    body.append("isItemLevelDiscount", this.worksheetDetailsCard[0].isItemLevelDiscount as string);
    body.append("isFlatAmount", this.worksheetDetailsCard[0].isFlatAmount as string);
    body.append("otherCommitmentRemarks", this.worksheetDetailsCard[0].otherCommitmentRemarks == null ? "" : this.worksheetDetailsCard[0].otherCommitmentRemarks);
    body.append("level1Comments", formData.priceDetails.amComments == ""? "''": formData.priceDetails.amComments);
    body.append("level2Comments", formData.priceDetails.smComments == ""? "''": formData.priceDetails.smComments);
    body.append("level3Comments", formData.priceDetails.finComments == ""? "''": formData.priceDetails.finComments);
    body.append("level4Comments", formData.priceDetails.mgmtComments == ""? "''": formData.priceDetails.mgmtComments);
    body.append("wsattachment", formData.priceDetails.wsattachment);
    body.append("isDiscCapExempted", this.worksheetDetailsCard[0].isDiscountCapExempted as string);
    body.append("isPriceEdited", this.worksheetDetailsCard[0].isPriceEdited as string);
    body.append("wsDocumentGUID", "4ac78588-6406-4aaa-8024-cfd0dc710915");
    body.append("wsDocumentSouceTypeId", "658");
    body.append("loginId", this.loginService.employeeId as string);
    body.append("outPut", "''");
    return body;
  }

  //API call to either save, approve or reject worksheet
  postSave_App_Rej_Enquiry(formData: any,enqID: number,type: string) {
    const body = this.assignWorksheetParam(formData, enqID, type);
    return this.http.put(this.postSaveWorksheetUrl, body);
  }

  //API call to raise drq request for selected items
  postDRQRequest(enqId: number, supplierId: number, smComments: string, drqItems: LstDRQRequestBO[]) {
    const body = {
      EnqId: enqId,
      DRQId:0,
      SupplierId:supplierId,
      DRQIds:"",
      SMComments:smComments,
      Type:"SMCreateUpd",
      ApprovedCommens:"",
      DRQValidityDate:null,
      LoginId: this.loginService.employeeId as number,
      DRQItems:drqItems,
      SupplierList:null,
      DRQApprovedListBO:null,
    };
    return this.http.post(this.postDRQRequestUrl, body);
  }

  //Function to reset all the common values stored in worksheet service
  resetValues(){
    this.worksheetDetailsCard = [];
    this.WorksheetPrerequisites = [];
    this.WorksheetDLCDetailsCard = [];
    this.WorksheetMarginDetailsCard = [];
    this.WorksheetDRQDetailsCard = [];
    this.WorksheetDRQItemsDetailsCard = [];
    this.paymentTerms = [];
    this.productItems = [];
    this.configItems = [];
    this.wsSysDiscAttachments = [];
  }

  //Function to reset pagination related values stored in worksheet service
  resetPaginationValues(){
    this.skip = 0;
    this.total = 0;
  }
}
