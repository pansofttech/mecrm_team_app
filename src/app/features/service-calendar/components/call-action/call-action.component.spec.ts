import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallActionComponent } from './call-action.component';

describe('CallActionComponent', () => {
  let component: CallActionComponent;
  let fixture: ComponentFixture<CallActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
