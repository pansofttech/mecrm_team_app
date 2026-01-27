import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoRequiredComponent } from './po-required.component';

describe('PoRequiredComponent', () => {
  let component: PoRequiredComponent;
  let fixture: ComponentFixture<PoRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoRequiredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
