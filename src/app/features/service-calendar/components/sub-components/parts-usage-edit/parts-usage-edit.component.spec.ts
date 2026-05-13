import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsUsageEditComponent } from './parts-usage-edit.component';

describe('PartsUsageEditComponent', () => {
  let component: PartsUsageEditComponent;
  let fixture: ComponentFixture<PartsUsageEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsUsageEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsUsageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
