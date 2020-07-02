import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeIdeal } from './stripe-ideal.component';

describe('StripeIdeal', () => {
  let component: StripeIdeal;
  let fixture: ComponentFixture<StripeIdeal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeIdeal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeIdeal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
