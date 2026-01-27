import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginDetailsComponent } from './margin-details.component';

describe('MarginDetailsComponent', () => {
  let component: MarginDetailsComponent;
  let fixture: ComponentFixture<MarginDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarginDetailsComponent]
    });
    fixture = TestBed.createComponent(MarginDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
