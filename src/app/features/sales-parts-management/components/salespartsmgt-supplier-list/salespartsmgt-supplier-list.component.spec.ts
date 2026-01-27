import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalespartsmgtSupplierListComponent } from './salespartsmgt-supplier-list.component';

describe('SalespartsmgtSupplierListComponent', () => {
  let component: SalespartsmgtSupplierListComponent;
  let fixture: ComponentFixture<SalespartsmgtSupplierListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalespartsmgtSupplierListComponent]
    });
    fixture = TestBed.createComponent(SalespartsmgtSupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
