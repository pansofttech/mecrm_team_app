import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/features/common/common.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ServiceCalendarService, svcGetOtherTasksDetails } from '../../../service-calendar.service';

@Component({
  selector: 'app-other-tasks',
  templateUrl: './other-tasks.component.html',
  styleUrl: './other-tasks.component.scss'
})

export class OtherTasksComponent implements OnInit{
  showAPILoader: boolean = false;
  @Input() otherTasksDetails: svcGetOtherTasksDetails[] = [];
  @Input() public otherDetails!: FormGroup;
  @Input() public callCompletionForm!: FormGroup;
  @Input() public isEditable: boolean = false;
  @Output() validateOtherDetails: EventEmitter<void> = new EventEmitter<void>();
  @Output() hideShowFooter: EventEmitter<boolean> = new EventEmitter<boolean>();

  isOtherTasksDetailsOpen = true;
  isOtherTasksDetailsEditOpen: boolean = false;
  selectedIndex: number = 0;

  constructor(
    private serviceCalendarService: ServiceCalendarService,
    private loaderService: LoaderService,
    public commonService: CommonService
  ){}

  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
    this.validateOtherDetails.emit();
  }

  onBackClickHandle() {
    this.isOtherTasksDetailsEditOpen = false;
    this.hideShowFooter.emit(false);
    this.isOtherTasksDetailsOpen = true;
    this.validateOtherDetails.emit();
  }

  onDescriptionClick(index: number){
    this.otherTasksDetails[index].isDescOpen = !this.otherTasksDetails[index].isDescOpen;
  }

  onOtherTasksEdit(index: number){
    this.selectedIndex = index;
    this.isOtherTasksDetailsEditOpen = true;
    this.hideShowFooter.emit(true);
  }
}
