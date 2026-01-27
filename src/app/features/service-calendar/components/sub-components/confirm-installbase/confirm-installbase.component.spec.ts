import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInstallbaseComponent } from './confirm-installbase.component';

describe('ConfirmInstallbaseComponent', () => {
  let component: ConfirmInstallbaseComponent;
  let fixture: ComponentFixture<ConfirmInstallbaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmInstallbaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmInstallbaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
