import { Component,Input,HostListener,ViewChildren,QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopoverAnchorDirective } from "@progress/kendo-angular-tooltip";
import { RowClassArgs } from "@progress/kendo-angular-grid";
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { WorksheetService, WorksheetDRQItemsList, WorkSheetSO, LstDRQRequestBO } from '../../worksheet.service';

@Component({
  selector: 'app-drq-details',
  templateUrl: './drq-details.component.html',
  styleUrls: ['./drq-details.component.scss']
})

export class DrqDetailsComponent {
  public showWorksheetAPILoader = false;
  @Input() WorksheetDRQSupplierDetailsCard!: any[];
  @Input() WorksheetDRQItemsDetailsCard!: WorksheetDRQItemsList[];
  @Input() worksheetDetailsCard: WorkSheetSO[] = [];

  public WorksheetDRQGridItemsDetailsCard!: WorksheetDRQItemsList[];
  public isSMCommentsOpen: boolean = false;
  public isPartsGridOpen: boolean = false;
  public drqItemsColumns: any [] = [];
  drqApprovalForm!: FormGroup;
  public allChecked: boolean = false;
  selectedSupplierId: number = 0;
  drqRequestItemsBO: LstDRQRequestBO[] = []

  itemToDisplay!: WorksheetDRQItemsList;
  public popoverWidth: number = 270;
  @ViewChildren(PopoverAnchorDirective) popovers!: QueryList<PopoverAnchorDirective>;
  colorNotificationData = [
    { color: 'blue', name: 'New/Not yet raised Parts' },
    { color: 'green', name: 'DRQ Parts' },
    { color: 'red', name: 'Deleted Parts' }
  ];

  constructor(
    private router: Router,
    private worksheetService: WorksheetService,
    private loginService: LoginService,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    public commonService: CommonService
  ){}

