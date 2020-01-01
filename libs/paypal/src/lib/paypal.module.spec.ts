import { async, TestBed } from '@angular/core/testing';
import { PaypalModule } from './paypal.module';

describe('PaypalModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PaypalModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PaypalModule).toBeDefined();
  });
});
