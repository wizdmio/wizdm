import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPalButtons } from './paypal.component';

describe('PayPalButtons', () => {
  let component: PayPalButtons;
  let fixture: ComponentFixture<PayPalButtons>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayPalButtons ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayPalButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
