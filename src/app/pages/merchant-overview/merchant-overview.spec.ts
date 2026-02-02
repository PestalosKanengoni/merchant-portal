import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantOverview } from './merchant-overview';

describe('MerchantOverview', () => {
  let component: MerchantOverview;
  let fixture: ComponentFixture<MerchantOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
