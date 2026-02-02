import { TestBed } from '@angular/core/testing';

import { PosStatsService } from './pos-stats-service';

describe('PosStatsService', () => {
  let service: PosStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
