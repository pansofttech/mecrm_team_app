import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsrequestDetailsComponent } from './partsrequest-details.component';

describe('PartsrequestDetailsComponent', () => {
  let component: PartsrequestDetailsComponent;
  let fixture: ComponentFixture<PartsrequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsrequestDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsrequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
