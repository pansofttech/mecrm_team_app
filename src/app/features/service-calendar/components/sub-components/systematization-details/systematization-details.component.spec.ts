import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystematizationDetailsComponent } from './systematization-details.component';

describe('SystematizationDetailsComponent', () => {
  let component: SystematizationDetailsComponent;
  let fixture: ComponentFixture<SystematizationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystematizationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystematizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
