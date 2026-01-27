import { Component, OnDestroy, OnInit } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { FormStateService } from '../../form-state.service';
import { EnquiryDetailsService, EnquiryList } from '../../enquiry-details.service';

@Component({
  selector: 'app-enquiry-details-list-view',
  templateUrl: './enquiry-details-list-view.component.html',
  styleUrls: ['./enquiry-details-list-view.component.scss'],
})
export class EnquiryDetailsListViewComponent implements OnInit, OnDestroy {
  private popstateSubscription?: Subscription;
  contactCards: EnquiryList[] = [];
  pageSize = 3;
  filteredCards: any[] = [];
  searchTerm = '';
  showAPILoader = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    public formStateService: FormStateService,
    private commonService: CommonService,
    private enquiryDetailService: EnquiryDetailsService
  ) {}

  ngOnInit() {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.enquiryList();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  enquiryList() {
    this.loaderService.showLoader();
    this.enquiryDetailService.getEnquirylist()
    .subscribe((data: any) => {
      this.contactCards = data;
      this.filterData();
      this.loaderService.hideLoader();
    },
    error => {
      this.loaderService.hideLoader();;
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
    this.formStateService.total = this.filteredCards.length;
    this.applyPagination();
  }

  applyPagination(): void {
    const state: State = {
      skip: this.formStateService.skip,
      take: this.pageSize,
    };
    const processed = process(this.filteredCards, state);
    this.filteredCards = processed.data;
    this.formStateService.total = processed.total;
  }

  onPageChange(state: State): void {
    this.formStateService.skip = state.skip as number;
    this.filterData();
  }

  navigateById(id: string | number) {
    this.router.navigate([AppRoutePaths.EnquiryDetailsUpdate],{state: {id: id}});
  }

  callPhoneNumber(phoneNumber: string): void {
    window.location.href = 'tel:' + phoneNumber;
  }

  onBackClickHandle(){
    this.formStateService.resetPaginationValues();
    this.router.navigate([AppRoutePaths.Dashboard]);
  }

  onReset(){
    this.ngOnInit();
  }
}
