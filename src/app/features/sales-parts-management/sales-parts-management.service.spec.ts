import { TestBed } from '@angular/core/testing';

import { SalesPartsManagementService } from './sales-parts-management.service';

describe('SalesPartsManagementService', () => {
  let service: SalesPartsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesPartsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
