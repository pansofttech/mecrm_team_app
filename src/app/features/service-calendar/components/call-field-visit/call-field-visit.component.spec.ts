import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallFieldVisitComponent } from './call-field-visit.component';

describe('CallFieldVisitComponent', () => {
  let component: CallFieldVisitComponent;
  let fixture: ComponentFixture<CallFieldVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallFieldVisitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallFieldVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
