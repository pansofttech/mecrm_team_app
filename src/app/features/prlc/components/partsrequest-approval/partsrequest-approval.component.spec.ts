import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsrequestApprovalComponent } from './partsrequest-approval.component';

describe('PartsrequestApprovalComponent', () => {
  let component: PartsrequestApprovalComponent;
  let fixture: ComponentFixture<PartsrequestApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsrequestApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsrequestApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
