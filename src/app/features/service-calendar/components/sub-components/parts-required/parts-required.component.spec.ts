import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsRequiredComponent } from './parts-required.component';

describe('PartsRequiredComponent', () => {
  let component: PartsRequiredComponent;
  let fixture: ComponentFixture<PartsRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsRequiredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
