import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletionDetailsComponent } from './completion-details.component';

describe('CompletionDetailsComponent', () => {
  let component: CompletionDetailsComponent;
  let fixture: ComponentFixture<CompletionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
