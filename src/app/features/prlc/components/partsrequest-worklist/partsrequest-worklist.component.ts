import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { process, State } from '@progress/kendo-data-query';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { PrlcService, partsRequestList } from '../../prlc.service';

@Component({
  selector: 'app-partsrequest-worklist',
  templateUrl: './partsrequest-worklist.component.html',
  styleUrl: './partsrequest-worklist.component.scss'
})
export class PartsrequestWorklistComponent implements OnInit, OnDestroy{
  private popstateSubscription?: Subscription;
  public showAPILoader = false;
  pageSize = 3;
  searchTerm = '';
  prlcWorklistData: partsRequestList[] = [];
  filteredCards: partsRequestList[] = [];

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private loginService: LoginService,
    private commonService: CommonService,
    public prlcService: PrlcService
  ){}

  ngOnInit() {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.getPRLCWorklist();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  getPRLCWorklist() {
    this.loaderService.showLoader();
    this.prlcService.getPRLCWorklist(this.loginService.employeeId as number).subscribe((data: any) => {
      this.prlcWorklistData = data;
      this.filterData();
      this.loaderService.hideLoader();
    },
    error => {
      this.notificationService.showNotification(
        'Error fetching prlc worklist',
        'error',
        'center',
        'bottom'
      );
      this.loaderService.hideLoader();
    });
  }

  filterData(): void {
    this.filteredCards = [...this.prlcWorklistData];
    if (this.searchTerm.trim() !== '') {
      this.filteredCards = this.prlcWorklistData.filter(
        a =>
          (a.partReqId &&
            a.partReqId.toString().toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (a.customerName &&
            a.customerName.toLowerCase().includes(this.searchTerm.toLowerCase())) 
      );
    }
    this.prlcService.total = this.filteredCards.length;
    this.applyPagination();
  }

  applyPagination(): void {
    const state: State = {
      skip: this.prlcService.skip,
      take: this.pageSize,
    };
    const processed = process(this.filteredCards, state);
    this.filteredCards = processed.data;
    this.prlcService.total = processed.total;
  }

  onPageChange(state: State): void {
    this.prlcService.skip = state.skip as number;
    this.filterData();
  }

  navigateById(prId: number | undefined, srid: string | undefined) {
    this.router.navigate([AppRoutePaths.PartsRequestApproval], {state: {id: prId, srid: srid}});
  }

  onReset(){
    this.ngOnInit();
  }

  onBackClickHandle(){
    this.prlcService.resetPaginationValues();
    this.prlcService.resetValues();
    this.router.navigate([AppRoutePaths.Dashboard]);
  }
}
