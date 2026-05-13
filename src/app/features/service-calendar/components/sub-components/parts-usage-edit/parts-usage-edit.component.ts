import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { ServiceCalendarService ,svcGetSRLCPartDiagnosisDetails, svcDependentComboData } from '../../../service-calendar.service';

@Component({
  selector: 'app-parts-usage-edit',
  templateUrl: './parts-usage-edit.component.html',
  styleUrl: './parts-usage-edit.component.scss'
})
export class PartsUsageEditComponent implements OnInit{
  @Input() svcModuleDetails: svcGetSRLCPartDiagnosisDetails[] = [];
  @Input() index: number = 0;
  showAPILoader: boolean = false;

  partsUsageForm!: FormGroup;
  dependantComboDataForPDStatus: svcDependentComboData[] = [];

  @Output() onBackClick: EventEmitter<void> = new EventEmitter<void>();
  
  constructor(
    private loginService: LoginService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    public commonService: CommonService,
    private serviceCalendarService: ServiceCalendarService
  ){}

  ngOnInit(): void {
    this.partsUsageForm = new FormGroup({
      supplierName: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      partReqId: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      partNo: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      option: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      productLine: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      qty: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      usedQty: new FormControl(0, Validators.required),
      partDiagStatusId: new FormControl({value:'', disabled: false}, Validators.nullValidator),
      remarks: new FormControl('', Validators.required),
      description: new FormControl({value:'', disabled: true}, Validators.nullValidator)
    });
    this.getPrerequisiteCombo();
    this.patchFormValues();

    this.partsUsageForm.get('usedQty')?.valueChanges.subscribe((usedQty: number) => {
      this.updatePartDiagStatus(usedQty);
    });
  }

  getPrerequisiteCombo(){
    this.serviceCalendarService.getPrerequisiteCombo("SRLC", this.loginService.employeeId as number).subscribe((data: any) => {
      this.dependantComboDataForPDStatus = data.filter(
        (item: any) => item.comboType === 'PARTDIAGNOSISSTATUS'
      );
    });
  }

  patchFormValues(){
    this.partsUsageForm.patchValue({
      supplierName: this.svcModuleDetails[this.index].supplierName? this.svcModuleDetails[this.index].supplierName: '',
      partReqId: this.svcModuleDetails[this.index].partReqId? this.svcModuleDetails[this.index].partReqId: '',
      partNo: this.svcModuleDetails[this.index].partNo? this.svcModuleDetails[this.index].partNo: '',
      option: this.svcModuleDetails[this.index].option? this.svcModuleDetails[this.index].option: '',
      productLine: this.svcModuleDetails[this.index].productLine? this.svcModuleDetails[this.index].productLine: '',
      qty: this.svcModuleDetails[this.index].qty? this.svcModuleDetails[this.index].qty: 0,
      usedQty: this.svcModuleDetails[this.index].usedQty? this.svcModuleDetails[this.index].usedQty: 0,
      partDiagStatusId: this.svcModuleDetails[this.index].partDiagStatusId? this.svcModuleDetails[this.index].partDiagStatusId: '',
      remarks: this.svcModuleDetails[this.index].remarks? this.svcModuleDetails[this.index].remarks: '',
      description: this.svcModuleDetails[this.index].description? this.svcModuleDetails[this.index].description: ''
    });
  }

  submit(){
    if (this.partsUsageForm.valid) {
      const formValue = this.partsUsageForm.getRawValue();
      if(this.partsUsageForm.value.usedQty > formValue.qty && this.partsUsageForm.value.partReqId > 0){
          this.notificationService.showNotification(
            'Used qty cannot be more than required qty',
            'error',
            'center',
            'bottom'
          );
          return;
      }else{
          const selectedItem = this.dependantComboDataForPDStatus.find(
            (x: any) => x.comboId === this.partsUsageForm.value.partDiagStatusId
          );
          const selectedStatus = selectedItem ? selectedItem.comboName : '';
          this.svcModuleDetails[this.index] = {
            ...this.svcModuleDetails[this.index],
            usedQty: this.partsUsageForm.value.usedQty,
            partDiagStatusId: this.partsUsageForm.value.partDiagStatusId,
            partDiagStatus:  selectedStatus,
            remarks: this.partsUsageForm.value.remarks,
          };
          this.onBackClick.emit();
      }
    } else {
      this.partsUsageForm.markAllAsTouched();
    }
  }

  updatePartDiagStatus(usedQty: number): void {
    const qty = this.partsUsageForm.get('qty')?.value ?? 0;
    const replacedId = this.serviceCalendarService.pdReplacedStatusId;
    const notUsedId = this.serviceCalendarService.pdNotUsedStatusId;
    const partiallyUsedId = this.serviceCalendarService.pdPartiallyUsedStatusId;
    let statusId: number;

    if ((qty > 0 && qty <= usedQty) || (qty === 0 && usedQty > 0)) {
      statusId = replacedId;
    } 
    else if (usedQty > 0 && qty > usedQty) {
      statusId = partiallyUsedId;
    } 
    else {
      statusId = notUsedId;
    }

    this.partsUsageForm.patchValue({
      partDiagStatusId: statusId
    });
  }

  onBackClickHandle(){
    this.onBackClick.emit();
  }
}