import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsUsageComponent } from './parts-usage.component';

describe('PartsUsageComponent', () => {
  let component: PartsUsageComponent;
  let fixture: ComponentFixture<PartsUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsUsageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
