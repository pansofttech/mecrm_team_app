import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalespartsmgtWorklistComponent } from './salespartsmgt-worklist.component';

describe('SalespartsmgtWorklistComponent', () => {
  let component: SalespartsmgtWorklistComponent;
  let fixture: ComponentFixture<SalespartsmgtWorklistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalespartsmgtWorklistComponent]
    });
    fixture = TestBed.createComponent(SalespartsmgtWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
