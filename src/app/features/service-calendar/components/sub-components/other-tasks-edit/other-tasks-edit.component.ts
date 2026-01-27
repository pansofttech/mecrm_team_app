import { Component, input, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { svcGetOtherTasksDetails } from '../../../service-calendar.service';

@Component({
  selector: 'app-other-tasks-edit',
  templateUrl: './other-tasks-edit.component.html',
  styleUrl: './other-tasks-edit.component.scss'
})
export class OtherTasksEditComponent implements OnInit {
  @Input() svcOtherTasksDetails: svcGetOtherTasksDetails[] = [];
  @Input() index: number = 0;
  @Input() public callCompletionForm!: FormGroup;
  showAPILoader: boolean = false;

  otherTasksDetailsForm!: FormGroup;

  @Output() onBackClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private loginService: LoginService,
    private loaderService: LoaderService,
    public commonService: CommonService
  ){}

  ngOnInit(): void {
    this.otherTasksDetailsForm = new FormGroup({
      taskType: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      completedDate: new FormControl('', Validators.required),
      exceptional: new FormControl(false, Validators.nullValidator),
      expectedCompletionDate: new FormControl({value:'', disabled: true}, Validators.nullValidator),
      remarks: new FormControl('', Validators.required)
    });
    this.patchFormValues();

    this.otherTasksDetailsForm.get('exceptional')?.valueChanges.subscribe((isExceptional: boolean) => {
      const completedDateControl = this.otherTasksDetailsForm.get('completedDate');
      const expectedCompletionDateControl = this.otherTasksDetailsForm.get('expectedCompletionDate');
    
      if (isExceptional) {
        completedDateControl?.setValue('', { emitEvent: false });
        completedDateControl?.clearValidators();
        completedDateControl?.disable();
    
        expectedCompletionDateControl?.enable();
      } else {
        expectedCompletionDateControl?.setValue('', { emitEvent: false });
        expectedCompletionDateControl?.clearValidators();
        expectedCompletionDateControl?.disable();
    
        completedDateControl?.enable();
      }
    
      completedDateControl?.updateValueAndValidity();
      expectedCompletionDateControl?.updateValueAndValidity();
    });
    

    this.otherTasksDetailsForm.get('expectedCompletionDate')?.valueChanges.subscribe((value: string) => {
      const formValue = this.callCompletionForm.getRawValue();
      if(value == '' || value == null){
        this.otherTasksDetailsForm.get('expectedCompletionDate')?.setErrors({ required: true });
      }
      else if(formValue.completionDetails.completedDate && formValue.completionDetails.completedDate > value){
        this.otherTasksDetailsForm.get('expectedCompletionDate')?.setErrors({ invalidDate: true });
      }
      else {
        this.otherTasksDetailsForm.get('expectedCompletionDate')?.setErrors(null);
      }
    });

    this.otherTasksDetailsForm.get('completedDate')?.valueChanges.subscribe((value: string) => {
      const formValue = this.callCompletionForm.getRawValue();
      if(value == '' || value == null){
        this.otherTasksDetailsForm.get('completedDate')?.setErrors({ required: true });
      }
      else if (formValue.completionDetails.completedDate && value > formValue.completionDetails.completedDate) {
        this.otherTasksDetailsForm.get('completedDate')?.setErrors({ invalidDate: true });
      } else {
        this.otherTasksDetailsForm.get('completedDate')?.setErrors(null);
      }
    });

  }

  patchFormValues(){
    this.otherTasksDetailsForm.patchValue({
      taskType: this.svcOtherTasksDetails[this.index].taskType? this.svcOtherTasksDetails[this.index].taskType: '',
      completedDate: this.svcOtherTasksDetails[this.index].completedDate? this.commonService.convertDateStringToDate(this.svcOtherTasksDetails[this.index].completedDate): null,
      exceptional: this.svcOtherTasksDetails[this.index].exceptional? this.svcOtherTasksDetails[this.index].exceptional: false,
      expectedCompletionDate: this.svcOtherTasksDetails[this.index].expectedCompletionDate? this.commonService.convertDateStringToDate(this.svcOtherTasksDetails[this.index].expectedCompletionDate): null,
      remarks: this.svcOtherTasksDetails[this.index].remarks? this.svcOtherTasksDetails[this.index].remarks: ''
    });
  }

  submit(){
    if (this.otherTasksDetailsForm.valid) {
      this.svcOtherTasksDetails[this.index] = {
        ...this.svcOtherTasksDetails[this.index],
        completedDate: this.otherTasksDetailsForm.value.completedDate,
        exceptional: this.otherTasksDetailsForm.value.exceptional,
        expectedCompletionDate: this.otherTasksDetailsForm.value.expectedCompletionDate,
        remarks: this.otherTasksDetailsForm.value.remarks
      };
      this.onBackClick.emit();
    } else {
      this.otherTasksDetailsForm.markAllAsTouched();
    }
  }

  onBackClickHandle(){
      this.onBackClick.emit();
  }
}
