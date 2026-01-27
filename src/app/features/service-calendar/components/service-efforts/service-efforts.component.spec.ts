import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEffortsComponent } from './service-efforts.component';

describe('ServiceEffortsComponent', () => {
  let component: ServiceEffortsComponent;
  let fixture: ComponentFixture<ServiceEffortsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceEffortsComponent]
    });
    fixture = TestBed.createComponent(ServiceEffortsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
