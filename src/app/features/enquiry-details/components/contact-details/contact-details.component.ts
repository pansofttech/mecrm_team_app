import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EnquiryDetailsService } from '../../enquiry-details.service';
import { FormStateService } from '../../form-state.service';

type SoleToContact = {
  contactID: number;
  contactName: string;
  isContactActive: boolean;
  comboType: string;
  contactEmailID: string;
  leDeptId: number;
  departmentName: string;
  leSiteId: number;
  siteName: string;
};

type SoldToSite = {
  leSiteID: number;
  leSiteName: string;
  isSiteActive: boolean;
  comboType: string;
  leContactID: number;
};

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent implements OnInit {
  public soldToContact: any = [];
  public soldToSite: unknown = [];
  public regionsList: unknown = [];
  public soldToContactList: unknown = [];
  public showContactAPILoader = false;
  public virtual: any = {
    itemHeight: 28,
  };
  
  public soldToSiteDefaultValue: {
    comboType: string;
    leSiteId: unknown;
  } | null = null;
  constructor(
    public enquiryDetailsService: EnquiryDetailsService,
    private formStateService: FormStateService
  ) {
    this.soldToContact = this.soldToContact.slice();
  }
  ngOnInit(): void {
    if (this.formStateService.contactDetailsFormState) {
      this.contactDetails.patchValue(
        this.formStateService.contactDetailsFormState
      );
    }
    // Load selected contact if exists
    if (this.formStateService.selectedContact) {
      this.handleSoldToContactChanged(this.formStateService.selectedContact);
    }
    this.enquiryDetailsService.getSoldToContactsList().subscribe(data => {
      this.soldToContact = data;
      this.soldToContactList = data;
    });
  }

  handleSoldToContactFilter(contactID: string) {
    if (contactID && contactID.length >= 1) {
      this.soldToContact = this.soldToContact.filter(
        (s: SoleToContact) =>
          s.contactName.toLowerCase().indexOf(contactID.toLowerCase()) !== -1
      );
    } else {
      this.soldToContact = this.soldToContactList;
    }
  }

  @Input()
  public contactDetails!: FormGroup;
  handleSoldToContactChanged(contact: SoleToContact) {
    if (contact && contact?.contactID) {
      this.showContactAPILoader = true;
      this.formStateService.selectedContact = contact;
      this.enquiryDetailsService
        .getSoldToSiteList(contact.contactID)
        .subscribe((res: any) => {
          this.soldToSite = res || '';

          if (res && res.length > 0) {
            this.soldToSiteDefaultValue = {
              comboType: 'SOLDTOLESITE',
              leSiteId: res[0]?.leSiteID,
            };

            this.contactDetails.patchValue({
              soldToSite: this.soldToSiteDefaultValue.leSiteId,
            });

            this.handleSoldToSiteChanged(this.soldToSiteDefaultValue);
          }
        })
        .add(() => {
          this.showContactAPILoader = false;
        });
    }
  }

  handleSoldToSiteChanged(site: any) {
    this.formStateService.contactDetailsFormState =
      this.contactDetails.getRawValue();
    this.enquiryDetailsService
      .getRegionFromSiteList(site.leSiteId)
      .subscribe((res: any) => {
        this.regionsList = res || '';
        this.contactDetails.patchValue({
          region: res[0]?.comboName,
          soldToLE: res[1]?.comboName,
        });
        this.enquiryDetailsService.regionId = res[0]?.comboID;
        this.enquiryDetailsService.leID = res[1]?.comboID;
      });
  }
}