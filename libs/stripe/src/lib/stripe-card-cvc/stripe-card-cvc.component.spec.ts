import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCardCvc } from './stripe-card-cvc.component';

describe('StripeCardCvc', () => {
  let component: StripeCardCvc;
  let fixture: ComponentFixture<StripeCardCvc>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeCardCvc ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardCvc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
