import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcPartsDetails, svcGetIBSalesConfigDetails } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-installbase-modules-salesconfig',
  templateUrl: './installbase-modules-salesconfig.component.html',
  styleUrl: './installbase-modules-salesconfig.component.scss'
})

export class InstallbaseModulesSalesconfigComponent {
  showAPILoader = false;
  loaderMessage: string = 'Loading Details...';
  ibSalesConfigDetailsCard: svcGetIBSalesConfigDetails[] = [];

  @Input() addedPartsDetailsCard: svcPartsDetails[] = [];
  @Input() srid: number = 0;
  @Input() installBaseId: number = 0;
  @Output() onBackClickHandle: EventEmitter<void> = new EventEmitter<void>();

  constructor(    
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    public  commonService: CommonService,
    private serviceCalendarService: ServiceCalendarService,
  ){}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.loaderMessage = 'Loading Details...';
    this.getIBSalesConfigDetails();
  }

  getIBSalesConfigDetails(){
    this.loaderService.showLoader();
    this.serviceCalendarService.getIBSalesConfigDetails(this.installBaseId,this.loginService.employeeId as number).
    subscribe((data: any) => {
      this.ibSalesConfigDetailsCard = data;
      this.loaderService.hideLoader();
    },
    error =>{
      this.loaderService.hideLoader();
      this.notificationService.showNotification(
        'Error fetching modules from sales config',
        'error', 
        'center', 
        'bottom'
      );
    });
  }

  onCardClick(event: Event) {
    const targetElement = event.currentTarget as HTMLElement;
    targetElement.classList.add('selected');
        setTimeout(() => {
      targetElement.classList.remove('selected');
    }, 2000);
  }

  onDescriptionClick(index: number){
    this.ibSalesConfigDetailsCard[index].isDescOpen = !this.ibSalesConfigDetailsCard[index].isDescOpen;  
  }

  addPartsToList(index: number) {
    const selectedPart = this.ibSalesConfigDetailsCard[index];
    const existingPart = this.addedPartsDetailsCard.find(
      part => part.partNo?.trim() === selectedPart.partNo?.trim() &&
              part.option === selectedPart.option                 &&
              part.supplierID === selectedPart.supplierID         &&
              part.supplierName === selectedPart.supplierName);

    if (existingPart) {
        existingPart.quantity = existingPart.quantity ? existingPart.quantity + 1 : 1;
    } else {
        const clonedPart = JSON.parse(JSON.stringify(selectedPart));
        clonedPart.quantity = 1;
        this.addedPartsDetailsCard.push(clonedPart);
    }

    this.serviceCalendarService.addedPartsDetailsCard = this.addedPartsDetailsCard;
  }

  onBackClick() {
    this.onBackClickHandle.emit();
  }

}
