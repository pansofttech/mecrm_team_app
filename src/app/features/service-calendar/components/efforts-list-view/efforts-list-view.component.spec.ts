import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffortsListViewComponent } from './efforts-list-view.component';

describe('EffortsListViewComponent', () => {
  let component: EffortsListViewComponent;
  let fixture: ComponentFixture<EffortsListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EffortsListViewComponent]
    });
    fixture = TestBed.createComponent(EffortsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
