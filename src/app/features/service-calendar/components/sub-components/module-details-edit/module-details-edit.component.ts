import { Component, input, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { svcIBModuleDetails } from '../../../service-calendar.service';

@Component({
  selector: 'app-module-details-edit',
  templateUrl: './module-details-edit.component.html',
  styleUrl: './module-details-edit.component.scss'
})

export class ModuleDetailsEditComponent implements OnInit {
  @Input() svcModuleDetails: svcIBModuleDetails[] = [];
  @Input() index: number = 0;
  showAPILoader: boolean = false;

  moduleDetailsForm!: FormGroup;

  @Output() onBackClick: EventEmitter<void> = new EventEmitter<void>();
  
  constructor(
    private loginService: LoginService,
    private loaderService: LoaderService,
    public commonService: CommonService
  ){}

  ngOnInit(): void {
    this.moduleDetailsForm = new FormGroup({
      moduleName: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      modelNo: new FormControl('', Validators.required),
      partNo: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      serialNo: new FormControl('', Validators.required),
      versionNo: new FormControl('', Validators.nullValidator),
      notes: new FormControl('', Validators.nullValidator)
    });
    this.patchFormValues();
  }

  patchFormValues(){
    this.moduleDetailsForm.patchValue({
      moduleName: this.svcModuleDetails[this.index].moduleName? this.svcModuleDetails[this.index].moduleName: '',
      modelNo: this.svcModuleDetails[this.index].modelNo? this.svcModuleDetails[this.index].modelNo: '',
      partNo: this.svcModuleDetails[this.index].partNo? this.svcModuleDetails[this.index].partNo: '',
      serialNo: this.svcModuleDetails[this.index].serialNo? this.svcModuleDetails[this.index].serialNo: '',
      versionNo: this.svcModuleDetails[this.index].versionNo? this.svcModuleDetails[this.index].versionNo: '',
      notes: this.svcModuleDetails[this.index].notes? this.svcModuleDetails[this.index].notes: ''
    });
  }

  submit(){
    if (this.moduleDetailsForm.valid) {
      this.svcModuleDetails[this.index] = {
        ...this.svcModuleDetails[this.index],
        modelNo: this.moduleDetailsForm.value.modelNo,
        serialNo: this.moduleDetailsForm.value.serialNo,
        versionNo: this.moduleDetailsForm.value.versionNo,
        notes: this.moduleDetailsForm.value.notes
      };
      this.onBackClick.emit();
    } else {
      this.moduleDetailsForm.markAllAsTouched();
    }
  }

  onBackClickHandle(){
      this.onBackClick.emit();
  }
}
