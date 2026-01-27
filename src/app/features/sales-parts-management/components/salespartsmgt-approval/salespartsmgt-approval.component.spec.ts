import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalespartsmgtApprovalComponent } from './salespartsmgt-approval.component';

describe('SalespartsmgtApprovalComponent', () => {
  let component: SalespartsmgtApprovalComponent;
  let fixture: ComponentFixture<SalespartsmgtApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalespartsmgtApprovalComponent]
    });
    fixture = TestBed.createComponent(SalespartsmgtApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
