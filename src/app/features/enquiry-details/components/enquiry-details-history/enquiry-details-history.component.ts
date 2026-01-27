import { Component, OnDestroy, OnInit } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { EnquiryDetailsService, EnquiryDetailsHistory } from '../../enquiry-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { CommonService } from 'src/app/features/common/common.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-enquiry-details-history',
  templateUrl: './enquiry-details-history.component.html',
  styleUrls: ['./enquiry-details-history.component.scss'],
})
export class EnquiryDetailsHistoryComponent implements OnInit, OnDestroy {
  private popstateSubscription?: Subscription;
  contactCards: EnquiryDetailsHistory[] = [];
  pageSize = 4;
  filteredCards: any[] = [];
  skip = 0;
  total = 0;
  searchTerm = '';
  id!: string | null;
  public showEnquiryHistoryAPILoader = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enquiryDetailService: EnquiryDetailsService,
    private loaderService: LoaderService,
    public commonService: CommonService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state){
      this.id = navigation.extras.state['id'];
    }
  }

  ngOnInit() {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showEnquiryHistoryAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.enquiryDetailsHistory();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  enquiryDetailsHistory() {
    this.loaderService.showLoader();
    this.enquiryDetailService
      .getEnquiryDetailsHistory(this.id as string)
      .subscribe((data: any) => {
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
          (a.updDate &&
            a.updDate.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (a.modeOfContact &&
            a.modeOfContact
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())) ||
          (a.updatedBy &&
            a.updatedBy.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
    this.total = this.filteredCards.length;
    this.applyPagination();
  }

  applyPagination(): void {
    const state: State = {
      skip: this.skip,
      take: this.pageSize,
    };
    const processed = process(this.filteredCards, state);
    this.filteredCards = processed.data;
    this.total = processed.total;
  }

  onPageChange(state: State): void {
    this.skip = state.skip as number;
    this.filterData();
  }

  onBackClickHandle() {
    this.router.navigate([AppRoutePaths.EnquiryDetailsUpdate],{state: {id: this.id}});
  }

  onReset(){
    this.ngOnInit();
  }
}
