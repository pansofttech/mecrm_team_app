import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { process, State } from '@progress/kendo-data-query';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { SalesPartsManagementService, SPMWorklistItem} from '../../sales-parts-management.service';

@Component({
  selector: 'app-salespartsmgt-worklist',
  templateUrl: './salespartsmgt-worklist.component.html',
  styleUrls: ['./salespartsmgt-worklist.component.scss']
})
export class SalespartsmgtWorklistComponent implements OnInit, OnDestroy {
  private popstateSubscription?: Subscription;
  public showSPMAPILoader = false;
  contactCards: SPMWorklistItem[] = [];
  pageSize = 3;
  filteredCards: SPMWorklistItem[] = [];
  searchTerm = '';

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private loginService: LoginService,
    private commonService: CommonService,
    public spmService: SalesPartsManagementService
  ){}

  ngOnInit() {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showSPMAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.getSPMWorklist();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  getSPMWorklist() {
    this.loaderService.showLoader();
    this.spmService.getSPMWorkList(this.loginService.employeeId as number).subscribe((data: any) => {
      if (data.length > 0 && data[0].isPreValidator === 1) {
        this.contactCards = data.filter(
          (a: any) => (a.hasPreVaidateRights === 1 && a.validatePriceCnt >= 1)
        );
      }
      else {
        this.contactCards = data.filter(
          (a: any) => (a.validatePriceCnt >= 1)
        );
      }
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
          (a.leadNo &&
            a.leadNo.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (a.customer &&
            a.customer.toLowerCase().includes(this.searchTerm.toLowerCase())) 
      );
    }
    this.spmService.total = this.filteredCards.length;
    this.applyPagination();
  }

  applyPagination(): void {
    const state: State = {
      skip: this.spmService.skip,
      take: this.pageSize,
    };
    const processed = process(this.filteredCards, state);
    this.filteredCards = processed.data;
    this.spmService.total = processed.total;
  }

  onPageChange(state: State): void {
    this.spmService.skip = state.skip as number;
    this.filterData();
  }

  navigateById(enqId: number) {
    const selectedEnq = this.contactCards.filter(
      a => (a.enqId === enqId)
    );
    this.spmService.isPreValidator = selectedEnq[0].isPreValidator == 1 ? true: false;
    this.spmService.hasPreVaidateRights = selectedEnq[0].hasPreVaidateRights == 1 ? true : false;

    this.spmService.getSPMSupplierList(this.loginService.employeeId as number,enqId).subscribe((data: any) => {
      if(data.length > 0)
        this.router.navigate([AppRoutePaths.SalesPartsManagementSupplierList], {state: {id: enqId}});
      else
        this.router.navigate([AppRoutePaths.SalesPartsManagementApproval], {state: {id: enqId, suppId: 0}});
    });
  }

  onReset(){
    this.ngOnInit();
  }

  onBackClickHandle(){
    this.spmService.resetPaginationValues();
    this.spmService.resetValues();
    this.router.navigate([AppRoutePaths.Dashboard]);
  }
}
