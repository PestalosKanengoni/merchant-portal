import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosApplication } from './pos-application';

describe('PosApplication', () => {
  let component: PosApplication;
  let fixture: ComponentFixture<PosApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
