import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryDetailsListViewComponent } from './enquiry-details-list-view.component';

describe('EnquiryDetailsListViewComponent', () => {
  let component: EnquiryDetailsListViewComponent;
  let fixture: ComponentFixture<EnquiryDetailsListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquiryDetailsListViewComponent]
    });
    fixture = TestBed.createComponent(EnquiryDetailsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
