import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLinking } from './account-linking';

describe('AccountLinking', () => {
  let component: AccountLinking;
  let fixture: ComponentFixture<AccountLinking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountLinking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountLinking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
