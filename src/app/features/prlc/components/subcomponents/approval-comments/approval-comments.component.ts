import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/features/common/common.service';
import { PrlcService, partsRequestResult } from '../../../prlc.service';

@Component({
  selector: 'app-approval-comments',
  templateUrl: './approval-comments.component.html',
  styleUrl: './approval-comments.component.scss'
})

export class ApprovalCommentsComponent implements OnInit{
  showAPILoader = false;
  prMarginInfoCard: any[] = [];
  @Input() prApprovalComments!: FormGroup;
  @Input() prInfoCard: partsRequestResult[] = [];

  constructor(
    private loaderService: LoaderService,
    public  commonService: CommonService,
    public  prlcService: PrlcService
  ){}

  ngOnInit() {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
  }

  getApprovalLevel(): string{
    if(this.prInfoCard[0].claimStatus != this.prlcService.Draft && this.prInfoCard[0].claimStatus != this.prlcService.ManagerApproval){
      if(this.prInfoCard[0].claimStatus == this.prlcService.PLApprlPending){
        return "PL"
      }
      else if(this.prInfoCard[0].claimStatus == this.prlcService.ManagementApproval){
        return "Management"
      }
      else{
        return 'Remarks'
      }
    }
    else{
      if(this.prInfoCard[0].claimStatus == this.prlcService.ManagerApproval)
        return 'Manager'
      else
        return 'None'
    }
  }
}
