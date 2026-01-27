import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrlcComponent } from './srlc.component';

describe('SrlcComponent', () => {
  let component: SrlcComponent;
  let fixture: ComponentFixture<SrlcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SrlcComponent]
    });
    fixture = TestBed.createComponent(SrlcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
