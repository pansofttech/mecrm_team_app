import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleDetailsEditComponent } from './module-details-edit.component';

describe('ModuleDetailsEditComponent', () => {
  let component: ModuleDetailsEditComponent;
  let fixture: ComponentFixture<ModuleDetailsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleDetailsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
