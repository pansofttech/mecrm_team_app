import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceUpdateComponent } from './force-update.component';

describe('ForceUpdateComponent', () => {
  let component: ForceUpdateComponent;
  let fixture: ComponentFixture<ForceUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForceUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
