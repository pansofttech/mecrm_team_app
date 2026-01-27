import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCompletionComponent } from './call-completion.component';

describe('CallCompletionComponent', () => {
  let component: CallCompletionComponent;
  let fixture: ComponentFixture<CallCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallCompletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
