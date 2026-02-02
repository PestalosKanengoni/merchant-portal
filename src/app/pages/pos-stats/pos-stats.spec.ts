import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosStats } from './pos-stats';

describe('PosStats', () => {
  let component: PosStats;
  let fixture: ComponentFixture<PosStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
