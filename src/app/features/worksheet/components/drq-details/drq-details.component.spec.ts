import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrqDetailsComponent } from './drq-details.component';

describe('DrqDetailsComponent', () => {
  let component: DrqDetailsComponent;
  let fixture: ComponentFixture<DrqDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrqDetailsComponent]
    });
    fixture = TestBed.createComponent(DrqDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
