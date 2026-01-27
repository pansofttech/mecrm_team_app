import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryDetailsUpdateComponent } from './enquiry-details-update.component';

describe('EnquiryDetailsUpdateComponent', () => {
  let component: EnquiryDetailsUpdateComponent;
  let fixture: ComponentFixture<EnquiryDetailsUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquiryDetailsUpdateComponent]
    });
    fixture = TestBed.createComponent(EnquiryDetailsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
