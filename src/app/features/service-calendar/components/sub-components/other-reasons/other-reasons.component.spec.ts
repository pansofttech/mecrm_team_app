import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherReasonsComponent } from './other-reasons.component';

describe('OtherReasonsComponent', () => {
  let component: OtherReasonsComponent;
  let fixture: ComponentFixture<OtherReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherReasonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
