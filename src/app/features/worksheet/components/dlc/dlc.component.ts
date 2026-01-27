import { Component, Injectable, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WorksheetService,WorksheetPrerequisites, WorksheetDLCList } from '../../worksheet.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { CommonService } from 'src/app/features/common/common.service';

@Component({
  selector: 'app-dlc',
  templateUrl: './dlc.component.html',
  styleUrls: ['./dlc.component.scss']
})
export class DlcComponent {
  public showWorksheetAPILoader = false;
  @Input() WorksheetDLCDetailsCard!: WorksheetDLCList[];
  @Input() public WorksheetPrerequisites!: WorksheetPrerequisites[];
  public DLCTotalCost: number = 0;

  constructor(
    private worksheetService: WorksheetService,
    private loginService: LoginService,
    public  commonService: CommonService
  ){}

  ngOnInit() {
    this.calTotalDLCCost();
  }

  isDescOpened(index: number){
    this.WorksheetDLCDetailsCard[index].isDescriptionOpen = !this.WorksheetDLCDetailsCard[index].isDescriptionOpen;
  }

  calTotalDLCCost(){    
    for(var i=0; i<this.WorksheetDLCDetailsCard.length; i++){
        this.DLCTotalCost += this.WorksheetDLCDetailsCard[i].sellOutValue as number;
    }
  }
}
