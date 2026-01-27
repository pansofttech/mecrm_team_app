import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallbaseModulesSalesconfigComponent } from './installbase-modules-salesconfig.component';

describe('InstallbaseModulesSalesconfigComponent', () => {
  let component: InstallbaseModulesSalesconfigComponent;
  let fixture: ComponentFixture<InstallbaseModulesSalesconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallbaseModulesSalesconfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallbaseModulesSalesconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
