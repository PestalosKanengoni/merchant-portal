import { TestBed } from '@angular/core/testing';

import { PosApplicationServ } from './pos-applicationServ';

describe('PosApplication', () => {
  let service: PosApplicationServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosApplicationServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
