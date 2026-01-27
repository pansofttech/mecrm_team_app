import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDelayComponent } from './customer-delay.component';

describe('CustomerDelayComponent', () => {
  let component: CustomerDelayComponent;
  let fixture: ComponentFixture<CustomerDelayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDelayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
