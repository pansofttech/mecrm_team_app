import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsrequestWorklistComponent } from './partsrequest-worklist.component';

describe('PartsrequestWorklistComponent', () => {
  let component: PartsrequestWorklistComponent;
  let fixture: ComponentFixture<PartsrequestWorklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsrequestWorklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsrequestWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
