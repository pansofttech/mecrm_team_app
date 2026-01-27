import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CommonService } from 'src/app/features/common/common.service';
import { LoginService } from 'src/app/features/login/components/login/login.service';
import { PrlcService, searchPartsBySRID, partsRequestResult, currencyConversion } from '../../../prlc.service';
import { svcDependentComboData } from 'src/app/features/service-calendar/service-calendar.service';

@Component({
  selector: 'app-partsrequest-list',
  templateUrl: './partsrequest-list.component.html',
  styleUrl: './partsrequest-list.component.scss'
})

export class PartsrequestListComponent implements OnInit{
  showAPILoader = false;
  @Input() partsListCards: searchPartsBySRID[] = [];
  @Input() prInfoCard: partsRequestResult[] = [];

  constructor(
    private loaderService: LoaderService,
    public  commonService: CommonService,
    public  loginService: LoginService,
    public  prlcService: PrlcService
  ){}

  async ngOnInit() {
    this.loaderService.loaderState.subscribe(res => {
      this.showAPILoader = res;
    });
    this.loaderService.hideLoader();
  }

  isCardSelected(index: number){
    this.partsListCards[index].isCardSelected = !this.partsListCards[index].isCardSelected;
  }

  isDescOpened(index: number){
    this.partsListCards[index].isDescriptionOpen = !this.partsListCards[index].isDescriptionOpen;
  }

  toggleCardSelection() {
    this.prlcService.isAllCardSelected = !this.prlcService.isAllCardSelected;
    if(this.prlcService.isAllCardSelected){
      this.partsListCards.forEach((card: any) => {
        card.isCardSelected = true;
      });
    }
    else if(!this.prlcService.isAllCardSelected){
      this.partsListCards.forEach((card: any) => {
        card.isCardSelected = false;
      });
    }
  }
}
