import { async, TestBed } from '@angular/core/testing';
import { StripeModule } from './stripe.module';

describe('StripeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StripeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(StripeModule).toBeDefined();
  });
});
