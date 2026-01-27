import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherTasksComponent } from './other-tasks.component';

describe('OtherTasksComponent', () => {
  let component: OtherTasksComponent;
  let fixture: ComponentFixture<OtherTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
