import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentPopUpComponent } from './attachment-pop-up.component';

describe('AttachmentPopUpComponent', () => {
  let component: AttachmentPopUpComponent;
  let fixture: ComponentFixture<AttachmentPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentPopUpComponent]
    });
    fixture = TestBed.createComponent(AttachmentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
