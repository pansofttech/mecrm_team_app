import { TestBed } from '@angular/core/testing';

import { PrlcService } from './prlc.service';

describe('PrlcService', () => {
  let service: PrlcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrlcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
