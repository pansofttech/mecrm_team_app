import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutePaths } from 'src/app/core/Constants';
import { ServiceCalendarService, callsList } from '../../service-calendar.service';
import { CommonService } from 'src/app/features/common/common.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy{
  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  isCalendarOpen: boolean = false;
  schCallCards: callsList[] = [];
  SRID: number = 0;
  showAPILoader = false;
  private popstateSubscription?: Subscription;


  constructor(
    private router: Router,
    private serviceCalendarService: ServiceCalendarService,
    private loginService: LoginService,
    private loaderService: LoaderService,
    private datePipe: DatePipe,
    public commonService: CommonService,
  ) {}

  ngOnInit() {
    this.popstateSubscription = this.commonService.handleNavigationEvents(this.router.events, () => {
      this.onBackClickHandle();
    });

    if( this.serviceCalendarService.selectedDate != undefined){
      this.currentDate = this.serviceCalendarService.selectedDate;
    }
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.scheduledCallsList();
  }

  ngOnDestroy(): void {
    this.popstateSubscription?.unsubscribe();
  }

  scheduledCallsList() {
    this.loaderService.showLoader();
    this.serviceCalendarService.getScheduledCalls(this.loginService.employeeId as number, this.currentDate).subscribe((data: any) => {
      this.schCallCards = data;
      this.serviceCalendarService.selectedDate = this.currentDate;
      this.loaderService.hideLoader();
    },
    error => {
      this.loaderService.hideLoader();;
    });
  }

  onBackClickHandle() {
    this.serviceCalendarService.selectedDate = new Date();
    this.serviceCalendarService.resetValues();
    this.router.navigate([AppRoutePaths.Dashboard]);
  }

  onPrevDateClickHandle() {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() - 1);
    this.currentDate = newDate;  
    this.scheduledCallsList();
  }

  onNextDateClickHandle() {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + 1);
    this.currentDate = newDate;  
    this.scheduledCallsList();
  }

  updateServiceCalendarDate(newDate: Date) {
    this.currentDate = newDate;
    this.isCalendarOpen = false;
    this.scheduledCallsList();
  }

  openCloseCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  onScheduledCallClick(SRID: number, index: number) {
    this.serviceCalendarService.selectedSRID = SRID;
    this.serviceCalendarService.selectedCallCompletion = this.schCallCards[index].isCallCompleted;
    this.serviceCalendarService.selectedCallCat = this.schCallCards[index].callCategory;
    this.router.navigate([AppRoutePaths.SRLC],{state: {id: SRID, date: this.commonService.displayDateFormat(this.currentDate)}});
  }

  convertDateFormat(currentDate: Date){
    const formattedDate = currentDate
    ? this.datePipe.transform(currentDate, 'dd-MMM-yyyy')
    : null;
    return formattedDate as string;
  }

  callPhoneNumber(phoneNumber: string): void {
    window.location.href = 'tel:' + phoneNumber;
  }

  sendEmail(emailAddress: string): void {
    window.location.href = 'mailto:' + emailAddress;
  }

  openLocation(locationName: string): void {
    window.open('https://maps.google.com/?q=' + locationName, '_blank');
  }

  onRefresh(){
    this.scheduledCallsList();
    this.serviceCalendarService.resetValues();
  }

}
