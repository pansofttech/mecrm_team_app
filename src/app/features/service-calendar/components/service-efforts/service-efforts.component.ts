import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ServiceCalendarService, engEffortsList } from '../../service-calendar.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/features/common/common.service';
import { AppRoutePaths } from 'src/app/core/Constants';

@Component({
  selector: 'app-service-efforts',
  templateUrl: './service-efforts.component.html',
  styleUrls: ['./service-efforts.component.scss']
})
export class ServiceEffortsComponent {
  serviceEffortsForm!: FormGroup;
  @Input() srid: number = 0;
  @Input() engeffortListCards: engEffortsList[] = [];
  @Input() effortCardDetails: any;
  isPrevEffortsOpen: boolean = false;
  isEffortsDisabled: boolean = true;

  @Output() onBackClickHandle: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private serviceCalendarService: ServiceCalendarService,
    private loginService: LoginService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.serviceEffortsForm = this.formBuilder.group({
      startTime: new FormControl(null, Validators.nullValidator),
      endTime: new FormControl(null, Validators.nullValidator),
      efforthours: new FormControl(null, Validators.required),
      travelhours: new FormControl(null, Validators.nullValidator),
      effortremarks: new FormControl('', Validators.required),
    });

    this.serviceEffortsForm.get('startTime')?.valueChanges.subscribe(() => {
      this.calculateEffortHours();
    });

    this.serviceEffortsForm.get('endTime')?.valueChanges.subscribe(() => {
      this.calculateEffortHours();
    });

    this.patchFormValues();
  }


  timeStringToDate(timeString: string): Date | null {
    if (!timeString) return null;

    const [hours, minutes, seconds] = timeString.split(':');

    const date = new Date();
    date.setHours(+hours);
    date.setMinutes(+minutes);
    date.setSeconds(+seconds.split('.')[0]);

    return date;
  }

  patchFormValues() {
    this.serviceEffortsForm.patchValue({
      startTime: this.effortCardDetails.startTime ? this.timeStringToDate(this.effortCardDetails.startTime) : "",
      endTime: this.effortCardDetails.endTime ? this.timeStringToDate(this.effortCardDetails.endTime) : "",
      efforthours: this.effortCardDetails.effortHours,
      travelhours: this.effortCardDetails.travelHours,
      effortremarks: this.effortCardDetails.remarks
    });
  }

  onCancel() {
    this.onBackClickHandle.emit();
  }

  assignFormData(): any {
    const formValue = this.serviceEffortsForm.value;
    if (this.effortCardDetails) {
      return {
        sRSchId: this.effortCardDetails.srSchId,
        subTaskId: this.effortCardDetails.subTaskId,
        calendarId: this.effortCardDetails.calendarId,
        onDate: this.effortCardDetails.ondate,
        startTime: formValue.startTime ? formValue.startTime : '',
        endTime: formValue.endTime ? formValue.endTime : '',
        effortHours: parseFloat(formValue.efforthours),
        travelHours: formValue.travelHours != 0 ? parseFloat(formValue.travelhours) : 0,
        isNoEffortSpent: this.effortCardDetails.isNoEffortSpent,
        remarks: formValue.effortremarks,
        subTaskScheduleDtlId: this.effortCardDetails.subTaskScheduleDtlId,
        srid: this.srid
      };
    }
    return null;
  }

  submit() {
    if (this.serviceEffortsForm.valid) {
      const formData = this.assignFormData();
      if (formData) {
        this.loaderService.showLoader();
        this.serviceCalendarService.putServiceEfforts(formData)
          .subscribe((data: any) => {
            this.loaderService.hideLoader();
            const notificationMessage = data.outPut;
            const notificationType = data.outPut.indexOf('Success') !== -1 ? 'success' : 'error';
            this.notificationService.showNotification(
              notificationMessage,
              notificationType,
              'center',
              'bottom'
            );
            if (notificationType == 'success') {
              this.onCancel();
            }
          },
            error => {
              this.loaderService.hideLoader();
              this.notificationService.showNotification(
                'Efforts update unsuccessful' + error,
                'error', 'center', 'bottom'
              );
            });
      }
    } else {
      this.serviceEffortsForm.markAllAsTouched();
    }
  }

  calculateEffortHours() {
    const startTime: Date = this.serviceEffortsForm.get('startTime')?.value;
    const endTime: Date = this.serviceEffortsForm.get('endTime')?.value;

    if (startTime && endTime) {
      const diffMs = endTime.getTime() - startTime.getTime();

      if (diffMs > 0) {
        const diffHours = diffMs / 1000 / 60 / 60;
        const roundedHours = Math.round(diffHours * 100) / 100;
        this.serviceEffortsForm.get('efforthours')?.setValue(roundedHours.toFixed(2));
        this.serviceEffortsForm.get('endTime')?.setErrors(null);
      } else {
        this.serviceEffortsForm.get('efforthours')?.setValue('');
        this.serviceEffortsForm.get('endTime')?.setErrors({ invalidTime: true });
      }
    } else {
      this.serviceEffortsForm.get('efforthours')?.setValue('');
      if (!endTime) {
        this.serviceEffortsForm.get('endTime')?.setErrors(null);
      }
    }
  }

}
