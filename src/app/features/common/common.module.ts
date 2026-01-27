import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KendoModule } from 'src/app/kendo.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationColorsComponent } from './components/notification-colors/notification-colors.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TooltipsModule, PopoverModule } from "@progress/kendo-angular-tooltip";
import { CommonService } from './common.service';
import { AttachmentPopUpComponent } from './components/attachment-pop-up/attachment-pop-up.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    NotificationColorsComponent,
    AttachmentPopUpComponent,
    NotificationComponent,
    NavigationBarComponent
  ],
  exports: [
    NotificationColorsComponent, 
    AttachmentPopUpComponent,
    NotificationComponent,
    NavigationBarComponent
  ],
  imports: [
    CommonModule,
    KendoModule,
    LayoutModule,
    TooltipsModule,
    PopoverModule,
    IonicModule
  ],
  providers: [
    CommonService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class CommonFeaturesModule { }