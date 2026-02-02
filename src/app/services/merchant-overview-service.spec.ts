import { TestBed } from '@angular/core/testing';

import { MerchantOverviewService } from './merchant-overview-service';

describe('MerchantOverviewService', () => {
  let service: MerchantOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchantOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
