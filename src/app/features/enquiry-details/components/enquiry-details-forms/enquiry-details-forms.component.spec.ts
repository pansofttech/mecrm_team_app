import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryDetailsFormsComponent } from './enquiry-details-forms.component';

describe('EnquiryDetailsFormsComponent', () => {
  let component: EnquiryDetailsFormsComponent;
  let fixture: ComponentFixture<EnquiryDetailsFormsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquiryDetailsFormsComponent]
    });
    fixture = TestBed.createComponent(EnquiryDetailsFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
