import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryDescriptionComponent } from './enquiry-description.component';

describe('EnquiryDescriptionComponent', () => {
  let component: EnquiryDescriptionComponent;
  let fixture: ComponentFixture<EnquiryDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquiryDescriptionComponent]
    });
    fixture = TestBed.createComponent(EnquiryDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
