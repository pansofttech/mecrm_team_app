import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { LoginService } from '../login/components/login/login.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { DatePipe } from '@angular/common';

export interface SPMWorklistItem {
  enqId: number;
  leadNo: string;
  customer: string;
  region: string;
  salesPerson: string;
  enqCategory: string;
  salesChannel: string;
  leadPosition: string;
  leadStatus: string;
  addPrtsCnt?: number;
  validatePrtsCnt?: number;
  validatePriceCnt: number;
  mapHsnCnt?: number;
  gstMissingCnt?: number;
  preVaidateComments: string;
  hasPreVaidateRights?: number;
  isPreValidator?: number;
}

export interface SPMSupplierListItem {
  supplierDocId: number;
  supplierId: number;
  supplierName?: string;
  attachmentGuId?: string;
  remarks?: string;
  isDisable?: boolean | null;
  isDocRequired?: boolean | null;
  suppCategory?: string;
  remarksMessage?: RemarksMessage[];
}

export interface SPMPartsListItem {
  supplierId?: number;
  supplier: string;
  supp_PartNo: string;
  supp_Option: string;
  manufacturerId?: number;
  manufacturer: string;
  mfgPartNo: string;
  mfgOption: string;
  description: string;
  productLineId?: number;
  productLine: string;
  categoryId?: number;
  category: string;
  subCategoryId?: number;
  subCategory: string;
  listPrice?: number;
  discountPC?: number;
  partsMasterId?: number;
  currency: string;
  isDutyApplicable?: boolean;
  isUnManagedSupplier?: boolean;
  commentsByPartsMgmtTeam?: string;
  salesProductId?: number;
  suppCategory: string;
  addPartsYes: string;
  addPartsComments: string;
  qty?: number;
  netTotalValue?: number;
  priceValidateComments: string;
  isSameCurrency?: boolean;
  isMfgPresent?: number;
  mfgProductLineID?: number;
  configItemId?: number;
  configSeqNo?: number;
  isCardSelected?: boolean; 
  isDescriptionOpen?: boolean;
}

export interface RemarksMessage {
  author: string;
  timestamp: string;
  content: string;
}

export interface ProductConfigItemsBO {
  listPrice: number;
  discountPC: number;
  partsMasterId: number;
  salesProductId: number;
  configItemId: number;
  isUnManagedSupplier: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class SalesPartsManagementService {
  private getSPMWorklistUrl = `${this.configService.apiUrl}/api/SalesPartsManagement/GetSPMWorklist`;
  private getSPMSupplierlistUrl = `${this.configService.apiUrl}/api/SalesPartsManagement/GetSPMSupplierlist`;
  private getSPMPartslistUrl = `${this.configService.apiUrl}/api/SalesPartsManagement/GetSPMPartslist`;
  private postSPMPriceValidationUrl = `${this.configService.apiUrl}/api/SalesPartsManagement/UpdatePriceValidation`;

  isPreValidator = false;
  hasPreVaidateRights = false;

  skip = 0;
  total = 0;

  constructor(
    private http: HttpService,
    private loginService: LoginService,
    private configService: ConfigService,
    private datePipe: DatePipe
  ) {}

  //API call to fetch display in sales parts management
  getSPMWorkList(loginId: number) {
    const body = {
      loginId: loginId,
    };
    return this.http.post(this.getSPMWorklistUrl, body);
  }

  //API call to fetch display supplier list in sales parts management
  getSPMSupplierList(loginId: number, enqId: number) {
    const body = {
      loginId: loginId,
      enqId: enqId
    };
    return this.http.post(this.getSPMSupplierlistUrl, body);
  }

  //API call to fetch display parts list in sales parts management
  getSPMPartslist(loginId: number, enqId: number, supplierId: number){
    const body = {
      loginId: loginId,
      enqId: enqId,
      type: "",
      supplierId: supplierId
    };
    return this.http.post(this.getSPMPartslistUrl, body);
  }

  //API call to update price validations
  updatePriceValidation(loginId: number, validateComments: string, buttonType: string, lstLeadProductConfig: ProductConfigItemsBO[]){
    const body = {
      buttonType: buttonType,
      createdBy: loginId,
      lstLeadProductConfig: lstLeadProductConfig,
      priceValidateComments: validateComments
    };
    return this.http.post(this.postSPMPriceValidationUrl, body);
  }

  //Function to reset common values stored in sales-parts-service
  resetValues() {
    this.isPreValidator = false;
    this.hasPreVaidateRights = false;
  }
  
  //Function to reset pagination related values stored in sales-parts-service
  resetPaginationValues(){
    this.skip = 0;
    this.total = 0;
  }
}
