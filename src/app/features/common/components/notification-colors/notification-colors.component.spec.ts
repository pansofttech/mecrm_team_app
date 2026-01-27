import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationColorsComponent } from './notification-colors.component';

describe('NotificationColorsComponent', () => {
  let component: NotificationColorsComponent;
  let fixture: ComponentFixture<NotificationColorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationColorsComponent]
    });
    fixture = TestBed.createComponent(NotificationColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
