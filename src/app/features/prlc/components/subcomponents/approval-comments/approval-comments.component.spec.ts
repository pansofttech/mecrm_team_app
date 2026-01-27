import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalCommentsComponent } from './approval-comments.component';

describe('ApprovalCommentsComponent', () => {
  let component: ApprovalCommentsComponent;
  let fixture: ComponentFixture<ApprovalCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalCommentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