  ngOnInit() {
    this.loaderService.loaderState.subscribe(res => {
      this.showWorksheetAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.WorksheetDRQSupplierDetailsCard = this.processSupplierData(this.WorksheetDRQItemsDetailsCard);
    this.WorksheetDRQSupplierDetailsCard.map((item: any) => ({
      ...item,
      isSMCommentsOpen: false
    }));
    this.drqApprovalForm = new FormGroup({
      drqSMComments: new FormControl('', Validators.required)
    });
  }

  toggleAll(event: any): void {
    const isChecked = event.target.checked;
    this.WorksheetDRQGridItemsDetailsCard.forEach(item => item.isDRQ = isChecked);
  }

  navigateById(supplierId: number) {
    this.WorksheetDRQGridItemsDetailsCard = this.WorksheetDRQItemsDetailsCard.filter((item: any) => {
      return item.supplierId === supplierId;
    });
    this.drqApprovalForm.markAsUntouched();
    this.drqApprovalForm.patchValue({
      drqSMComments: this.WorksheetDRQGridItemsDetailsCard[0].smComments
    });
    this.selectedSupplierId = supplierId;
    this.isPartsGridOpen = true;
  }

  processSupplierData(drqItemsDetailsCard: WorksheetDRQItemsList[]): any[] {
    let supplierData: any[] = [];
    let supplierIdsProcessed = new Set();
  
    drqItemsDetailsCard.forEach(val => {
      if (!supplierIdsProcessed.has(val.supplierId)) {
        supplierIdsProcessed.add(val.supplierId);
          let supplierEntry = {
          ...val,
          unitDiscount_QC: 0,
          totalDiscount_QC: 0,
          unitAddDiscount_QC: 0,
          addDiscount_QC: 0,
          newParts: 0,
          deletedParts: 0
        };
  
        let newParts = drqItemsDetailsCard.filter(item => item.supplierId === val.supplierId && item.drqItemStatus === 2);
        let delParts = drqItemsDetailsCard.filter(item => item.supplierId === val.supplierId && item.drqItemStatus === 3);
  
        let smcommts = drqItemsDetailsCard.filter(item => item.supplierId === val.supplierId && item.smComments);
        if (smcommts.length > 0) {
          supplierEntry.smComments = smcommts[0].smComments;
        }
  
        drqItemsDetailsCard.forEach(item => {
          if (val.supplierId === item.supplierId) {
            supplierEntry.unitDiscount_QC += item.unitDiscount_QC?item.unitDiscount_QC: 0 ;
            supplierEntry.totalDiscount_QC += item.totalDiscount_QC?item.totalDiscount_QC: 0;
            if (item.drqStatusId === 2 && item.isOptional === false && item.alternateOfferNo === 0) {
              supplierEntry.unitAddDiscount_QC += item.unitAddDiscount_QC?item.unitAddDiscount_QC: 0;
              supplierEntry.addDiscount_QC += item.addDiscount_QC?item.addDiscount_QC: 0;
            }
          }
        });
  
        supplierEntry.newParts = newParts.length;
        supplierEntry.deletedParts = delParts.length;
  
        supplierData.push(supplierEntry);
      }
    });
      return supplierData;
  }

  onSMCommentsClick(index: number){
    this.WorksheetDRQSupplierDetailsCard[index].isSMCommentsOpen = !this.WorksheetDRQSupplierDetailsCard[index].isSMCommentsOpen;
  }

  isNullOrZero(item: any): any {
    return (item == null || item == 0 || item == undefined) ? '' : item;
  }

  onBackClickHandle() {
    this.isPartsGridOpen = false;
  }

  assignDRQRequestParams(){
    const formValue = this.drqApprovalForm.value;
    this.drqRequestItemsBO = this.WorksheetDRQGridItemsDetailsCard
    .filter((item: WorksheetDRQItemsList) => item.isDRQ === true)
    .map((item: WorksheetDRQItemsList) => {
      return {
        drqDtlId: item.drqDtlId,
        configItemId: item.configItemId,
        partsMasterId: item.partsMasterId,
        supplierId: item.supplierId,
        drqId: item.drqId,
        sellinDiscountPC: item.sellinDiscountPC,
        drqDiscountPC: item.drqDiscountPC,
        reqDRQPC: item.reqDRQPC,
        productLine: item.productLine,
        smComments: formValue.drqSMComments,
        guId:""
      } as LstDRQRequestBO;
    });
  }

  saveDRQRequest(){
    if(this.drqApprovalForm.valid){
      this.loaderService.showLoader();
      const formValue = this.drqApprovalForm.value;
      this.assignDRQRequestParams();
      this.worksheetService.postDRQRequest(this.worksheetDetailsCard[0].enqId,this.selectedSupplierId, formValue.drqSMComments, this.drqRequestItemsBO)
      .subscribe((data: any) => {
        this.loaderService.hideLoader();
        if (data) {
          const notificationMessage = data.outPut;
          const notificationType = data.outPut.indexOf('success') !== -1 ? 'success' : 'error';
          this.notificationService.showNotification(
            notificationMessage,
            notificationType,
            'center',
            'bottom'
          );
        }
        this.router.navigate([AppRoutePaths.WorksheetApproval], {state: {id: this.worksheetDetailsCard[0].enqId}});      
      },
      error => {
        this.loaderService.hideLoader();
        this.notificationService.showNotification(
          'DRQ request not successful' + error,
          'error', 'center', 'bottom'
        );
      });
      this.worksheetService.resetValues();
    }
    else{
      this.drqApprovalForm.markAllAsTouched();
    }
  }

  public showPopover(dataItem: WorksheetDRQItemsList) {
    this.itemToDisplay = dataItem;
  }

  closePopover(rowIndex: number): void {
    const popover = this.popovers.toArray()[rowIndex];
    if (popover) {
      popover.hide();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setPopoverWidth((event.target as Window).innerWidth);
  }

  private setPopoverWidth(screenWidth: number): void {
    this.popoverWidth = screenWidth <= 590 ? 270 : 380;
  }

  public rowCallback = (context: RowClassArgs) => {
    return {
      'kendo-grid--StatusGreen': context.dataItem.drqItemStatus == 1,
      'kendo-grid--StatusBlue': context.dataItem.drqItemStatus == 2,
      'kendo-grid--StatusRed': context.dataItem.drqItemStatus == 3,
    };
  };

}
