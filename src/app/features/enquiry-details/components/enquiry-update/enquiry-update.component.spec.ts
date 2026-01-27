import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryUpdateComponent } from './enquiry-update.component';

describe('EnquiryUpdateComponent', () => {
  let component: EnquiryUpdateComponent;
  let fixture: ComponentFixture<EnquiryUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquiryUpdateComponent]
    });
    fixture = TestBed.createComponent(EnquiryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
