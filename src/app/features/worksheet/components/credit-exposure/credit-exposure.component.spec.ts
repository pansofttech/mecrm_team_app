import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditExposureComponent } from './credit-exposure.component';

describe('CreditExposureComponent', () => {
  let component: CreditExposureComponent;
  let fixture: ComponentFixture<CreditExposureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditExposureComponent]
    });
    fixture = TestBed.createComponent(CreditExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
