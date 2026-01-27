import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallContinueComponent } from './call-continue.component';

describe('CallContinueComponent', () => {
  let component: CallContinueComponent;
  let fixture: ComponentFixture<CallContinueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallContinueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
