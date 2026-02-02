import { TestBed } from '@angular/core/testing';

import { AccountLinkingService } from './account-linkingService';

describe('AccountLinking', () => {
  let service: AccountLinkingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountLinkingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
