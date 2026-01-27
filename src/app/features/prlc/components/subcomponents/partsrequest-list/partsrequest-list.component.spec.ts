import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsrequestListComponent } from './partsrequest-list.component';

describe('PartsrequestListComponent', () => {
  let component: PartsrequestListComponent;
  let fixture: ComponentFixture<PartsrequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsrequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsrequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
