import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosApplications } from './pos-applications';

describe('PosApplications', () => {
  let component: PosApplications;
  let fixture: ComponentFixture<PosApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosApplications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosApplications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
