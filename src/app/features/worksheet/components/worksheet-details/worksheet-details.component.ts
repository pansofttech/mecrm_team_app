import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { process, State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { CommonService } from 'src/app/features/common/common.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { WorksheetService, WorkSheetSO , EnquiryList} from '../../worksheet.service';

@Component({
  selector: 'app-worksheet-details',
  templateUrl: './worksheet-details.component.html',
  styleUrls: ['./worksheet-details.component.scss']
})
export class WorksheetDetailsComponent implements OnInit, OnDestroy {
  private popstateSubscription?: Subscription;
  @Input() public worksheetDetails!: FormGroup;
  contactCards: EnquiryList[] = [];
  pageSize = 3;
  filteredCards: any[] = [];
  searchTerm = '';
  public showWorksheetAPILoader = false;
  public worksheetDetailsCard: WorkSheetSO[] =[];

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    public worksheetService: WorksheetService,
    public  commonService: CommonService,
  ){}
  
  ngOnInit() {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showWorksheetAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.enquiryList();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  enquiryList() {
    this.loaderService.showLoader();
    this.worksheetService.getEnquiryWorksheetlist().subscribe((data: any) => {
      this.contactCards = data;
      this.filterData();
      this.loaderService.hideLoader();
    },
    error => {
      this.loaderService.hideLoader();
    }); 
  }

  filterData(): void {
    this.filteredCards = [...this.contactCards];
    if (this.searchTerm.trim() !== '') {
      this.filteredCards = this.contactCards.filter(
        a =>
          (a.dealNo &&
            a.dealNo.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (a.soldToContact &&
            a.soldToContact
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())) ||
          (a.soldToLE &&
            a.soldToLE.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
    this.worksheetService.total = this.filteredCards.length;
    this.applyPagination();
  }

  applyPagination(): void {
    const state: State = {
      skip: this.worksheetService.skip,
      take: this.pageSize,
    };
    const processed = process(this.filteredCards, state);
    this.filteredCards = processed.data;
    this.worksheetService.total = processed.total;
  }

  onPageChange(state: State): void {
    this.worksheetService.skip = state.skip as number;
    this.filterData();
  }

  navigateById(enqId: number) {
    this.router.navigate([AppRoutePaths.WorksheetApproval], {state: {id: enqId}});
  }

  onBackClickHandle() {
    this.worksheetService.resetPaginationValues();
    this.router.navigate([AppRoutePaths.Dashboard]);
  }

  onReset(){
    this.ngOnInit();
  }
}
