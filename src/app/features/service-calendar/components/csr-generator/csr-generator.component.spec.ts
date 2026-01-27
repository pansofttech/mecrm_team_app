import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsrGeneratorComponent } from './csr-generator.component';

describe('CsrGeneratorComponent', () => {
  let component: CsrGeneratorComponent;
  let fixture: ComponentFixture<CsrGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CsrGeneratorComponent]
    });
    fixture = TestBed.createComponent(CsrGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
