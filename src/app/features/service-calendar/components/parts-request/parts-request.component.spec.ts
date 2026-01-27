import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsRequestComponent } from './parts-request.component';

describe('PartsRequestComponent', () => {
  let component: PartsRequestComponent;
  let fixture: ComponentFixture<PartsRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartsRequestComponent]
    });
    fixture = TestBed.createComponent(PartsRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
