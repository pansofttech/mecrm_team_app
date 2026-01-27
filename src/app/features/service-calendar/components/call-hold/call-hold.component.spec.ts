import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallHoldComponent } from './call-hold.component';

describe('CallHoldComponent', () => {
  let component: CallHoldComponent;
  let fixture: ComponentFixture<CallHoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallHoldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
