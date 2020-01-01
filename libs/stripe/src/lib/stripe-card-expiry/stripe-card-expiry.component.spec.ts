import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCardExpiry } from './stripe-card-expiry.component';

describe('StripeCardExpiry', () => {
  let component: StripeCardExpiry;
  let fixture: ComponentFixture<StripeCardExpiry>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeCardExpiry ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardExpiry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
