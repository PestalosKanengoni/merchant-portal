import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleTrader } from './sole-trader';

describe('SoleTrader', () => {
  let component: SoleTrader;
  let fixture: ComponentFixture<SoleTrader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoleTrader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoleTrader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
