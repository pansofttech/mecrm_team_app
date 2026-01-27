import { Component, Injectable, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { WorksheetService,WorkSheetSO,WorksheetPrerequisites } from '../../worksheet.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { CommonService } from 'src/app/features/common/common.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-credit-exposure',
  templateUrl: './credit-exposure.component.html',
  styleUrls: ['./credit-exposure.component.scss']
})

export class CreditExposureComponent implements OnInit, OnChanges{
  // @Input()
  // // public creditExposureDetails!: FormGroup;
  public showWorksheetAPILoader = false;
  @Input() gridData!: any[];
  @Input() worksheetDetailsCard!: WorkSheetSO[];
  @Input() public WorksheetPrerequisites!: WorksheetPrerequisites[];
  creditExposureText: string = '';
  backgroundColor: string = '';
  leftBorderColor: string = '';
  showPaymentTerms: boolean = false;
  public PaymentTermsQuoteColumns: any [] = [];
  public PaymentTermsMasterColumns: any [] = [];
  constructor(
    private worksheetService: WorksheetService,
    private loginService: LoginService,
    public commonService: CommonService
  ){}

  ngOnInit() {
    this.PaymentTermsQuoteColumns = [
      { field: "SalePaymentId", hidden: true, },
      { field: "PayMileStoneId", hidden: true, },
      {
          field: "paymentMilestone", title: "Invoicing Milestone", width: 60, attributes: { "disabled": true },
          filterable: false, sortable: false,
          template: '#if(Color === "Maroon"){#'
              + '<div class="MAROONCELL" title="Price for this item is updated as per the Price master">' + "#= kendo.toString(PaymentMilestone,'n')#" + '</div>' + '#}'
              + 'else if(Color === "Amber") {#'
              + '<div class="AMBERCELL" title="Price for this item is updated as per the Price master">' + "#= kendo.toString(PaymentMilestone,'n')#" + '</div>' + '#}'
              + 'else{ #' + "#=kendo.toString(PaymentMilestone,'n')#" + '# }#',
      },
      {
          title: "Quote", headerAttributes: { style: "text-align: center;", },
          columns: [
              {
                  field: "percentage", title: "%", width: 25,
                  type: "decimal", format: "{0:n2}",
                  attributes: { "class": "gridEditColumn", style: "text-align: center;" }, filterable: false, sortable: false,
                  headerAttributes: { style: "text-align: center;", },
              },
              {
                  field: "processDays", title: "Days", width: 25, type: "number",
                  attributes: { "class": "gridEditColumn", style: "text-align: center;" }, headerAttributes: { style: "text-align: center;", },
                  format: "{0:n0}", filterable: false, sortable: false,
              },
          ],
      },
      { field: "RankNo", hidden: true, },
    ];
    this.PaymentTermsMasterColumns = [
      { field: "SalePaymentId", hidden: true, },
      { field: "PayMileStoneId", hidden: true, },
      {
          field: "paymentMilestone", title: "Invoicing Milestone", width: 60, attributes: { "disabled": true },
          filterable: false, sortable: false,
          template: '#if(Color === "Maroon"){#'
              + '<div class="MAROONCELL" title="Price for this item is updated as per the Price master">' + "#= kendo.toString(PaymentMilestone,'n')#" + '</div>' + '#}'
              + 'else if(Color === "Amber") {#'
              + '<div class="AMBERCELL" title="Price for this item is updated as per the Price master">' + "#= kendo.toString(PaymentMilestone,'n')#" + '</div>' + '#}'
              + 'else{ #' + "#=kendo.toString(PaymentMilestone,'n')#" + '# }#',
      },
      {
          title: "Master", headerAttributes: { style: "text-align: center;", },
          columns: [
              {
                  field: "creditPercentage", title: "%", width: 25, attributes: { "disabled": true },
                  filterable: false, sortable: false, /*attributes: { style: "text-align: center;", },*/
                  headerAttributes: { style: "text-align: center;", },
              },
              {
                  field: "creditDays", title: "Days", width: 25, attributes: { "disabled": true },
                  filterable: false, sortable: false, /*attributes: { style: "text-align: center;", },*/
                  headerAttributes: { style: "text-align: center;", },
              },
          ],
      },
      { field: "RankNo", hidden: true, },
    ];
    this.creditExposure();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gridData'] && !changes['gridData'].firstChange) {
      this.creditExposure();
    }
  }

  comparePaymentTerms(): boolean {
    if (this.gridData != null) {
      for (let a of this.gridData)
        if (!(a.creditPercentage == a.percentage && a.creditDays == a.processDays)) {
          return true;
        }
      return false;
    } else {
      return false;
    }
  }

  onClickShowPaymentTerms(){
    this.showPaymentTerms = this.showPaymentTerms ? false : true;
  }

  creditExposure(): void {
    const maroonGrid = this.gridData.filter(item => item.color === 'Red');
    const amberGrid = this.gridData.filter(item => item.color === 'Amber');
    const greenGrid = this.gridData.filter(item => item.color === 'Green');

    if (maroonGrid.length > 0) {
      this.creditExposureText = 'More credit exposure';
      this.backgroundColor = '#fac4c3';
      this.leftBorderColor = '#FF0000';
    } else if (amberGrid.length > 0) {
      this.creditExposureText = 'More credit exposure';
      this.backgroundColor = '#fae8c3';
      this.leftBorderColor = '#f5a505';
    } else if (greenGrid.length > 0) {
      this.creditExposureText = 'No unplanned credit exposure';
      this.backgroundColor = '#d0f7d5';
      this.leftBorderColor = '#036e16';
    } else {
      this.creditExposureText = '';
      this.backgroundColor = '#d0f7d5';
      this.leftBorderColor = '#036e16';
    }
  }

  downloadQuoteCompare() {
    this.worksheetService.getQuoteCompareFile(this.worksheetDetailsCard[0].enqId, this.loginService.employeeId as number).subscribe((response) => {
      const contentType = response.headers.get('content-type')!;
      const filename = this.worksheetDetailsCard[0].enqId + 'SAL_QuoteComparision.xlsx';
      const blob = new Blob([response.body!], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'QuoteCompare';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
