import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherTasksEditComponent } from './other-tasks-edit.component';

describe('OtherTasksEditComponent', () => {
  let component: OtherTasksEditComponent;
  let fixture: ComponentFixture<OtherTasksEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherTasksEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherTasksEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
