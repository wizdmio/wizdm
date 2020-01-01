import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeIban } from './stripe-iban.component';

describe('StripeIban', () => {
  let component: StripeIban;
  let fixture: ComponentFixture<StripeIban>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeIban ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeIban);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
