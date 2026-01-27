import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetDetailsComponent } from './worksheet-details.component';

describe('WorksheetDetailsComponent', () => {
  let component: WorksheetDetailsComponent;
  let fixture: ComponentFixture<WorksheetDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorksheetDetailsComponent]
    });
    fixture = TestBed.createComponent(WorksheetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
