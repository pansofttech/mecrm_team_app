import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetApprovalComponent } from './worksheet-approval.component';

describe('WorksheetApprovalComponent', () => {
  let component: WorksheetApprovalComponent;
  let fixture: ComponentFixture<WorksheetApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorksheetApprovalComponent]
    });
    fixture = TestBed.createComponent(WorksheetApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
