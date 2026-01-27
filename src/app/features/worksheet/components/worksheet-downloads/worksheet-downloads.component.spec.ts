import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetDownloadsComponent } from './worksheet-downloads.component';

describe('WorksheetDownloadsComponent', () => {
  let component: WorksheetDownloadsComponent;
  let fixture: ComponentFixture<WorksheetDownloadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorksheetDownloadsComponent]
    });
    fixture = TestBed.createComponent(WorksheetDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
