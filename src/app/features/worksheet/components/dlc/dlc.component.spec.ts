import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlcComponent } from './dlc.component';

describe('DlcComponent', () => {
  let component: DlcComponent;
  let fixture: ComponentFixture<DlcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DlcComponent]
    });
    fixture = TestBed.createComponent(DlcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
