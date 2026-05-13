import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AppRoutePaths } from 'src/app/core/Constants';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService, svcPartsDetails, svcPrerequisites, 
         svcPartsRequest, svcIBModuleDetails, svcGetSRLCPartDiagnosisDetails } from '../../../service-calendar.service';

@Component({
  selector: 'app-parts-usage',
  templateUrl: './parts-usage.component.html',
  styleUrl: './parts-usage.component.scss'
})
export class PartsUsageComponent implements OnInit{
  showAPILoader = false;
  loaderMessage: string = 'Loading Details...';
  @Input() public partsUsageDetails!: FormGroup;
  @Input() srid: number = 0;
  @Input() public isEditable: boolean = false;
  @Input() servicePrerequisites: svcPrerequisites[] = [];
  @Input() partDiagnosisDetailsCard: svcGetSRLCPartDiagnosisDetails[] = [];
  @Output() validatePartsDiagnosis: EventEmitter<void> = new EventEmitter<void>();
  @Output() partDiagnosisDetailsCardChange: EventEmitter<svcGetSRLCPartDiagnosisDetails[]> = new EventEmitter<svcGetSRLCPartDiagnosisDetails[]>();
  @Output() hideShowFooter: EventEmitter<boolean> = new EventEmitter<boolean>();

  addedPartsCard: svcPartsDetails[] = [];
  isPartsUsageDetailsOpen = true;
  isPartsUsageEditOpen: boolean = false;
  isPartsAddOpen: boolean = false;
  selectedIndex: number = 0;

  constructor(    
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private loaderService: LoaderService,
    public  commonService: CommonService,
    private serviceCalendarService: ServiceCalendarService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.loaderMessage = 'Loading Details...';
    this.validatePartsDiagnosis.emit();
  }

  onAddPartsClick() {
    this.isPartsUsageDetailsOpen = false;
    this.isPartsAddOpen = true;
    this.hideShowFooter.emit(true);
  }

  isCardSelected(index: number){
    this.partDiagnosisDetailsCard[index].isCardSelected = !this.partDiagnosisDetailsCard[index].isCardSelected;
  }
  
  onDescriptionClick(index: number){
    this.partDiagnosisDetailsCard[index].isDescOpen = !this.partDiagnosisDetailsCard[index].isDescOpen;  
  }

  onDeleteAddedCards() {
    this.partDiagnosisDetailsCard = this.partDiagnosisDetailsCard.filter((item:any) => item.isCardSelected === undefined  || item.isCardSelected == false);
    this.partDiagnosisDetailsCardChange.emit(this.partDiagnosisDetailsCard);
    this.validatePartsDiagnosis.emit();
  }

  onPartsUsageEdit(index: number){
    this.selectedIndex = index;
    this.isPartsUsageEditOpen = true;
    this.hideShowFooter.emit(true);
  }

  onBackClickHandle(type: string) {
    this.isPartsUsageEditOpen = false;
    this.isPartsAddOpen = false;
    this.hideShowFooter.emit(false);
    this.isPartsUsageDetailsOpen = true;
    if(type == 'add')
      this.onPartsAdd();
    this.validatePartsDiagnosis.emit();
  }

  onPartsAdd() {
    this.addedPartsCard = this.serviceCalendarService.addedPartsDetailsCard;
    if (!this.addedPartsCard || this.addedPartsCard.length === 0) {
      return;
    }

    this.addedPartsCard.forEach((part) => {
        const newPartDetail: svcGetSRLCPartDiagnosisDetails = {
          partReqId: 0,
          partListID: 0,
          partsMasterId: part.partsMasterID? part.partsMasterID: 0,
          partNo: part.partNo,
          option: part.option? part.option : '',
          supplierId: part.supplierID? part.supplierID: 0,
          supplierName: part.supplierName,
          productLine: part.productLine,
          description: part.description,
          qty: 0,
          usedQty: part.quantity?? 0,
          partDiagStatusId: 0,
          partDiagStatus: '',
          remarks: '',
          isCardSelected: false,
          isDescOpen: false
        };
        this.partDiagnosisDetailsCard.push(newPartDetail);
    });
    this.addedPartsCard = [];
    this.serviceCalendarService.addedPartsDetailsCard = [];
  }  

  onRefresh(){
    this.ngOnInit();
    this.resetValues();
  }

  resetValues(){
    this.partDiagnosisDetailsCard = [];
  }
}
